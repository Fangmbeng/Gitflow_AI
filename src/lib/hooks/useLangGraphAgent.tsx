// lib/hooks/useLangGraphAgent.ts
import { useState, useCallback, useRef } from 'react';
import { LangGraphMultiAgentService } from '@/src/app/api/llm/services/langGraphService';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  agentType?: 'master' | 'financial' | 'architecture' | 'documentation';
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
  technologies?: string[];
  deploymentStrategy?: string;
  securityMeasures?: string[];
  scalingStrategy?: string;
}

interface UserRequirements {
  businessType: string;
  sector: string;
  budget: string;
  audience: string;
}

interface UseLangGraphAgentReturn {
  isLoading: boolean;
  error: string | null;
  progress: string;
  processArchitectureRequest: (
    requirements: UserRequirements,
    prompt: string,
    sessionId: string,
    onMessage: (message: ChatMessage) => void,
    onArchitectures: (architectures: ArchitectureDesign[]) => void
  ) => Promise<void>;
  cancelRequest: () => void;
}

export const useLangGraphAgent = (): UseLangGraphAgentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const serviceRef = useRef<LangGraphMultiAgentService | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize service
  const getService = useCallback(() => {
    if (!serviceRef.current) {
      try {
        serviceRef.current = new LangGraphMultiAgentService();
      } catch (err) {
        console.error('Failed to initialize LangGraph service:', err);
        setError('Failed to initialize AI agents. Please check your API configuration.');
        return null;
      }
    }
    return serviceRef.current;
  }, []);

  const processArchitectureRequest = useCallback(async (
    requirements: UserRequirements,
    prompt: string,
    sessionId: string,
    onMessage: (message: ChatMessage) => void,
    onArchitectures: (architectures: ArchitectureDesign[]) => void
  ) => {
    setIsLoading(true);
    setError(null);
    setProgress('Initializing AI agents...');
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    const service = getService();
    if (!service) {
      setIsLoading(false);
      return;
    }

    try {
      // Validate requirements
      const missingRequirements = Object.entries(requirements)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

      if (missingRequirements.length > 0) {
        throw new Error(`Missing requirements: ${missingRequirements.join(', ')}`);
      }

      setProgress('Starting multi-agent analysis...');

      // Stream the workflow execution
      const workflowStream = await service.processArchitectureRequest(
        requirements,
        prompt,
        sessionId
      );

      let stepCount = 0;
      const totalSteps = 4; // master, financial, architecture, documentation

      for await (const update of workflowStream) {
        // Check for cancellation
        if (abortControllerRef.current?.signal.aborted) {
          setProgress('Request cancelled');
          setIsLoading(false);
          return;
        }

        // Handle errors
        if (update.errors && update.errors.length > 0) {
          console.error('Agent errors:', update.errors);
          setError(update.errors[0]);
          continue;
        }

        // Update progress based on current step
        switch (update.currentStep) {
          case 'master_analysis':
            setProgress('Master Agent analyzing requirements...');
            stepCount = 1;
            break;
          case 'financial_analysis':
            setProgress('Financial Agent calculating costs and ROI...');
            stepCount = 2;
            break;
          case 'architecture_generation':
            setProgress('Architecture Agent designing solutions...');
            stepCount = 3;
            break;
          case 'documentation':
            setProgress('Documentation Agent creating technical docs...');
            stepCount = 4;
            break;
          case 'complete':
            setProgress('Analysis complete!');
            break;
          case 'error':
            setError('An error occurred during processing');
            break;
        }

        // Handle new messages
        if (update.messages && update.messages.length > 0) {
          update.messages.forEach((message: ChatMessage) => {
            onMessage(message);
          });
        }

        // Handle completed architectures
        if (update.architectureDesigns && update.architectureDesigns.length > 0) {
          onArchitectures(update.architectureDesigns);
          setProgress(`Generated ${update.architectureDesigns.length} architecture designs`);
        }

        // Update progress percentage
        const progressPercentage = Math.round((stepCount / totalSteps) * 100);
        console.log(`Progress: ${progressPercentage}% - ${update.currentStep}`);
      }

      setProgress('Multi-agent analysis completed successfully');

    } catch (err) {
      console.error('LangGraph processing error:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          setError('OpenAI API key is missing or invalid. Please check your environment configuration.');
        } else if (err.message.includes('rate limit')) {
          setError('API rate limit exceeded. Please try again in a few minutes.');
        } else if (err.message.includes('Missing requirements')) {
          setError(err.message);
        } else {
          setError(`AI processing failed: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred during AI processing');
      }

      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Falling back to mock data for development');
        setTimeout(() => {
          onMessage({
            id: Date.now().toString(),
            content: 'Development Mode: Using mock data due to API error',
            isUser: false,
            timestamp: new Date(),
            agentType: 'master'
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [getService]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setProgress('Request cancelled by user');
    }
  }, []);

  return {
    isLoading,
    error,
    progress,
    processArchitectureRequest,
    cancelRequest
  };
};

// Alternative hook for direct API calls (fallback)
export const useDirectLLMCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callOpenAI = useCallback(async (
    prompt: string,
    systemPrompt: string,
    requirements: UserRequirements
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `${prompt}\n\nBusiness Context: ${JSON.stringify(requirements)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API call failed');
      }

      return data.content;

    } catch (err) {
      console.error('Direct LLM call error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    callOpenAI
  };
};