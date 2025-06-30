// app/api/llm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60 
        },
        { status: 429 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured. Please check server configuration.' 
        },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    const { 
      model = 'gpt-4-turbo-preview', 
      messages, 
      temperature = 0.7, 
      max_tokens = 4000,
      stream = false 
    } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Messages array is required and must not be empty' 
        },
        { status: 400 }
      );
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Each message must have role and content properties' 
          },
          { status: 400 }
        );
      }

      if (!['system', 'user', 'assistant'].includes(message.role)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Message role must be system, user, or assistant' 
          },
          { status: 400 }
        );
      }
    }

    // Validate model
    const allowedModels = [
      'gpt-4-turbo-preview',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];

    if (!allowedModels.includes(model)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Model ${model} is not allowed. Allowed models: ${allowedModels.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate parameters
    if (temperature < 0 || temperature > 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Temperature must be between 0 and 2' 
        },
        { status: 400 }
      );
    }

    if (max_tokens < 1 || max_tokens > 4096) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Max tokens must be between 1 and 4096' 
        },
        { status: 400 }
      );
    }

    console.log(`LLM API: Processing request with model ${model}, ${messages.length} messages`);

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      temperature,
      max_tokens,
      stream: false, // We'll handle streaming separately if needed
      user: rateLimitKey // For OpenAI usage tracking
    });

    // Extract response content
    const content = completion.choices[0]?.message?.content || '';
    
    if (!content) {
      console.warn('OpenAI returned empty content');
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI returned empty response' 
        },
        { status: 500 }
      );
    }

    // Log successful completion (without sensitive data)
    console.log(`LLM API: Successful completion, ${content.length} characters returned`);

    return NextResponse.json({
      success: true,
      content,
      usage: completion.usage,
      model: completion.model,
      created: completion.created
    });

  } catch (error: any) {
    console.error('LLM API Error:', error);

    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI quota exceeded. Please check your billing settings.' 
        },
        { status: 402 }
      );
    }

    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI rate limit exceeded. Please try again later.',
          retryAfter: 60 
        },
        { status: 429 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid OpenAI API key. Please check server configuration.' 
        },
        { status: 401 }
      );
    }

    if (error.code === 'model_not_found') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Model not found: ${error.message}` 
        },
        { status: 400 }
      );
    }

    if (error.code === 'context_length_exceeded') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message too long. Please reduce the content length.' 
        },
        { status: 400 }
      );
    }

    // Network or timeout errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Network timeout. Please try again.' 
        },
        { status: 503 }
      );
    }

    // Generic error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'LLM processing failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// // Handle streaming responses (for future implementation)
// export async function POST_STREAM(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { model = 'gpt-4-turbo-preview', messages, temperature = 0.7 } = body;

//     if (!process.env.OPENAI_API_KEY) {
//       throw new Error('OpenAI API key not configured');
//     }

//     const stream = await openai.chat.completions.create({
//       model,
//       messages,
//       temperature,
//       stream: true,
//     });

//     const encoder = new TextEncoder();
    
//     const readableStream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of stream) {
//             const content = chunk.choices[0]?.delta?.content || '';
//             if (content) {
//               const data = `data: ${JSON.stringify({ content })}\n\n`;
//               controller.enqueue(encoder.encode(data));
//             }
//           }
//           controller.enqueue(encoder.encode('data: [DONE]\n\n'));
//           controller.close();
//         } catch (error) {
//           controller.error(error);
//         }
//       },
//     });

//     return new Response(readableStream, {
//       headers: {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//       },
//     });

//   } catch (error) {
//     console.error('Streaming LLM API Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Streaming failed' 
//       },
//       { status: 500 }
//     );
//   }
// }

// // Health check endpoint
// export async function GET() {
//   return NextResponse.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     openai_configured: !!process.env.OPENAI_API_KEY
//   });
// }