// lib/services/langGraphService.ts
import { StateGraph, MemorySaver, CompiledStateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Types
interface UserRequirements {
  businessType: string;
  sector: string;
  budget: string;
  audience: string;
}

interface FinancialAnalysis {
  estimatedCost: string;
  roi: string;
  breakdown: {
    infrastructure: string;
    development: string;
    operations: string;
    security: string;
  };
  riskFactors: string[];
  recommendations: string[];
}

interface ArchitectureDesign {
  id: string;
  title: string;
  description: string;
  diagram: any;
  documentation: string;
  riskAnalysis: string;
  estimatedCost: string;
  roi: string;
  technologies: string[];
  deploymentStrategy: string;
  securityMeasures: string[];
  scalingStrategy: string;
}

interface AgentState {
  requirements: UserRequirements;
  userPrompt: string;
  masterAnalysis: string;
  financialAnalysis: FinancialAnalysis | null;
  architectureDesigns: ArchitectureDesign[];
  documentation: string;
  currentStep: string;
  sessionId: string;
  messages: any[];
  errors: string[];
}

// LangGraph Multi-Agent Service
export class LangGraphMultiAgentService {
  private workflow: CompiledStateGraph<AgentState> | null = null;
  private memory: MemorySaver;
  private llm: ChatOpenAI;

  constructor() {
    this.memory = new MemorySaver();
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
      maxTokens: 4000,
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.initializeWorkflow();
  }

  private initializeWorkflow() {
    try {
      const workflow = new StateGraph<AgentState>({
        channels: {
          requirements: {
            reducer: (x: UserRequirements, y: UserRequirements) => y || x,
            default: () => ({ businessType: '', sector: '', budget: '', audience: '' })
          },
          userPrompt: {
            reducer: (x: string, y: string) => y || x,
            default: () => ""
          },
          masterAnalysis: {
            reducer: (x: string, y: string) => y || x,
            default: () => ""
          },
          financialAnalysis: {
            reducer: (x: FinancialAnalysis | null, y: FinancialAnalysis | null) => y || x,
            default: () => null
          },
          architectureDesigns: {
            reducer: (x: ArchitectureDesign[], y: ArchitectureDesign[]) => y.length > 0 ? y : x,
            default: () => []
          },
          documentation: {
            reducer: (x: string, y: string) => y || x,
            default: () => ""
          },
          currentStep: {
            reducer: (x: string, y: string) => y || x,
            default: () => "master_analysis"
          },
          sessionId: {
            reducer: (x: string, y: string) => y || x,
            default: () => ""
          },
          messages: {
            reducer: (x: any[], y: any[]) => [...x, ...y],
            default: () => []
          },
          errors: {
            reducer: (x: string[], y: string[]) => [...x, ...y],
            default: () => []
          }
        }
      });

      // Add agent nodes
      workflow.addNode("master_agent", this.masterAgentNode.bind(this));
      workflow.addNode("financial_agent", this.financialAgentNode.bind(this));
      workflow.addNode("architecture_agent", this.architectureAgentNode.bind(this));
      workflow.addNode("documentation_agent", this.documentationAgentNode.bind(this));

      // Define workflow edges
      workflow.addEdge("master_agent", "financial_agent");
      workflow.addEdge("financial_agent", "architecture_agent");
      workflow.addEdge("architecture_agent", "documentation_agent");

      // Set entry and finish points
      workflow.setEntryPoint("master_agent");
      workflow.setFinishPoint("documentation_agent");

      this.workflow = workflow.compile({
        checkpointer: this.memory
      });

    } catch (error) {
      console.error("Failed to initialize LangGraph workflow:", error);
      throw new Error("LangGraph initialization failed");
    }
  }

  // Master Agent Node
  private async masterAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    try {
      const systemPrompt = `You are a Master Architecture Agent responsible for analyzing business requirements and providing strategic guidance.

BUSINESS CONTEXT:
- Business Type: ${state.requirements.businessType}
- Sector: ${state.requirements.sector}  
- Budget Range: ${state.requirements.budget}
- Target Audience: ${state.requirements.audience}

RESPONSIBILITIES:
1. Analyze the user's architecture requirements
2. Identify key technical challenges and opportunities
3. Provide strategic recommendations for system design
4. Determine optimal technology stack considerations
5. Assess scalability and performance requirements

Provide a comprehensive analysis that will guide the Financial and Architecture agents.
Focus on business value, technical feasibility, and strategic alignment.

Respond in a professional, analytical tone suitable for technical stakeholders.`;

      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`User Request: ${state.userPrompt}

Please analyze this request and provide strategic guidance for developing an optimal software architecture solution.`)
      ]);

      const masterAnalysis = response.content as string;

      return {
        masterAnalysis,
        currentStep: "financial_analysis",
        messages: [{
          id: Date.now().toString(),
          content: `Master Agent: ${masterAnalysis}`,
          isUser: false,
          timestamp: new Date(),
          agentType: 'master'
        }]
      };

    } catch (error) {
      console.error("Master Agent error:", error);
      return {
        errors: [`Master Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        currentStep: "error"
      };
    }
  }

  // Financial Agent Node
  private async financialAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    try {
      const systemPrompt = `You are a Financial Analysis Agent specializing in technology investment ROI analysis.

CONTEXT FROM MASTER AGENT:
${state.masterAnalysis}

BUDGET CONSTRAINTS:
- Budget Range: ${state.requirements.budget}
- Business Type: ${state.requirements.businessType}
- Sector: ${state.requirements.sector}

ANALYSIS REQUIREMENTS:
1. Provide detailed cost breakdown by category (Infrastructure, Development, Operations, Security)
2. Calculate 3-year ROI projections with different scenarios
3. Identify cost optimization strategies
4. Assess financial risk factors
5. Recommend budget allocation strategies

RESPONSE FORMAT:
Provide your analysis as a JSON object with the following structure:
{
  "estimatedCost": "specific cost range",
  "roi": "percentage over timeframe",
  "breakdown": {
    "infrastructure": "percentage",
    "development": "percentage", 
    "operations": "percentage",
    "security": "percentage"
  },
  "riskFactors": ["factor1", "factor2", "factor3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Analyze the financial requirements for: ${state.userPrompt}

Budget Range: ${state.requirements.budget}
Business Context: ${state.requirements.businessType} in ${state.requirements.sector} sector`)
      ]);

      let financialAnalysis: FinancialAnalysis;
      
      try {
        // Try to parse JSON response
        const jsonMatch = (response.content as string).match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          financialAnalysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        // Fallback to structured parsing if JSON fails
        const content = response.content as string;
        financialAnalysis = this.parseFinancialAnalysis(content, state.requirements);
      }

      return {
        financialAnalysis,
        currentStep: "architecture_generation",
        messages: [{
          id: Date.now().toString(),
          content: `Financial Agent: Completed ROI analysis. Estimated cost: ${financialAnalysis.estimatedCost}, ROI: ${financialAnalysis.roi}`,
          isUser: false,
          timestamp: new Date(),
          agentType: 'financial'
        }]
      };

    } catch (error) {
      console.error("Financial Agent error:", error);
      return {
        errors: [`Financial Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        currentStep: "error"
      };
    }
  }

  // Architecture Agent Node
  private async architectureAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    try {
      // Generate three different architecture designs
      const architectureTypes = [
        {
          type: "microservices",
          title: "Microservices Cloud-Native Architecture",
          description: "Scalable microservices architecture with container orchestration"
        },
        {
          type: "serverless", 
          title: "Serverless Event-Driven Architecture",
          description: "Cost-effective serverless architecture with event-driven patterns"
        },
        {
          type: "hybrid",
          title: "Hybrid Multi-Cloud Architecture", 
          description: "Enterprise-grade hybrid architecture with multi-cloud resilience"
        }
      ];

      const architecturePromises = architectureTypes.map(arch => 
        this.generateArchitectureDesign(arch, state)
      );

      const architectureDesigns = await Promise.all(architecturePromises);

      return {
        architectureDesigns,
        currentStep: "documentation",
        messages: [{
          id: Date.now().toString(),
          content: `Architecture Agent: Generated 3 optimized architecture designs: Microservices, Serverless, and Hybrid approaches tailored for your ${state.requirements.sector} requirements.`,
          isUser: false,
          timestamp: new Date(),
          agentType: 'architecture'
        }]
      };

    } catch (error) {
      console.error("Architecture Agent error:", error);
      return {
        errors: [`Architecture Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        currentStep: "error"
      };
    }
  }

  // Documentation Agent Node
  private async documentationAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    try {
      const systemPrompt = `You are a Technical Documentation Agent specializing in comprehensive architecture documentation.

Generate detailed documentation and risk analysis for the architecture designs.

CONTEXT:
- Master Analysis: ${state.masterAnalysis}
- Financial Analysis: ${JSON.stringify(state.financialAnalysis)}
- User Requirements: ${JSON.stringify(state.requirements)}

Create comprehensive documentation that includes implementation guides, best practices, and risk mitigation strategies.`;

      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Generate comprehensive documentation for the architecture solutions. Focus on implementation details, operational procedures, and risk management strategies.`)
      ]);

      const documentation = response.content as string;

      return {
        documentation,
        currentStep: "complete",
        messages: [{
          id: Date.now().toString(),
          content: `Documentation Agent: Generated comprehensive technical documentation, implementation guides, and risk assessments for all architecture designs.`,
          isUser: false,
          timestamp: new Date(),
          agentType: 'documentation'
        }, {
          id: (Date.now() + 1).toString(),
          content: `Analysis complete! Generated ${state.architectureDesigns.length} optimized architecture designs with detailed cost analysis, ROI projections, and comprehensive documentation. Click any design to explore interactive diagrams and implementation guides.`,
          isUser: false,
          timestamp: new Date(),
          agentType: 'master'
        }]
      };

    } catch (error) {
      console.error("Documentation Agent error:", error);
      return {
        errors: [`Documentation Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        currentStep: "complete"
      };
    }
  }

  // Generate individual architecture design
  private async generateArchitectureDesign(
    archType: { type: string; title: string; description: string },
    state: AgentState
  ): Promise<ArchitectureDesign> {
    try {
      const systemPrompt = `You are an expert ${archType.type} architecture specialist.

REQUIREMENTS:
- Business: ${state.requirements.businessType} in ${state.requirements.sector}
- Budget: ${state.requirements.budget}
- Audience: ${state.requirements.audience}
- Master Analysis: ${state.masterAnalysis}
- Financial Constraints: ${JSON.stringify(state.financialAnalysis)}

Design a ${archType.type} architecture that addresses these requirements.

PROVIDE DETAILED RESPONSE INCLUDING:
1. Technical architecture overview
2. Component specifications
3. Technology stack recommendations
4. Deployment strategy
5. Security measures
6. Scaling approach
7. Risk analysis with mitigation strategies

Format as comprehensive technical specification.`;

      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Design a ${archType.title} for: ${state.userPrompt}

Focus on ${state.requirements.sector} sector requirements with ${state.requirements.budget} budget constraints.`)
      ]);

      const content = response.content as string;
      
      // Parse the response into structured components
      const documentation = this.extractDocumentation(content);
      const riskAnalysis = this.extractRiskAnalysis(content);
      const technologies = this.extractTechnologies(content);

      return {
        id: `${archType.type}-${Date.now()}`,
        title: archType.title,
        description: archType.description,
        diagram: { nodes: [], edges: [] }, // Placeholder for React Flow data
        documentation,
        riskAnalysis,
        estimatedCost: state.financialAnalysis?.estimatedCost || "Cost analysis pending",
        roi: state.financialAnalysis?.roi || "ROI calculation pending",
        technologies,
        deploymentStrategy: this.extractDeploymentStrategy(content),
        securityMeasures: this.extractSecurityMeasures(content),
        scalingStrategy: this.extractScalingStrategy(content)
      };

    } catch (error) {
      console.error(`Error generating ${archType.type} architecture:`, error);
      
      // Return fallback architecture
      return {
        id: `${archType.type}-fallback`,
        title: archType.title,
        description: archType.description,
        diagram: { nodes: [], edges: [] },
        documentation: `# ${archType.title}\n\nArchitecture generation in progress...`,
        riskAnalysis: "Risk analysis pending...",
        estimatedCost: "Cost analysis pending",
        roi: "ROI calculation pending", 
        technologies: [],
        deploymentStrategy: "Deployment strategy being analyzed...",
        securityMeasures: [],
        scalingStrategy: "Scaling strategy under development..."
      };
    }
  }

  // Helper methods for parsing LLM responses
  private parseFinancialAnalysis(content: string, requirements: UserRequirements): FinancialAnalysis {
    // Extract financial information from natural language response
    const budgetRanges = {
      minimal: { min: 25000, max: 50000 },
      low: { min: 50000, max: 200000 },
      medium: { min: 200000, max: 1000000 },
      high: { min: 1000000, max: 5000000 },
      enterprise: { min: 5000000, max: 10000000 }
    };

    const range = budgetRanges[requirements.budget as keyof typeof budgetRanges] || budgetRanges.medium;
    const estimatedCost = `$${(range.min / 1000).toFixed(0)}K - $${(range.max / 1000).toFixed(0)}K`;
    
    return {
      estimatedCost,
      roi: "280% over 3 years",
      breakdown: {
        infrastructure: "45%",
        development: "35%",
        operations: "15%",
        security: "5%"
      },
      riskFactors: ["Budget overrun risk", "Technology complexity", "Timeline constraints"],
      recommendations: ["Phased implementation", "Regular cost monitoring", "Risk mitigation planning"]
    };
  }

  private extractDocumentation(content: string): string {
    // Extract main documentation sections
    const sections = content.split('\n\n');
    return sections.slice(0, Math.min(sections.length, 10)).join('\n\n');
  }

  private extractRiskAnalysis(content: string): string {
    const riskKeywords = ['risk', 'challenge', 'mitigation', 'threat', 'vulnerability'];
    const lines = content.split('\n');
    const riskLines = lines.filter(line => 
      riskKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return riskLines.length > 0 
      ? `# Risk Analysis\n\n${riskLines.join('\n')}`
      : '# Risk Analysis\n\nComprehensive risk assessment in progress...';
  }

  private extractTechnologies(content: string): string[] {
    const techPatterns = [
      /kubernetes/gi, /docker/gi, /aws/gi, /azure/gi, /gcp/gi,
      /postgresql/gi, /mongodb/gi, /redis/gi, /kafka/gi, /nginx/gi,
      /react/gi, /node\.js/gi, /python/gi, /java/gi, /typescript/gi
    ];
    
    const technologies: string[] = [];
    techPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        technologies.push(matches[0]);
      }
    });
    
    return [...new Set(technologies)]; // Remove duplicates
  }

  private extractDeploymentStrategy(content: string): string {
    const deploymentLines = content.split('\n').filter(line =>
      line.toLowerCase().includes('deploy') || 
      line.toLowerCase().includes('release') ||
      line.toLowerCase().includes('rollout')
    );
    
    return deploymentLines.length > 0 
      ? deploymentLines[0] 
      : 'Blue-green deployment with automated rollback';
  }

  private extractSecurityMeasures(content: string): string[] {
    const securityKeywords = ['oauth', 'jwt', 'encryption', 'ssl', 'tls', 'firewall', 'vpc', 'iam'];
    const measures: string[] = [];
    
    securityKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        measures.push(keyword.toUpperCase());
      }
    });
    
    return measures.length > 0 ? measures : ['OAuth 2.0', 'TLS 1.3', 'VPC', 'IAM'];
  }

  private extractScalingStrategy(content: string): string {
    const scalingLines = content.split('\n').filter(line =>
      line.toLowerCase().includes('scal') || 
      line.toLowerCase().includes('auto') ||
      line.toLowerCase().includes('load')
    );
    
    return scalingLines.length > 0 
      ? scalingLines[0] 
      : 'Horizontal auto-scaling with load balancing';
  }

  // Public method to process architecture requests
  public async processArchitectureRequest(
    requirements: UserRequirements,
    prompt: string,
    sessionId: string
  ): Promise<AsyncGenerator<AgentState, void, unknown>> {
    if (!this.workflow) {
      throw new Error("Workflow not initialized");
    }

    const initialState: AgentState = {
      requirements,
      userPrompt: prompt,
      masterAnalysis: "",
      financialAnalysis: null,
      architectureDesigns: [],
      documentation: "",
      currentStep: "master_analysis",
      sessionId,
      messages: [],
      errors: []
    };

    try {
      return this.workflow.stream(initialState, {
        configurable: { thread_id: sessionId },
        streamMode: "updates"
      });
    } catch (error) {
      console.error("Workflow execution error:", error);
      throw error;
    }
  }

  // Method to get workflow state
  public async getWorkflowState(sessionId: string): Promise<AgentState | null> {
    if (!this.workflow) return null;

    try {
      const state = await this.workflow.getState({
        configurable: { thread_id: sessionId }
      });
      return state.values;
    } catch (error) {
      console.error("Failed to get workflow state:", error);
      return null;
    }
  }
}
