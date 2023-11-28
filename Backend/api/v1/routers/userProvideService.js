const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const userProvideServiceModel = require('../models/userProvideService');
const roleModel = require('../models/role');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');

router.get('/list', [verifyToken, routeAccessChecker("myProvideServiceList")], async (req, res) => {

    let result = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(req.decoded.userInfo.id, req.decoded.role.identity_id);


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Service List.",
        "count": result.length,
        "data": result
    });

});


router.get('/formDataForAddService', [verifyToken, routeAccessChecker("formDataForAddService")], async (req, res) => {

    let serviceResult = await userProvideServiceModel.getUnusedServiceListByUserIdAndRoleId(req.decoded.userInfo.id, req.decoded.role.identity_id);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "",
        "data": { "service-list": serviceResult }
    });

});




router.post('/add', [verifyToken, routeAccessChecker("myProvideServiceNewAdd")], async (req, res) => {

    let reqData = {
        "serviceId": req.body.service_id,
        "price": req.body.price,
        "description": req.body.description
    }

    let errorMessage = "";
    let isError = 0;

    let validateDescription = await commonObject.characterLimitCheck(reqData.description, "Provide service description");

    if (validateDescription.success == false) {
        isError = 1;
        errorMessage += validateDescription.message;
    } else {
        reqData.description = validateDescription.data;
    }



    // validate price
    let validatePrice = await commonObject.checkItsNumber(reqData.price);

    if (validatePrice.success == false) {
        isError = 1;
        errorMessage += "Price should be integer, please give valid price (getter then 0)."
    }  else {
        req.body.price = validatePrice.data;
        reqData.price = validatePrice.data;
    }


    if (reqData.price <= 0) {
        isError = 1;
        errorMessage += "Price should be getter then 0."
    }



    // validate serviceId Id
    validateIdentityId = await commonObject.checkItsNumber(reqData.serviceId);

    if (validateIdentityId.success == false) {
        isError = 1;
        errorMessage += "Service id should be integer, please select service."
    } else {
        req.body.service_id = validateIdentityId.data;
        reqData.serviceId = validateIdentityId.data;
    }

    // in here we are checking if service id is exist or not, user has this service  access or not, or user already use this service or not.
    let serviceResult = await userProvideServiceModel.getUnusedServiceListByUserIdAndRoleId(req.decoded.userInfo.id, req.decoded.role.identity_id);


    let checkServiceIsAvailable = await serviceResult.find((service) => service.id == reqData.serviceId);
    if (checkServiceIsAvailable === undefined) {
        isError = 1;
        errorMessage += "Unknown service."
    }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    let timeNow = await commonObject.getGMT();

    reqData.created_at = timeNow;
    reqData.updated_at = timeNow;
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.user_id = req.decoded.userInfo.id;
    reqData.role_id = req.decoded.role.identity_id;
    reqData.service_id = reqData.serviceId;

    delete reqData.serviceId;


    let result = await userProvideServiceModel.addNewUserProvideService(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": true,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Service added successfully done."
    });
});



router.put('/update', [verifyToken, routeAccessChecker("myServiceUpdate")], async (req, res) => {

    let id = req.body.id;
    
    let reqData = {
        "price": req.body.price,
        "description": req.body.description
    }

    let errorMessage = "";
    let isError = 0;

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "ID should be integer."

        });
    } else {
        req.body.id = validateId.data;
        id = validateId.data;
    }

    let existingDataById = await userProvideServiceModel.getUserProvideServiceById(id);

    if (isEmpty(existingDataById) || existingDataById[0].user_id !== req.decoded.userInfo.id) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "You are not provide this service",
        });
    }



    if (reqData.description === undefined) {
        delete reqData.description;
    } else {

        let validateDescription = await commonObject.characterLimitCheck(reqData.description, "Provide service description");

        if (validateDescription.success == false) {
            isError = 1;
            errorMessage += validateDescription.message;
        } else {
            reqData.description = validateDescription.data;
        }
    }



    if (reqData.price === undefined) {
        delete reqData.price;
    } else {
        // validate price
        let validatePrice = await commonObject.checkItsNumber(reqData.price);

        if (validatePrice.success == false) {
            isError = 1;
            errorMessage += "Price should be integer, please give valid price (getter then 0)."
        } else{
            req.body.price = validatePrice.data;
            reqData.price = validatePrice.data;
        }
        
        
        if (reqData.price <= 0) {
            isError = 1;
            errorMessage += "Price should be getter then 0."
        }
    }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    } else if(isEmpty(reqData)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Nothing to update."
        });
    }

    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let result = await userProvideServiceModel.updateUserProvideServiceByID(reqData, id);

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
        "message": "Service Updated Successfully."
    });

});



router.delete('/delete', [verifyToken, routeAccessChecker("myProvideServiceDelete")], async (req, res) => {

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
            "message": "Id should be integer."
        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;
    }

    let existingDataById = await userProvideServiceModel.getUserProvideServiceById(reqData.id);
    if (isEmpty(existingDataById) || existingDataById[0].user_id !== req.decoded.userInfo.id) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "You are not provide this service",
        });
    }


    let result = await userProvideServiceModel.deleteUserProvideServiceById(reqData.updated_by, reqData.updated_at, reqData.id);

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
        "message": "Service deleted from your profile."
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