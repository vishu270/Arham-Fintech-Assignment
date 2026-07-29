import io from 'socket.io-client';

let socket = null;

/**
 * Connect to Socket.IO server
 * Called once on app initialization
 */
export const connectSocket = () => {
  if (socket) return socket;

  socket = io('http://localhost:5000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Socket.IO server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

/**
 * Get the socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

/**
 * Subscribe to an event
 * @param {string} event - Event name (e.g., 'clients:updated')
 * @param {function} callback - Function to call when event is received
 */
export const subscribeToEvent = (event, callback) => {
  const s = getSocket();
  s.on(event, callback);

  // Return unsubscribe function for cleanup
  return () => {
    s.off(event, callback);
  };
};

