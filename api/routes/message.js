module.exports = (io, socket) => {
    //console.log('a user is connected');
    const createMessage = (payload) => {
        console.log(payload);
        socket.emit('new_message',payload);   
    }
  
    const readOrder = (orderId, callback) => {
      // ...
    }
  
    socket.on("new_message", createMessage);
    socket.on("order:read", readOrder);
  }