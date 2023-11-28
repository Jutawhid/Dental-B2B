const express = require("express");
const router = express.Router();

const { connectionEasifiMYSQL } = require('./connections/connection');
const { routeAccessChecker } = require('./middlewares/routeAccess');

global.config = require('./jwt/config/config');
const verifyToken = require('./middlewares/jwt_verify/verifyToken');

const authentication_router = require('./routers/authentication');
const user_router = require('./routers/user');
const admin_router = require('./routers/admin');
const service_router = require('./routers/service');
const gateway_router = require('./routers/gateway');
const location_router = require('./routers/location');
const feature_user_router = require('./routers/featureUser');
const user_provide_service_router = require('./routers/userProvideService');
const favorite_router = require('./routers/favorite');
const case_router = require('./routers/case');
const training_router = require('./routers/training');
const explore_router = require('./routers/explore');
const card_record_router = require('./routers/cardRecords');
const trash_router = require('./routers/trash');
const case_type_router = require('./routers/caseType');
const message_router = require('./routers/message');
const notification_router = require('./routers/notification');
const stripe_router = require('./routers/stripe');
const wallet_router = require('./routers/wallet');


router.use('/authentication', authentication_router);
router.use('/user', user_router);
router.use('/admin', admin_router);
router.use('/service', service_router);
router.use('/gateway', gateway_router);
router.use('/location', location_router);
router.use('/feature', feature_user_router);
router.use('/my-service', user_provide_service_router);
router.use('/favorite', favorite_router);
router.use('/case', case_router);
router.use('/training', training_router);
router.use('/explore', explore_router);
router.use('/userPaymentInfo', card_record_router);
router.use('/trash', trash_router);
router.use('/caseType', case_type_router);
router.use('/message', message_router);
router.use('/notification', notification_router);
router.use('/stripe', stripe_router);
router.use('/wallet', wallet_router);


router.get('/test', [verifyToken, routeAccessChecker("test")], (req, res) => {
    return res.send({
        "message": "test",
        "api v": 1
    });
});


router.get('/connection_check', (req, res) => {

    try {

        // This is for Pool connect
        connectionEasifiMYSQL.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.send({
                    "message": "Connection create fail",
                    "error": err,
                    "api v": 1
                });
            }

            connection.release();
            return res.send({
                "message": "Connection create success ",
                "api v": 1,
                "precess": connectionEasifiMYSQL._acquiringConnections.length,
                "length": connectionEasifiMYSQL._allConnections.length  
            });
        });

        // This is for  connect
        // connectionEasifiMYSQL.connect(function (err) {
        //     if (err) {
        //         return res.send({
        //             "message": "Connection create fail",
        //             "error": err,
        //             "api v": 1
        //         });
        //     }

        //     // console.log(connectionEasifiMYSQL.destroy())

        //     return res.send({
        //         "message": "Connection create success",
        //         "api v": 1
        //     });
        // });


    } catch (error) {
        return res.status(400)
            .send({
                "status": 404,
                "message": "Connection create fail try",
                "api v": 1,
                "error": error
            });
    }

});



router.get('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});



router.post('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});



module.exports = router;