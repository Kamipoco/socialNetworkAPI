module.exports = (io, socket) => {
    //console.log('a user is connected');
    const createMessage = (payload, fn) => {
        console.log(payload);
        fn("gui thanh cong");
        socket.broadcast.emit('new_message',payload);   
    }
    
    const readOrder = (orderId, callback) => {
      // ...
    }
  
    socket.on("new_message", createMessage);
    socket.on("order:read", readOrder);
  }