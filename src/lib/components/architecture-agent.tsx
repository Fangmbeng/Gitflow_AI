import { UserRequirements, ArchitectureDesign } from './orchestrator';
import { BaseAgent } from './base-agent';

export class ArchitectureAgent extends BaseAgent {
    constructor() {
      super('architecture', 'gpt-4-turbo');
    }
  
    async generateMicroservicesArchitecture(
      requirements: UserRequirements, 
      financialAnalysis: any
    ): Promise<ArchitectureDesign> {
      const systemPrompt = `
  You are an Expert Software Architecture AI Agent specializing in microservices design.
  Your expertise includes:
  - Domain-driven design and service boundaries
  - API design and service mesh implementation
  - Container orchestration with Kubernetes
  - Database design and data consistency patterns
  - Security architecture and zero-trust principles
  - DevSecOps practices and CI/CD pipeline design
  - Cloud-native patterns and scalability strategies
  
  Generate comprehensive, production-ready microservices architecture.
  `;
  
      const userPrompt = `
  Design a microservices architecture for:
  
  Business Requirements:
  - Type: ${requirements.businessType}
  - Sector: ${requirements.sector}  
  - Budget: ${requirements.budget}
  - Audience: ${requirements.audience}
  - Specific needs: ${requirements.prompt}
  
  Financial Constraints:
  ${JSON.stringify(financialAnalysis, null, 2)}
  
  Provide a detailed architecture including:
  1. Service decomposition strategy
  2. Technology stack with specific versions
  3. Database design and data flow
  4. Security implementation details
  5. Monitoring and observability strategy
  6. Deployment and scaling approach
  7. React Flow diagram data structure
  8. DevSecOps pipeline integration
  
  Format response as JSON with ReactFlowData structure for diagram visualization.
  `;
  
      const response = await this.callLLM(userPrompt, systemPrompt);
      return this.parseArchitectureResponse(response, 'microservices');
    }
  
    async generateServerlessArchitecture(
      requirements: UserRequirements, 
      financialAnalysis: any
    ): Promise<ArchitectureDesign> {
      const systemPrompt = `
  You are an Expert Serverless Architecture AI Agent.
  Design event-driven, cost-optimized serverless solutions with:
  - Function-as-a-Service (FaaS) patterns
  - Event-driven architecture design
  - Serverless database and storage strategies
  - API Gateway and edge computing
  - Cost optimization and cold start mitigation
  - Security and compliance in serverless environments
  `;
  
      const userPrompt = `
  Design a serverless architecture optimized for cost and scalability:
  
  Requirements: ${JSON.stringify(requirements)}
  Financial Analysis: ${JSON.stringify(financialAnalysis)}
  
  Focus on:
  1. Event-driven service design
  2. Serverless technology selection
  3. Cost optimization strategies
  4. Performance and latency considerations
  5. Security and compliance implementation
  6. Monitoring and debugging approaches
  7. CI/CD for serverless deployment
  
  Provide JSON response with ReactFlowData structure.
  `;
  
      const response = await this.callLLM(userPrompt, systemPrompt);
      return this.parseArchitectureResponse(response, 'serverless');
    }
  
    async generateHybridArchitecture(
      requirements: UserRequirements, 
      financialAnalysis: any
    ): Promise<ArchitectureDesign> {
      const systemPrompt = `
  You are an Expert Hybrid Cloud Architecture AI Agent.
  Design multi-cloud, hybrid solutions featuring:
  - Multi-cloud deployment strategies
  - Edge computing integration
  - Disaster recovery and business continuity
  - Compliance across jurisdictions
  - Hybrid networking and security
  - Cost optimization across providers
  `;
  
      const userPrompt = `
  Design a hybrid multi-cloud architecture for enterprise resilience:
  
  Requirements: ${JSON.stringify(requirements)}
  Financial Analysis: ${JSON.stringify(financialAnalysis)}
  
  Include:
  1. Multi-cloud service distribution
  2. Edge computing strategy
  3. Data residency and compliance
  4. Disaster recovery implementation
  5. Network architecture and security
  6. Operational complexity management
  7. Cost optimization across clouds
  
  Provide JSON response with ReactFlowData structure.
  `;
  
      const response = await this.callLLM(userPrompt, systemPrompt);
      return this.parseArchitectureResponse(response, 'hybrid');
    }
  
    private parseArchitectureResponse(response: string, type: string): ArchitectureDesign {
      try {
        const parsed = JSON.parse(response);
        return {
          id: `${type}-${Date.now()}`,
          title: parsed.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Architecture`,
          description: parsed.description || '',
          diagram: parsed.diagram || { nodes: [], edges: [] },
          documentation: '',
          riskAnalysis: '',
          estimatedCost: parsed.estimatedCost || 'TBD',
          roi: parsed.roi || 'TBD',
          technologies: parsed.technologies || [],
          deploymentStrategy: parsed.deploymentStrategy || '',
          securityMeasures: parsed.securityMeasures || [],
          scalingStrategy: parsed.scalingStrategy || ''
        };
      } catch (error) {
        console.error('Error parsing architecture response:', error);
        return this.getDefaultArchitecture(type);
      }
    }
  
    private getDefaultArchitecture(type: string): ArchitectureDesign {
      return {
        id: `${type}-default`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Architecture`,
        description: 'Architecture design in progress...',
        diagram: { nodes: [], edges: [] },
        documentation: '',
        riskAnalysis: '',
        estimatedCost: 'TBD',
        roi: 'TBD',
        technologies: [],
        deploymentStrategy: '',
        securityMeasures: [],
        scalingStrategy: ''
      };
    }
  
    async refineArchitecture(
      architectureId: string,
      userFeedback: string,
      requirements: UserRequirements
    ): Promise<ArchitectureDesign> {
      const systemPrompt = `
  You are refining an existing architecture based on user feedback.
  Analyze the feedback and provide improved architecture design.
  `;
  
      const userPrompt = `
  Refine architecture ${architectureId} based on this feedback:
  ${userFeedback}
  
  Original requirements: ${JSON.stringify(requirements)}
  
  Provide updated architecture design as JSON.
  `;
  
      const response = await this.callLLM(userPrompt, systemPrompt);
      return this.parseArchitectureResponse(response, 'refined');
    }
  
    async process(input: any): Promise<ArchitectureDesign[]> {
      const { requirements, financialAnalysis } = input;
      return Promise.all([
        this.generateMicroservicesArchitecture(requirements, financialAnalysis),
        this.generateServerlessArchitecture(requirements, financialAnalysis),
        this.generateHybridArchitecture(requirements, financialAnalysis)
      ]);
    }
  }
  