import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentService } from '@/services/parent-service';

export function useParentDashboard() {
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const dashboardQuery = useQuery({
    queryKey: ['parent', 'dashboard'],
    queryFn: parentService.getDashboardData,
  });

  // Update child progress
  const updateChildProgressMutation = useMutation({
    mutationFn: parentService.updateChildProgress,
    onSuccess: (data) => {
      queryClient.setQueryData(['parent', 'dashboard'], (oldData) => ({
        ...oldData,
        children: oldData.children.map((child) =>
          child.id === data.childId ? { ...child, ...data.updates } : child
        ),
      }));
    },
  });

  // Schedule parent-teacher meeting
  const scheduleMeetingMutation = useMutation({
    mutationFn: parentService.scheduleParentTeacherMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries(['parent', 'dashboard']);
    },
  });

  return {
    dashboard: {
      data: dashboardQuery.data,
      isLoading: dashboardQuery.isLoading,
      isError: dashboardQuery.isError,
      error: dashboardQuery.error,
      refetch: dashboardQuery.refetch,
    },
    updateChildProgress: updateChildProgressMutation.mutate,
    scheduleMeeting: scheduleMeetingMutation.mutate,
  };
}
