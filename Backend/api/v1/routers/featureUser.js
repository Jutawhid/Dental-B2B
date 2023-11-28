const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const fileUploaderCommonObject = require('../common/fileUploader');
const featureUserModel = require('../models/featureUser');
const roleModel = require('../models/role');
const userModel = require('../models/user');
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
require("dotenv").config();

router.get('/list', [verifyToken, routeAccessChecker("featureUserList")], async (req, res) => {

    let featureList = [];
    let featureObject = {};
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    let result = await featureUserModel.getFeatureUserList();

    for (let index = 0; index < result.length; index++) {
        const element = result[index];


        let roleInfo = await roleModel.getRoleById(element.role_id);
        let user = await userModel.getUserById(element.user_id);
        let profileInfo;

        if (!isEmpty(roleInfo) && !isEmpty(user)) {

            if (element.role_id == 3) {
                profileInfo = await dentistModel.getDentistById(user[0].profile_id);
            } else if (element.role_id == 4) {
                profileInfo = await consultantModel.getConsultantById(user[0].profile_id);
            } else if (element.role_id == 5) {
                profileInfo = await labModel.getLabById(user[0].profile_id);
            } else if (element.role_id == 6) {
                profileInfo = await techCompanyModel.getTechCompanyById(user[0].profile_id);
            }

            if (!isEmpty(profileInfo)) {
                profileInfo[0].profileImageFolderPath = imageFolderPath;
                featureList.push({
                    "id": element.id,
                    "role": roleInfo[0],
                    "userProfileInfo": profileInfo[0],
                    "user_id": element.user_id,
                    "serial_no": element.serial_no,
                    "status": element.status,
                    "active_status": element.active_status
                });
            }
        }
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Feature user list.",
        "count": featureList.length,
        "data": featureList
    });
});



router.post('/add', [verifyToken, routeAccessChecker("featureUserAdd")], async (req, res) => {

    let reqData = {
        "roleId": req.body.role_id,
        "userId": req.body.user_id
    }

    let validateUserId = await commonObject.checkItsNumber(reqData.userId);

    if (validateUserId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "user id should be integer and not a negative number."
        });
    } else {
        reqData.userId = validateUserId.data;
        req.body.user_id = validateUserId.data;
    }


    let validateRoleId = await commonObject.checkItsNumber(reqData.roleId);
    if (validateRoleId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Role id should be integer."
        });
    } else {
        reqData.roleId = validateRoleId.data;
        req.body.role_id = validateRoleId.data;
    }

    if (!(reqData.roleId === 5 || reqData.roleId === 6)) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Feature only allow for Lab and tech company (5 & 6)."
        });
    }


    let roleTypeData = await roleModel.getRoleByIdentityId(reqData.roleId);
    if (isEmpty(roleTypeData)) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "No Role found."
        });
    }


    let existingUserData = await userModel.getUserById(reqData.userId);
    if (isEmpty(existingUserData)) {
        return res.status(422).send({
            "success": false,
            "status": 404,
            "message": "Unknown user."
        });

    } else if (existingUserData[0].role_id !== reqData.roleId) {
        return res.status(422).send({
            "success": false,
            "status": 400,
            "message": "Request and user role not match."
        });
    }

    // check user already added or not

    let existingFeatureUserData = await featureUserModel.getFeatureUserByUserId(reqData.userId);
    if (!isEmpty(existingFeatureUserData)) {
        return res.status(422).send({
            "success": false,
            "status": 404,
            "message": "User already added in feature."
        });

    }


    const timeNow = await commonObject.getGMT();

    let insertObject = {
        role_id: reqData.roleId,
        user_id: reqData.userId,
        serial_no: 0,
        status: 1,
        active_status: 1,
        created_by: req.decoded.userInfo.id,
        updated_by: req.decoded.userInfo.id,
        created_at: timeNow,
        updated_at: timeNow
    }


    let result = await featureUserModel.addNewFeatureUser(insertObject);

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
        "message": "Feature User Added Successfully."
    });

});



router.delete('/delete', [verifyToken, routeAccessChecker("featureUserDelete")], async (req, res) => {

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


    let existingDataById = await featureUserModel.getFeatureUserById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found"
        });
    }

    let result = await featureUserModel.deleteFeatureUserById(reqData.updated_by, reqData.updated_at, reqData.id);

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
        "message": "Feature User Deleted Successfully."
    });
});



router.put('/changeFeatureUserStatus', [verifyToken, routeAccessChecker("changeFeatureUserStatus")], async (req, res) => {

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


    let existingDataById = await featureUserModel.getFeatureUserById(reqData.id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found."
        });
    }

    if (existingDataById[0].status === 1 && existingDataById[0].active_status === 1) {
        let result = await featureUserModel.disableFeatureUserById(reqData.updated_by, reqData.updated_at, reqData.id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }

    } else if (existingDataById[0].status === 1 && existingDataById[0].active_status === 0) {
        let result = await featureUserModel.enableFeatureUserById(reqData.updated_by, reqData.updated_at, reqData.id);

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
            "message": "Feature user is already disable."
        });
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Feature user status changed."
    });

});

router.put('/changeFeatureUserSerial', [verifyToken, routeAccessChecker("changeFeatureUserSerial")], async (req, res) => {

    let reqIdList = req.body.serial_id;
    let updated_by = req.decoded.userInfo.id;
    let updated_at = await commonObject.getGMT();

    let existingDataById;
    let validateId;


    if (isEmpty(reqIdList) || !Array.isArray(reqIdList) || reqIdList.length < 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "No feature list found for serial."
        });
    }


    let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqIdList);

    if (duplicateCheckInArrayResult.result) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Duplicate id found."
        });
    }



    for (let index = 0; index < reqIdList.length; index++) {

        validateId = await commonObject.checkItsNumber(reqIdList[index]);
        if (validateId.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Feature id should be integer."
            });
        } else {
            reqIdList[index] = validateId.data;
        }

        existingDataById = await featureUserModel.getFeatureUserById(reqIdList[index]);
        if (isEmpty(existingDataById)) {
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": `feature id no: ${reqIdList[index]} not found.`
            });
        }
    }

    let result = await featureUserModel.serialFeatureUserById(updated_by, updated_at, reqIdList);

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
        "message": "Feature serial update."
    });

});


router.get('/*', (req, res) => {
    return res.send({
        'status': 400,
        'message': "unknown route.",
        "success": false
    })
});

router.post('/*', (req, res) => {
    return res.send({
        'status': 400,
        'message': "unknown route.",
        "success": false
    })
});


module.exports = router;