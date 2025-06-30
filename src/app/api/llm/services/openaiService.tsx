// lib/services/openaiService.ts
import OpenAI from 'openai';
import { LLMConfig } from '@/src/types/agents';

// Singleton OpenAI client
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.'
      );
    }

    openaiClient = new OpenAI({
      apiKey,
      maxRetries: 3,
      timeout: 60000, // 60 seconds
    });
  }

  return openaiClient;
}

// Helper function to validate API key
export async function validateOpenAIKey(): Promise<boolean> {
  try {
    const client = getOpenAIClient();
    // Make a minimal API call to validate the key
    await client.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI API key validation failed:', error);
    return false;
  }
}

// Enhanced error handling for OpenAI API calls
export async function callOpenAIWithRetry(
  messages: any[],
  config: LLMConfig,
  retries = 3
): Promise<string> {
  const client = getOpenAIClient();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        frequency_penalty: config.frequencyPenalty,
        presence_penalty: config.presencePenalty,
      });

      const content = completion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return content;

    } catch (error: any) {
      console.error(`OpenAI API attempt ${attempt} failed:`, error);

      // Handle specific error types
      if (error?.status === 429) {
        // Rate limit error - wait before retry
        const retryAfter = error.headers?.['retry-after'] || Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, retryAfter));
      } else if (error?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error?.status === 503) {
        // Service unavailable - wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      } else if (attempt === retries) {
        // Final attempt failed
        throw new Error(
          `OpenAI API call failed after ${retries} attempts: ${error.message || 'Unknown error'}`
        );
      }

      // Exponential backoff for other errors
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error('OpenAI API call failed unexpectedly');
}

// Streaming support for real-time responses
export async function* streamOpenAIResponse(
  messages: any[],
  config: LLMConfig
): AsyncGenerator<string, void, unknown> {
  const client = getOpenAIClient();

  try {
    const stream = await client.chat.completions.create({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    console.error('OpenAI streaming error:', error);
    throw new Error(
      `Streaming failed: ${error.message || 'Unknown error'}`
    );
  }
}

// Token counting utility
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// Cost estimation utility
export function estimateCost(tokens: number, model: string): number {
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  };

  const modelPricing = pricing[model] || pricing['gpt-4-turbo-preview'];
  // Assume 50/50 split between input and output for estimation
  return (tokens * 0.5 * modelPricing.input + tokens * 0.5 * modelPricing.output) / 1000;
}

// Model availability check
export async function checkModelAvailability(model: string): Promise<boolean> {
  try {
    const client = getOpenAIClient();
    const models = await client.models.list();
    return models.data.some(m => m.id === model);
  } catch (error) {
    console.error('Failed to check model availability:', error);
    return false;
  }
}

export default {
  getOpenAIClient,
  validateOpenAIKey,
  callOpenAIWithRetry,
  streamOpenAIResponse,
  estimateTokens,
  estimateCost,
  checkModelAvailability,
};