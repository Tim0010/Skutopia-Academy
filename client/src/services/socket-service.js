import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Handle reconnection
      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected to WebSocket server after', attemptNumber, 'attempts');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to real-time updates
  subscribe(event, callback) {
    if (!this.socket) {
      this.connect();
    }

    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  // Unsubscribe from updates
  unsubscribe(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Emit events
  emit(event, data) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit(event, data);
  }
}

export const socketService = new SocketService();
