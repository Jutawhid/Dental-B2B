const verifyToken = require('../middlewares/jwt_verify/verifyTokenForSocket');
const messageModel = require('../models/message');
const commonObject = require('../common/common');

let createSocketConnection = (http) => {

    const io = require("socket.io")(http, {
        cors: {
            origins: [
                "http://localhost:8080",
                "http://localhost:3000",
                "http://192.168.10.208:8080",
            ],
        },
    })

    io.use(async (socket, next) => {
        const token = await socket.handshake.auth.token;
        let tokenDecodedData = await verifyToken.socketTokenVerify(token);

        if (tokenDecodedData.success === true) {
            // console.warn("socket connection");
            next();
        } else {
            return {
                    "success": false,
                    "status": 400,
                    "message": "Unauthorize Request"
                };
        }
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            // console.log('user disconnected');
        });


        socket.on('my message', async (msgObject) => {
            if(msgObject.hasOwnProperty('receiverId') && msgObject.hasOwnProperty("message")){
                const token = await socket.handshake.auth.token;

                let tokenDecodedData = await verifyToken.socketTokenVerify(token);
               
                if (tokenDecodedData.success === true) {
                    tokenDecodedData = tokenDecodedData.data;

                    let newMessage = {
                        created_by: tokenDecodedData.userInfo.id,
                        updated_by: tokenDecodedData.userInfo.id,
                        sender_id: tokenDecodedData.userInfo.id,
                        receiver_id: msgObject.receiverId,
                        message_body: msgObject.message,
                        message_type: "text",
                        status: 1,
                        created_at: await commonObject.getGMT(),
                        updated_at: await commonObject.getGMT()
                    }
    
                    messageModel.addNewMessage(newMessage);
    
                    io.emit('my broadcast message', {
                        "receiverId": msgObject.receiverId,
                        "senderId": newMessage.sender_id,
                        "message": msgObject.message,
                    });
                } 

                
            } else {
                io.emit('my broadcast message', {
                    message: `Unknown Message`
                });
            }
            
        });
    });

    return io;

}

module.exports = {
    createSocketConnection
}
