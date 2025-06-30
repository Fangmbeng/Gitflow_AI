import { UserRequirements } from './orchestrator';
import { BaseAgent } from './base-agent';

export class FinancialAnalysisAgent extends BaseAgent {
    constructor() {
      super('financial', 'gpt-4-turbo');
    }
  
    async analyzeROI(requirements: UserRequirements): Promise<any> {
      const systemPrompt = `
  You are a Financial Analysis AI Agent specializing in technology investment ROI analysis.
  Your expertise includes:
  - Cloud infrastructure cost modeling
  - DevOps tooling and operational expense analysis
  - Security and compliance cost considerations
  - Scalability cost projections
  - Team and resource planning
  
  Provide detailed financial analysis with specific cost breakdowns and ROI projections.
  `;
  
      const userPrompt = `
  Provide comprehensive financial analysis for:
  
  Business Context:
  - Type: ${requirements.businessType}
  - Sector: ${requirements.sector}
  - Budget: ${requirements.budget}
  - Audience: ${requirements.audience}
  
  Requirements: ${requirements.prompt}
  
  Analyze and provide:
  1. Detailed cost breakdown by category (infrastructure, development, operations, security)
  2. 3-year ROI projection with different scenarios
  3. Cost optimization strategies
  4. Budget allocation recommendations
  5. Risk-adjusted financial forecasts
  6. Break-even analysis
  7. Operational cost projections
  
  Format as structured JSON with specific dollar amounts and percentages.
  `;
  
      const response = await this.callLLM(userPrompt, systemPrompt);
      return JSON.parse(response);
    }
  
    async generateDetailedReport(requirements: UserRequirements): Promise<string> {
      const analysis = await this.analyzeROI(requirements);
      
      const systemPrompt = `
  Generate a comprehensive financial report in markdown format based on the provided analysis.
  Include executive summary, detailed breakdowns, charts descriptions, and recommendations.
  `;
  
      return await this.callLLM(JSON.stringify(analysis), systemPrompt);
    }
  
    async process(input: UserRequirements): Promise<any> {
      return this.analyzeROI(input);
    }
  }
  