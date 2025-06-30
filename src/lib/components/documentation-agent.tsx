import { UserRequirements, ArchitectureDesign } from './orchestrator';
import { BaseAgent } from './base-agent';

export class DocumentationAgent extends BaseAgent {
    constructor() {
      super('documentation', 'gpt-4-turbo');
    }
  
    async generateDocumentation(architecture: ArchitectureDesign): Promise<string> {
      const systemPrompt = `
  You are a Technical Documentation AI Agent specializing in software architecture documentation.
  Generate comprehensive, professional documentation including:
  - Executive summary and overview
  - Detailed component descriptions
  - API specifications and data flow
  - Deployment and operational procedures
  - Security implementation details
  - Performance and scalability considerations
  - Troubleshooting and maintenance guides
  
  Format in clear, professional markdown.
  `;
  
      const userPrompt = `
  Generate comprehensive technical documentation for this architecture:
  
  Title: ${architecture.title}
  Description: ${architecture.description}
  Technologies: ${architecture.technologies.join(', ')}
  Deployment Strategy: ${architecture.deploymentStrategy}
  Security Measures: ${architecture.securityMeasures.join(', ')}
  
  Include:
  1. Executive Summary
  2. Architecture Overview
  3. Component Details
  4. Technology Stack
  5. Deployment Guide
  6. Security Implementation
  7. Monitoring and Observability
  8. Operational Procedures
  9. Performance Optimization
  10. Maintenance and Support
  
  Provide detailed, actionable documentation.
  `;
  
      return await this.callLLM(userPrompt, systemPrompt);
    }
  
    async generateRiskAnalysis(
      architecture: ArchitectureDesign, 
      requirements: UserRequirements
    ): Promise<string> {
      const systemPrompt = `
  You are a Risk Analysis AI Agent specializing in software architecture risk assessment.
  Analyze technical, operational, financial, and business risks.
  Provide mitigation strategies and future recommendations.
  `;
  
      const userPrompt = `
  Perform comprehensive risk analysis for:
  
  Architecture: ${architecture.title}
  Business Type: ${requirements.businessType}
  Sector: ${requirements.sector}
  Budget: ${requirements.budget}
  
  Analyze:
  1. Technical Risks (scalability, security, performance)
  2. Operational Risks (complexity, maintenance, skills)
  3. Financial Risks (cost overruns, ROI threats)
  4. Business Risks (market changes, compliance)
  5. Security and Compliance Risks
  6. Technology and Vendor Risks
  
  For each risk, provide:
  - Risk level (High/Medium/Low)
  - Impact assessment
  - Probability assessment
  - Mitigation strategies
  - Monitoring recommendations
  
  Include future recommendations for architecture evolution.
  `;
  
      return await this.callLLM(userPrompt, systemPrompt);
    }
  
    async process(input: ArchitectureDesign): Promise<{ documentation: string; riskAnalysis: string }> {
      const [documentation, riskAnalysis] = await Promise.all([
        this.generateDocumentation(input),
        this.generateRiskAnalysis(input, {} as UserRequirements)
      ]);
  
      return { documentation, riskAnalysis };
    }
  }