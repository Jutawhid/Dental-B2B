var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");

const commonObject = require('../../common/common');

router.use(async function (req, res, next) {
    const token = req.body.token;

    // console.log("token: ", token);

    if (token) {
        jwt.verify(token, global.config.secretKey,
            {
                algorithm: global.config.algorithm

            }, async function (err, decoded) {
                if (err) {
                    let errorData = {
                        message: err.message,
                        expiredAt: err.expiredAt
                    };

                    return res.status(401)
                        .send({
                            "success": false,
                            "status": 401,
                            "message": "Link Expired"
                        });
                }

                try {

                    req.body.decoded = decoded;
                    req.body.token = token;

                    next();

                } catch (error) {
                    return res.status(500).send({
                        "success": false,
                        "status": 500,
                        "message": "Some thing went wrong. try again."
                    });
                }
            });

    } else {

        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Unauthorize Request"
            });
    }
});

module.exports = router;