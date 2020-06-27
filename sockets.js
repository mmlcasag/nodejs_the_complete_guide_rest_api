let io;

module.exports = {
    // this function is used at app.js to initialize our websockets connection
    init: httpServer => {
        io = require('socket.io')(httpServer);
        return io;
    },
    // this function returns our websockets connection
    // and we can use it whenever we want inside the application
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
}