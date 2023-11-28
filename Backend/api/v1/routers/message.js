const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const fileUploaderCommonObject = require('../common/fileUploader');
const userModel = require("../models/user");
const messageModel = require('../models/message');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

router.get('/list', [verifyToken, routeAccessChecker("messageList")], async (req, res) => {

  let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let result = await messageModel.getMessageList(req.decoded.userInfo.id);

    for (let index = 0; index < result.length; index++) {

      if(result[index].sender_id !== req.decoded.userInfo.id){
        let profileDetails = await commonObject.getUserInfoByUserId(result[index].sender_id);
        result[index].sender_name = profileDetails.data[0].full_name;
        result[index].profile_image = profileDetails.data[0].profile_image;
      }

      if(result[index].receiver_id !== req.decoded.userInfo.id){
        let profileDetails = await commonObject.getUserInfoByUserId(result[index].receiver_id);
        result[index].receiver_name = profileDetails.data[0].full_name;
        result[index].profile_image = profileDetails.data[0].profile_image;
      }
      

      
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Message List.",
        "imageFolder" : imageFolderPath,
        "count": result.length,
        "data": result
    });
});

router.get("/detailsByUserId/:id",[verifyToken, routeAccessChecker("messageDetails")],
  async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let userId = req.params.id;

    let validateId = await commonObject.checkItsNumber(userId);

        if (validateId.success == false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Value should be integer.",
            });
        } else {
            req.params.user_id = validateId.data;
            userId = validateId.data;
        }

        let existingUserInfo = await userModel.getUserDetailsById(userId);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User not found.",
            });
        }

    let result = await messageModel.getMessageDetails(req.decoded.userInfo.id,userId);

    let profileDetails = await commonObject.getUserInfoByUserId(userId);
    let userName = profileDetails.data[0].full_name;
    let profile_image = profileDetails.data[0].profile_image;

    let messagingWith = {
      "user_name" : userName,
      "profile_image" : profile_image
    };

    

    return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Message List.",
      "imageFolder" : imageFolderPath,
      "count": result.length,
      "data": result,
      "messagingWith" : messagingWith
  });

    

  }
);

router.post('/messageSeen', [verifyToken, routeAccessChecker("messageSeen")], async (req, res) => {

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


  let existingDataById = await messageModel.getMessageById(reqData.id);
  if (isEmpty(existingDataById)) {

      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "No data found",

      });
  }

  if(existingDataById[0].receiver_id != req.decoded.userInfo.id){
    return res.status(404).send({
      "success": false,
      "status": 404,
      "message": "You are not receiver of this message.",

  });
  }

  if(existingDataById[0].is_seen == 1){
    return res.status(404).send({
      "success": false,
      "status": 404,
      "message": "Message Already Seen",

  });
  }


  let result = await messageModel.updateMessageSeenId(reqData.updated_by, reqData.updated_at, reqData.id);

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
      "message": "Message now is seen"
  });

});



router.get('/*', (req, res) => {
    return res.send({
        'status': 400,
        'message': "unknown route",
        "success": false
    })
});

router.post('/*', (req, res) => {
    return res.send({
        'status': 400,
        'message': "unknown route",
        "success": false
    })
});


module.exports = router;