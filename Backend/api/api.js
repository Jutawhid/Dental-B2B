const express = require("express");
const router = express.Router();
const api_v1 = require("./v1/v1")


router.use('/v1', api_v1);

router.get('/', (req, res) => {

    // req.socket_io.emit('notification', `Please select api version`);
    req.socket_io.emit('notification', {
        "receiverId": 1,
        "notification": "dsadasd",
        "isReceiveAll": 1,
        "receiverType": 1,
        "url":"saasa",
    });

    console.log("print")

    return res.status(200)
        .send({
            'status': 400,
            'message': "Please select api version",
            "success": true
        });
});



module.exports = router;