// Base Agent Class

export abstract class BaseAgent {
    protected agentType: string;
    protected model: string;
  
    constructor(agentType: string, model: string = 'gpt-4') {
      this.agentType = agentType;
      this.model = model;
    }
  
    protected async callLLM(prompt: string, systemPrompt?: string): Promise<string> {
      // This would integrate with your preferred LLM service
      // OpenAI, Anthropic, or local models
      try {
        const response = await fetch('/api/llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt }
            ]
          })
        });
  
        const data = await response.json();
        return data.content;
      } catch (error) {
        console.error(`Error calling LLM for ${this.agentType}:`, error);
        throw error;
      }
    }
  
    abstract process(input: any): Promise<any>;
  }