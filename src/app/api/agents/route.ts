// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MultiAgentOrchestrator, UserRequirements } from '@/src/lib/components/orchestrator';

const orchestrator = new MultiAgentOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requirements, action, architectureId, feedback }: {
      requirements: UserRequirements;
      action: 'generate' | 'refine' | 'financial';
      architectureId?: string;
      feedback?: string;
    } = body;

    let result;

    switch (action) {
      case 'generate':
        result = await orchestrator.processRequest(requirements);
        break;
      
      case 'refine':
        if (!architectureId || !feedback) {
          return NextResponse.json(
            { error: 'Architecture ID and feedback required for refinement' },
            { status: 400 }
          );
        }
        result = await orchestrator.refineArchitecture(architectureId, feedback, requirements);
        break;
      
      case 'financial':
        result = await orchestrator.generateFinancialReport(requirements);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

