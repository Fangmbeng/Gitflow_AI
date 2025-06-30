// lib/hooks/useAgents.ts
import { useState, useCallback } from 'react';
import { UserRequirements, ArchitectureDesign } from '@/src/lib/components/orchestrator';

interface UseAgentsReturn {
  isLoading: boolean;
  error: string | null;
  generateArchitectures: (requirements: UserRequirements) => Promise<ArchitectureDesign[]>;
  refineArchitecture: (architectureId: string, feedback: string, requirements: UserRequirements) => Promise<ArchitectureDesign>;
  generateFinancialReport: (requirements: UserRequirements) => Promise<string>;
}

export const useAgents = (): UseAgentsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateArchitectures = useCallback(async (requirements: UserRequirements): Promise<ArchitectureDesign[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements,
          action: 'generate'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate architectures');
      }

      return data.data.architectures;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refineArchitecture = useCallback(async (
    architectureId: string, 
    feedback: string, 
    requirements: UserRequirements
  ): Promise<ArchitectureDesign> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements,
          action: 'refine',
          architectureId,
          feedback
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to refine architecture');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateFinancialReport = useCallback(async (requirements: UserRequirements): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements,
          action: 'financial'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate financial report');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    generateArchitectures,
    refineArchitecture,
    generateFinancialReport
  };
};
