export const initOrderSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-order', (orderId) => {
      if (orderId) {
        socket.join(`order-${orderId}`);
        socket.emit('joined-order', { orderId, message: 'Subscribed to order updates' });
      }
    });

    socket.on('leave-order', (orderId) => {
      if (orderId) {
        socket.leave(`order-${orderId}`);
      }
    });

    socket.on('join-user', (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
      }
    });

    socket.on('leave-user', (userId) => {
      if (userId) {
        socket.leave(`user-${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default initOrderSocket;
