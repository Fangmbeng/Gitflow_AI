// types/agents.ts
export interface UserRequirements {
    businessType: string;
    sector: string;
    budget: string;
    audience: string;
  }
  
  export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    agentType?: AgentType;
  }
  
  export type AgentType = 'master' | 'financial' | 'architecture' | 'documentation';
  
  export interface FinancialAnalysis {
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
  
  export interface ArchitectureDesign {
    id: string;
    title: string;
    description: string;
    diagram: ArchitectureDiagram;
    documentation: string;
    riskAnalysis: string;
    estimatedCost: string;
    roi: string;
    technologies: string[];
    deploymentStrategy: string;
    securityMeasures: string[];
    scalingStrategy: string;
  }
  
  export interface ArchitectureDiagram {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  }
  
  export interface DiagramNode {
    id: string;
    type: 'service' | 'database' | 'cache' | 'queue' | 'gateway' | 'external';
    position: { x: number; y: number };
    data: {
      label: string;
      description?: string;
      technology?: string;
      icon?: string;
    };
  }
  
  export interface DiagramEdge {
    id: string;
    source: string;
    target: string;
    type: 'http' | 'grpc' | 'async' | 'sync' | 'data';
    animated?: boolean;
    label?: string;
  }
  
  export interface AgentState {
    requirements: UserRequirements;
    userPrompt: string;
    masterAnalysis: string;
    financialAnalysis: FinancialAnalysis | null;
    architectureDesigns: ArchitectureDesign[];
    documentation: string;
    currentStep: AgentStep;
    sessionId: string;
    messages: ChatMessage[];
    errors: string[];
  }
  
  export type AgentStep = 
    | 'master_analysis' 
    | 'financial_analysis' 
    | 'architecture_generation' 
    | 'documentation' 
    | 'complete' 
    | 'error';
  
  export interface ChatSession {
    id: string;
    title: string;
    timestamp: Date;
    requirements: UserRequirements;
    messages: ChatMessage[];
    architectures: ArchitectureDesign[];
  }
  
  export interface LLMConfig {
    model: string;
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  }
  
  export interface AgentConfig {
    type: AgentType;
    llmConfig: LLMConfig;
    retryAttempts: number;
    timeout: number;
  }
  
  export interface WorkflowConfig {
    maxExecutionTime: number;
    checkpointInterval: number;
    enableStreaming: boolean;
    enableCaching: boolean;
  }
  
  // Business configuration types
  export const BusinessTypes = {
    startup: "Startup",
    enterprise: "Enterprise",
    smb: "Small/Medium Business",
    nonprofit: "Non-Profit",
    government: "Government",
  } as const;
  
  export const Sectors = {
    fintech: "FinTech",
    healthcare: "Healthcare",
    ecommerce: "E-commerce",
    education: "Education",
    logistics: "Logistics",
    social: "Social / Media",
    gaming: "Gaming",
    iot: "IoT / Embedded",
  } as const;
  
  export const Budgets = {
    minimal: "Minimal (<$50K)",
    low: "Low ($50K – $200K)",
    medium: "Medium ($200K – $1M)",
    high: "High ($1M – $5M)",
    enterprise: "Enterprise (>$5M)",
  } as const;
  
  export const Audiences = {
    consumer: "General Consumers",
    business: "Business Users",
    developer: "Developers",
    enterprise: "Enterprise Clients",
    government: "Government Orgs",
  } as const;