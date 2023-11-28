var express = require('express');
var router = express.Router();
const commonObject = require('../../common/common');

router.use(async function (req, res, next) {


    let userNameResponse  = await commonObject.characterLimitCheck(req.body.user_name, "User Name");

    if (userNameResponse.success == false) {
        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": userNameResponse.message,
                "data" : {
                    "user-name" : req.body.user_name
                }
            });
    } else {
        req.body.user_name = userNameResponse.data;
        next()
    }

});

module.exports = router;
