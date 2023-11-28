require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const notificationModel = require('../models/notification');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const commonObject = require('../common/common');


router.get('/list', [verifyToken], async (req, res) => {

    let result = await notificationModel.getNotificationByUserIdAndRoleId(req.decoded.userInfo.id, req.decoded.role.id);

    let unseen = 0;
    for(let i = 0; i < result.length; i++){
        if(result[i].is_seen == 0){
            unseen++;
        }
    }
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Notification List.",
        "count": result.length,
        "unseen": unseen,
        "data": result
    });
});


router.get('/details/:id', [verifyToken], async (req, res) => {

    let id = req.params.id;
    let validateId = await commonObject.checkItsNumber(id);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        id = validateId.data;
    }


    let result = await notificationModel.getNotificationByIDUserIdAndRoleId(id, req.decoded.userInfo.id, req.decoded.role.id);

    if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No notification data found",
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Notification Details.",
        data: result[0],
    });

});


router.post('/notificationSeen', [verifyToken], async (req, res) => {

    let reqData = {
        "id": req.body.id
    }
  
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();
  
    let validateId = await commonObject.checkItsNumber(reqData.id);
    if (validateId.success == false) {
  
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer.",
            "id": reqData.id
  
        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;
        
    }
  
  
    let existingDataById = await notificationModel.getNotificationByIDUserIdAndRoleId(reqData.id, req.decoded.userInfo.id, req.decoded.role.id);

    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No notification data found",
        });
    }
    if(existingDataById[0].is_seen == 1){
      return res.status(404).send({
        "success": false,
        "status": 404,
        "message": "Notification Already Seen",
  
    });
    }

    let result = await notificationModel.updateNotificationSeenById(reqData.updated_by, reqData.updated_at, reqData.id);
  
    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    } 
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Notification now is seen"
    });
  
  });




module.exports = router;

