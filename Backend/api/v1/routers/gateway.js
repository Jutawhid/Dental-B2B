const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const fileUploaderCommonObject = require('../common/fileUploader');
const gatewayModel = require('../models/gateway');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

router.get('/list', [verifyToken, routeAccessChecker("gatewayList")], async (req, res) => {


    let result = await gatewayModel.getGatewayList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Payment Gateway List.",
        "image-path": `${process.env.backend_url}${process.env.gateway_image_path_name}`,
        "count": result.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("gatewayAdd")], async (req, res) => {

    let reqData = {
        "name": req.body.name
    }


    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let validateGatewayName = await commonObject.characterLimitCheck(reqData.name, "Gateway Name");

    if (validateGatewayName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateGatewayName.message,

        });
    }

    reqData.name = validateGatewayName.data;
    let existingData = await gatewayModel.getGatewayByName(reqData.name);


    if (!isEmpty(existingData)) {
        return res.status(422).send({
            "success": false,
            "status": 422,
            "message": existingData[0].status == "1" ? "Gateway Already Exist." : "Gateway Exist but Deactivate."
        });

    }

    let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "gatewayImage", "image");

    if (fileUploadCode.success == false) {
        return res.status(200).send({
            "success": false,
            "status": 400,
            "message": fileUploadCode.message,
        });
    }


    reqData.image = fileUploadCode.fileName;

    let result = await gatewayModel.addNewGateway(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Payment Gateway Added Successfully."
    });

});



router.put('/update', [verifyToken, routeAccessChecker("gatewayUpdate")], async (req, res) => {

    let reqData = {
        "id": req.body.id,
        "name": req.body.name
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


    let validateGatewayName = await commonObject.characterLimitCheck(reqData.name, "Gateway Name");

    if (validateGatewayName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateGatewayName.message,
        });
    }

    reqData.name = validateGatewayName.data;

    let existingDataById = await gatewayModel.getGatewayById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let existingDataByName = await gatewayModel.getGatewayByName(reqData.name);

    if (!isEmpty(existingDataByName) && existingDataByName[0].id != reqData.id) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": existingDataByName[0].status == "1" ? "Gateway Already Exist." : "Gateway Exist but Deactivate."
        });
    }


    if (req.files && Object.keys(req.files).length > 0) {

        let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "gatewayImage", "image");

        if (fileUploadCode.success == false) {
            return res.status(200).send({
                "success": false,
                "status": 400,
                "message": fileUploadCode.message,
            });
        }

        reqData.image = fileUploadCode.fileName;
    } else {
        reqData.image = existingDataById[0].image;
    }



    let result = await gatewayModel.updateGatewayByID(reqData.name, reqData.image, reqData.updated_by, reqData.updated_at, reqData.id);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    } else if(existingDataById[0].image != reqData.image){ 
        let fileDelete = await fileUploaderCommonObject.fileRemove(existingDataById[0].image, "gatewayImage");
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Payment Gateway Updated Successfully."
    });

});



router.delete('/delete', [verifyToken, routeAccessChecker("gatewayDelete")], async (req, res) => {

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
            "message": "Value should be integer."

        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;
        
    }

    let existingDataById = await gatewayModel.getGatewayById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let result = await gatewayModel.deleteGatewayById(reqData.updated_by, reqData.updated_at, reqData.id);

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
        "message": "Payment Gateway Deleted Successfully."
    });

});

router.put('/changeGatewayStatus', [verifyToken, routeAccessChecker("changeGatewayStatus")], async (req, res) => {

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
            "message": "Value should be integer."
        });
    } else {
        reqData.id = validateId.data;
        req.body.id = validateId.data;
    }

    let existingDataById = await gatewayModel.getGatewayById(reqData.id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found"
        });
    }

    if (existingDataById[0].status === 1 && existingDataById[0].active_status === 1) {
        let result = await gatewayModel.disableGatewayById(reqData.updated_by, reqData.updated_at, reqData.id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }

    } else if (existingDataById[0].status === 1 && existingDataById[0].active_status === 0) {
        let result = await gatewayModel.enableGatewayById(reqData.updated_by, reqData.updated_at, reqData.id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }
    } else {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Payment Gateway is already disable."
        });
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Payment Gateway Status Changed."
    });

});

router.get("/details/:id",[verifyToken, routeAccessChecker("gatewayDetails")],async (req, res) => {

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

    let result = await gatewayModel.getGatewayById(id);

    if (isEmpty(result)) {

      return res.status(404).send({
        success: false,
        status: 404,
        message: "No service data found",
      });

    } else {

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Gateway Details.",
        imagePath: `${process.env.backend_url}${process.env.gateway_image_path_name}`,
        data: result[0],
      });
      
    }

  }
);


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