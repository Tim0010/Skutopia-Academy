import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useAsync(asyncFunction, immediate = false) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (...params) => {
      setStatus('pending');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        toast({
          title: 'Error',
          description: error.message || 'An error occurred',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [asyncFunction, toast]
  );

  // Execute immediately if requested
  useState(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
}
