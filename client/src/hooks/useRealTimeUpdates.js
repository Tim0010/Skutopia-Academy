import { useEffect } from 'react';
import { socketService } from '@/services/socket-service';

export function useRealTimeUpdates(events) {
  useEffect(() => {
    // Connect to socket server
    socketService.connect();

    // Subscribe to all events
    events.forEach(({ event, callback }) => {
      socketService.subscribe(event, callback);
    });

    // Cleanup on unmount
    return () => {
      events.forEach(({ event }) => {
        socketService.unsubscribe(event);
      });
    };
  }, [events]);

  return socketService;
}
