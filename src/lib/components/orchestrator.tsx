// lib/agents/orchestrator.ts
import { LangChainAgent } from './langchain-agent';
import { FinancialAnalysisAgent } from './financial-agent';
import { ArchitectureAgent } from './architecture-agent';
import { DocumentationAgent } from './documentation-agent';

export interface UserRequirements {
  businessType: 'startup' | 'enterprise' | 'smb' | 'nonprofit' | 'government';
  sector: 'fintech' | 'healthcare' | 'ecommerce' | 'education' | 'logistics' | 'social' | 'gaming' | 'iot';
  budget: 'minimal' | 'low' | 'medium' | 'high' | 'enterprise';
  audience: 'consumer' | 'business' | 'developer' | 'enterprise' | 'government';
  prompt: string;
}

export interface ArchitectureDesign {
  id: string;
  title: string;
  description: string;
  diagram: ReactFlowData;
  documentation: string;
  riskAnalysis: string;
  estimatedCost: string;
  roi: string;
  technologies: string[];
  deploymentStrategy: string;
  securityMeasures: string[];
  scalingStrategy: string;
}

export interface ReactFlowData {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { label: string; description?: string; technology?: string };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
  }>;
}

export class MultiAgentOrchestrator {
  private masterAgent: LangChainAgent;
  private financialAgent: FinancialAnalysisAgent;
  private architectureAgent: ArchitectureAgent;
  private documentationAgent: DocumentationAgent;

  constructor() {
    this.masterAgent = new LangChainAgent('master');
    this.financialAgent = new FinancialAnalysisAgent();
    this.architectureAgent = new ArchitectureAgent();
    this.documentationAgent = new DocumentationAgent();
  }

  async processRequest(requirements: UserRequirements): Promise<{
    decision: string;
    architectures: ArchitectureDesign[];
    financialAnalysis: any;
  }> {
    try {
      // Step 1: Master Agent Decision
      const decision = await this.masterAgent.makeDecision(requirements);
      
      // Step 2: Generate Financial Analysis
      const financialAnalysis = await this.financialAgent.analyzeROI(requirements);
      
      // Step 3: Generate Architecture Designs
      const architectures = await this.generateArchitectures(requirements, financialAnalysis);
      
      return {
        decision,
        architectures,
        financialAnalysis
      };
    } catch (error) {
      console.error('Error in multi-agent processing:', error);
      throw new Error('Failed to process request through multi-agent system');
    }
  }

  private async generateArchitectures(
    requirements: UserRequirements, 
    financialAnalysis: any
  ): Promise<ArchitectureDesign[]> {
    const architecturePromises = [
      this.architectureAgent.generateMicroservicesArchitecture(requirements, financialAnalysis),
      this.architectureAgent.generateServerlessArchitecture(requirements, financialAnalysis),
      this.architectureAgent.generateHybridArchitecture(requirements, financialAnalysis)
    ];

    const architectures = await Promise.all(architecturePromises);
    
    // Generate documentation for each architecture
    for (const architecture of architectures) {
      architecture.documentation = await this.documentationAgent.generateDocumentation(architecture);
      architecture.riskAnalysis = await this.documentationAgent.generateRiskAnalysis(architecture, requirements);
    }

    return architectures;
  }

  async refineArchitecture(
    architectureId: string, 
    userFeedback: string, 
    requirements: UserRequirements
  ): Promise<ArchitectureDesign> {
    return await this.architectureAgent.refineArchitecture(architectureId, userFeedback, requirements);
  }

  async generateFinancialReport(requirements: UserRequirements): Promise<string> {
    return await this.financialAgent.generateDetailedReport(requirements);
  }
}
