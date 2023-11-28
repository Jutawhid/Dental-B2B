const express = require("express");
const isEmpty = require("is-empty");
const fs = require('fs');
const router = express.Router();
const commonObject = require('../common/common');
const fileUploaderCommonObject = require('../common/fileUploader');
const caseModel = require('../models/case');
const caseMemberModel = require('../models/caseMember');
const caseMemberRequestModel = require('../models/caseMemberRequest');
const caseCancelScenarioModel = require('../models/caseCancelScenario');
const caseFileModel = require('../models/caseFile');
const caseTypeModel = require('../models/caseType');
const roleModel = require('../models/role');
const userModel = require('../models/user');
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");
const notificationModel = require("../models/notification");
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const serviceModel = require("../models/service");
const serviceAccessRolesModel = require("../models/serviceAccessRoles");
const userProvideServiceModel = require('../models/userProvideService');
const userBalanceModel = require('../models/userBalance');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');
const customerPayableAmountModel = require('../models/customerPayableAmount');
const emailCommonObject = require('../common/email');


const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

router.get('/list-for-admin', [verifyToken, routeAccessChecker("case-list-for-admin")], async (req, res) => {
    let caseList = await caseMemberModel.getMyCaseListForAdmin();


    for (let index = 0; index < caseList.length; index++) {
        const element = caseList[index];
        let userInfo = await commonObject.getUserInfoByUserId(element.created_by);
        element.created_by_name = (userInfo.success && !isEmpty(userInfo.data)) ? userInfo.data[0].full_name : "Unknown User";
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "count": caseList.length,
        "data": caseList
    });
});

router.get('/canceledCaseMemberList', [verifyToken, routeAccessChecker("canceled-case-member-list")], async (req, res) => {
    let cancelCaseMemberList = await caseMemberModel.getCancelCaseMemberList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Canceled Case Member List .",
        "count": cancelCaseMemberList.length,
        "data": cancelCaseMemberList
    });
});

router.get('/list-for-admin-with-limit', [verifyToken, routeAccessChecker("case-list-for-admin-with-limit")], async (req, res) => {

    limit = 10;
    let caseList = await caseMemberModel.getMyCaseListForAdminWithLimit(limit);

    // all cases
    let allCases = await caseMemberModel.getMyCaseListForAdmin();


    for (let index = 0; index < caseList.length; index++) {
        const element = caseList[index];
        let userInfo = await commonObject.getUserInfoByUserId(element.created_by);
        element.created_by_name = (userInfo.success && !isEmpty(userInfo.data)) ? userInfo.data[0].full_name : "Unknown User";
    }

    let response = {
        total_data_in_this_load: caseList.length,
        limit: limit,
        end_id:
            caseList.length > 0 ? caseList[caseList.length - 1].id : 0,
        has_next: caseList.length > limit ? true : false,
        total_pages: Math.ceil(allCases.length / limit),
        data: caseList,
    };

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "data": response
    });
});

// next cases for admin
router.get("/nextCaseListForAdmin/:start_id", [verifyToken, routeAccessChecker("nextCaseListForAdmin")], async (req, res) => {

    let limit = 10;

    let startId = req.params.start_id;

    // start Id Validate

    if (isEmpty(startId)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Please provide Id.",
        });
    }

    let validateStartId = await commonObject.checkItsNumber(startId);

    if (validateStartId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Id should be integer.",
        });
    } else {
        req.params.start_id = validateStartId.data;
        startId = validateStartId.data;
    }

    let caseList = await caseMemberModel.getMyNextCaseListForAdminWithLimit(startId, limit);

    for (let index = 0; index < caseList.length; index++) {
        const element = caseList[index];
        let userInfo = await commonObject.getUserInfoByUserId(element.created_by);
        element.created_by_name = (userInfo.success && !isEmpty(userInfo.data)) ? userInfo.data[0].full_name : "Unknown User";
    }

    let response = {
        total_data_in_this_load: caseList.length,
        limit: limit,
        end_id:
            caseList.length > 0 ? caseList[caseList.length - 1].id : 0,
        data: caseList,
    };

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "data": response
    });


});

router.get('/list', [verifyToken, routeAccessChecker("caseList")], async (req, res) => {
    process.env.TZ = 'Etc/GMT+0';
    let result = await caseMemberModel.getMyCaseList(req.decoded.userInfo.id);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "count": result.length,
        "data": result
    });
});


// case list with limit
router.get('/listWithLimit', [verifyToken, routeAccessChecker("caseListWithLimit")], async (req, res) => {

    limit = 10;
    let result = await caseMemberModel.getMyCaseListWithLimit(req.decoded.userInfo.id, limit);

    let myTotalCase = await caseMemberModel.getMyCaseList(req.decoded.userInfo.id);

    let response = {
        total_data_in_this_load: result.length,
        limit: limit,
        end_id:
            result.length > 0 ? result[result.length - 1].id : 0,
        has_next: result.length >= limit ? true : false,
        total_pages: Math.ceil(myTotalCase.length / limit),
        data: result,
    };

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "data": response
    });
});

// next case List with Limit
router.get('/nextListWithLimit/:start_id', [verifyToken, routeAccessChecker("nextCaseListWithLimit")], async (req, res) => {

    let limit = 2;

    let startId = req.params.start_id;

    // start Id Validate

    if (isEmpty(startId)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Please provide Id.",
        });
    }

    let validateStartId = await commonObject.checkItsNumber(startId);

    if (validateStartId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Id should be integer.",
        });
    } else {
        req.params.start_id = validateStartId.data;
        startId = validateStartId.data;
    }

    // new code here
    let result = await caseMemberModel.getMyNextCaseListWithLimit(req.decoded.userInfo.id, startId, limit);

    let response = {
        total_data_in_this_load: result.length,
        limit: limit,
        end_id:
            result.length > 0 ? result[result.length - 1].id : 0,
        data: result,
    };

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "data": response
    });
});

router.get('/details/:id', [verifyToken, routeAccessChecker("caseDetails")], async (req, res) => {


    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let id = req.params.id;
    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Id should be integer.",
            "id": id

        });
    } else {
        id = validateId.data;
    }

    let caseDetails = await caseModel.getCaseById(id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }
    let caseTypeDetails = await caseTypeModel.getCaseTypeById(caseDetails[0].case_type_id);
    caseDetails[0].case_type = caseTypeDetails[0].type;


    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, caseDetails[0].id);
    let hasVIPPermission = await commonObject.accessPermissionChecker(req, "caseDetailsViewForAdministration");

    let userAccessRole = "zero";
    let nowDateTimeGMT = await commonObject.getGMT();
    let result = [];


    if (caseDetails[0].created_by === req.decoded.userInfo.id) {

        userAccessRole = "case-owner";
        caseDetails[0].patient_name = await commonObject.decodingUsingCrypto(caseDetails[0].patient_name);
        caseDetails[0].patient_age = await commonObject.decodingUsingCrypto(caseDetails[0].patient_age);
        caseDetails[0].patient_address = await commonObject.decodingUsingCrypto(caseDetails[0].patient_address);

    } else if (caseMemberCheck.success === true || hasVIPPermission) {

        userAccessRole = hasVIPPermission ? "admin-view" : "case-member";
        delete caseDetails[0].patient_name;
        delete caseDetails[0].patient_age;
        delete caseDetails[0].patient_address;

    } else {

        let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdAndUserId(id, req.decoded.userInfo.id, nowDateTimeGMT);

        if (isEmpty(caseMemberRequestListInThisService)) {
            return res.status(404)
                .send({
                    "success": false,
                    "status": 404,
                    "message": "Case not found."
                });
        } else {
            userAccessRole = "case-member-request";

            delete caseDetails[0].patient_name;
            delete caseDetails[0].patient_age;
            delete caseDetails[0].patient_address;
        }
    }

    let profileDetails = await commonObject.getUserInfoByUserId(caseDetails[0].created_by);
    caseDetails[0].creator_name = profileDetails.data[0].full_name;
    caseDetails[0].profile_image = profileDetails.data[0].profile_image;

    let serviceList = [];

    if (userAccessRole !== "case-member-request") {

        let tempServiceList = await serviceModel.getServiceList();

        for (let index = 0; index < tempServiceList.length; index++) {
            let service = tempServiceList[index];
            service.can_add_member = false;

            let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
                service.id
            );

            //  get user access role for this service
            let tempAccessList = [];

            for (let index = 0; index < accessList.length; index++) {
                let access = accessList[index];
                tempAccessList.push(access.role_id);
            }

            // Check user has permission to send request to the user
            let requestMemberPermission = await commonObject.getPermissionListForSendRequestOrRecommend(tempAccessList);

            for (let tempSendPermissionIndex = 0; tempSendPermissionIndex < requestMemberPermission.length; tempSendPermissionIndex++) {
                for (let tempMainPermissionIndex = 0; tempMainPermissionIndex < req.decoded.permissions.length; tempMainPermissionIndex++) {
                    if (requestMemberPermission[tempSendPermissionIndex] === req.decoded.permissions[tempMainPermissionIndex]) {
                        service.can_add_member = true;
                        break;
                    }
                }
            }

            // if (req.decoded.permissions.includes(requestMemberPermission) === true) {
            //     service.can_add_member = true;
            // }

            let caseMemberListInThisService = await caseMemberModel.getTotalCaseMemberListByCaseIdServiceId(id, service.id);

            for (let index = 0; index < caseMemberListInThisService.length; index++) {
                let profileDetails = await commonObject.getUserInfoByUserId(caseMemberListInThisService[index].user_id);

                caseMemberListInThisService[index].profile_name = profileDetails.data[0].full_name;
                caseMemberListInThisService[index].profile_image = profileDetails.data[0].profile_image;

                // delete unwanted field
                if (caseMemberListInThisService[index].hasOwnProperty("created_by")) delete caseMemberListInThisService[index].created_by;
                if (caseMemberListInThisService[index].hasOwnProperty("updated_by")) delete caseMemberListInThisService[index].updated_by;
                if (caseMemberListInThisService[index].hasOwnProperty("case_id")) delete caseMemberListInThisService[index].case_id;
                if (caseMemberListInThisService[index].hasOwnProperty("service_id")) delete caseMemberListInThisService[index].service_id;


                let memberRequestDetails = await caseMemberRequestModel.getCaseMemberRequestById(caseMemberListInThisService[index].mtae_members_request_id);
                caseMemberListInThisService[index].request_user_id = memberRequestDetails[0].request_user_id;


            }

            let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceId(id, service.id, nowDateTimeGMT);

            for (let i = 0; i < caseMemberRequestListInThisService.length; i++) {
                let profileDetails = await commonObject.getUserInfoByUserId(caseMemberRequestListInThisService[i].service_provider_id);

                caseMemberRequestListInThisService[i].profile_name = profileDetails.data[0].full_name;
                caseMemberRequestListInThisService[i].profile_image = profileDetails.data[0].profile_image;

                // delete unwanted field
                //if (caseMemberRequestListInThisService[i].hasOwnProperty("created_by")) delete caseMemberRequestListInThisService[i].created_by;
                if (caseMemberRequestListInThisService[i].hasOwnProperty("updated_by")) delete caseMemberRequestListInThisService[i].updated_by;
                if (caseMemberRequestListInThisService[i].hasOwnProperty("case_id")) delete caseMemberRequestListInThisService[i].case_id;
                if (caseMemberRequestListInThisService[i].hasOwnProperty("service_id")) delete caseMemberRequestListInThisService[i].service_id;
                if (caseMemberRequestListInThisService[i].hasOwnProperty("request_user_id")) delete caseMemberRequestListInThisService[i].request_user_id;
                //if (caseMemberRequestListInThisService[i].hasOwnProperty("service_provider_response")) delete caseMemberRequestListInThisService[i].service_provider_response;

            }

            let caseMemberRecommendRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRecommendListByCaseIdAndServiceId(id, service.id, nowDateTimeGMT);

            for (let i = 0; i < caseMemberRecommendRequestListInThisService.length; i++) {
                let profileDetails = await commonObject.getUserInfoByUserId(caseMemberRecommendRequestListInThisService[i].service_provider_id);

                caseMemberRecommendRequestListInThisService[i].profile_name = profileDetails.data[0].full_name;
                caseMemberRecommendRequestListInThisService[i].profile_image = profileDetails.data[0].profile_image;

                // delete unwanted field
                //if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("created_by")) delete caseMemberRecommendRequestListInThisService[i].created_by;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("updated_by")) delete caseMemberRecommendRequestListInThisService[i].updated_by;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("case_id")) delete caseMemberRecommendRequestListInThisService[i].case_id;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("service_id")) delete caseMemberRecommendRequestListInThisService[i].service_id;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("request_user_id")) delete caseMemberRecommendRequestListInThisService[i].request_user_id;
                //if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("service_provider_response")) delete caseMemberRecommendRequestListInThisService[i].service_provider_response;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("created_at")) delete caseMemberRecommendRequestListInThisService[i].created_at;
                if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("updated_at")) delete caseMemberRecommendRequestListInThisService[i].updated_at;
            }

            serviceList.push({
                "service": service,
                "caseMember": caseMemberListInThisService,
                "caseMemberRequest": caseMemberRequestListInThisService,
                "caseMemberRecommendRequest": caseMemberRecommendRequestListInThisService,
            });
        }
    }

    // case files list
    let caseFileList = await caseFileModel.getCaseFileListByCaseId(caseDetails[0].id);

    // get creator info
    for (let index = 0; index < caseFileList.length; index++) {
        let profileDetails = await commonObject.getUserInfoByUserId(caseFileList[index].created_by);
        caseFileList[index].uploaded_by = profileDetails.data[0].full_name;
    }

    caseDetails[0].imageFolderPath = imageFolderPath;
    caseDetails[0].userAccessRole = userAccessRole;
    caseDetails[0].serviceList = serviceList;
    caseDetails[0].caseFileList = caseFileList;




    //  let fileLis = await fileUploaderCommonObject.uploadFile(req, "caseFile", "file");


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "file-path": `${process.env.backend_url}${process.env.case_file_path_name}`,
        "data": caseDetails[0]
    });
});



router.post('/add', [verifyToken, routeAccessChecker("caseAdd")], async (req, res) => {

    let dateTimeNowGMT = await commonObject.getGMT();

    let reqData = {
        "patientName": req.body.patient_name,
        "patientAge": req.body.patient_age,
        "patientAddress": req.body.patient_address,
        "caseType": req.body.case_type,
    }

    let validatePatientName = await commonObject.characterLimitCheck(reqData.patientName, "CasePatientName");
    if (validatePatientName.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validatePatientName.message,

        });
    }

    reqData.patientName = validatePatientName.data;

    let validatePatientAddress = await commonObject.characterLimitCheck(reqData.patientAddress, "CasePatientAddress");
    if (validatePatientAddress.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validatePatientAddress.message,

        });
    }

    reqData.patientAddress = validatePatientAddress.data;



    let validatePatientAge = await commonObject.checkItsNumber(reqData.patientAge);

    if (validatePatientAge.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validatePatientAge.message,
        });
    }

    reqData.patientAge = validatePatientAge.data;


    if (reqData.patientAge < 2 || reqData.patientAge > 150) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Age should be between 2 and 150",
        });
    }

    if (isEmpty(reqData.caseType)) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Case Type is required",
        });
    }



    let validateCaseTypeId = await commonObject.checkItsNumber(reqData.caseType);

    if (validateCaseTypeId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: ` ${reqData.caseType} Value (Case Type) should be integer.`,
        });
    }

    reqData.caseType = validateCaseTypeId.data;

    let caseTypeDetails = await caseTypeModel.getCaseTypeById(reqData.caseType);

    if (isEmpty(caseTypeDetails)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No case type found",
        });
    }

    // return res.status(400).send({
    //     "success": false,
    //     "status": 400,
    //     "message": caseTypeDetails
    // });



    let dataForSaveObject = {
        "patient_name": await commonObject.hashingUsingCrypto(reqData.patientName),
        "patient_age": await commonObject.hashingUsingCrypto(reqData.patientAge),
        "patient_address": await commonObject.hashingUsingCrypto(reqData.patientAddress),
        "case_id": "E",
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": dateTimeNowGMT,
        "updated_at": dateTimeNowGMT,
        "case_type_id": reqData.caseType,
    }


    let result = await caseModel.addNewCase(dataForSaveObject, req.decoded.userInfo.id, req.decoded.profileInfo.id);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    // notification
    let notificationOne = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 1, // super Admin
        "title": "A new case has been added",
        "url": `${process.env.frontend_url}/case/${result.insertId}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": dateTimeNowGMT,
        "updated_at": dateTimeNowGMT,
    }

    let insertNotification = await notificationModel.addNewNotification(notificationOne);
    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    let notificationTwo = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 2, // Admin
        "title": "A new case has been added",
        "url": `${process.env.frontend_url}/case/${result.insertId}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": dateTimeNowGMT,
        "updated_at": dateTimeNowGMT,
    }

    let insertNotificationTwo = await notificationModel.addNewNotification(notificationTwo);
    if (insertNotificationTwo.affectedRows == undefined || insertNotificationTwo.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    req.socket_io.emit('notification', {
        "receiverId": notificationOne.receiver_id,
        "notification": notificationOne.title,
        "isReceiveAll": notificationOne.is_receive_all,
        "receiverType": notificationOne.receiver_type,
        "url": notificationOne.url,
    });

    req.socket_io.emit('notification', {
        "receiverId": notificationTwo.receiver_id,
        "notification": notificationTwo.title,
        "isReceiveAll": notificationTwo.is_receive_all,
        "receiverType": notificationTwo.receiver_type,
        "url": notificationTwo.url,
    });


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Case Added Successfully."
    });

});


router.put('/update', [verifyToken, routeAccessChecker("caseUpdate")], async (req, res) => {

    let reqData = {
        "patientName": req.body.patient_name,
        "patientAge": req.body.patient_age,
        "patientAddress": req.body.patient_address,
        "id": req.body.id,
        "caseType": req.body.case_type,
    }

    let dataForUpdateCase = {};

    let validateId = await commonObject.checkItsNumber(reqData.id);
    if (validateId.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Id should be integer.",
            "id": reqData.id

        });
    } else {
        reqData.id = validateId.data;
    }


    let caseDetails = await caseModel.getCaseByIdAndUserId(reqData.id, req.decoded.userInfo.id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }



    if (reqData.patientName !== undefined) {

        let validatePatientName = await commonObject.characterLimitCheck(reqData.patientName, "CasePatientName");
        if (validatePatientName.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": validatePatientName.message,

            });
        }

        dataForUpdateCase.patient_name = await commonObject.hashingUsingCrypto(validatePatientName.data);
    }


    if (reqData.patientAddress !== undefined) {

        let validatePatientAddress = await commonObject.characterLimitCheck(reqData.patientAddress, "CasePatientAddress");
        if (validatePatientAddress.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": validatePatientAddress.message,

            });
        }

        dataForUpdateCase.patient_address = await commonObject.hashingUsingCrypto(validatePatientAddress.data);
    }


    if (reqData.patientAge !== undefined) {

        let validatePatientAge = await commonObject.checkItsNumber(reqData.patientAge);

        if (validatePatientAge.success == false) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Patient age should be integer.",
            });
        }

        if (reqData.patientAge < 2 || reqData.patientAge > 150) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Age should be between 2 and 150",
            });
        }

        dataForUpdateCase.patient_age = await commonObject.hashingUsingCrypto(validatePatientAge.data);

    }

    // case type check

    if (caseDetails[0].case_type_id != reqData.caseType) {

        let validateCaseTypeId = await commonObject.checkItsNumber(reqData.caseType);

        if (validateCaseTypeId.success === false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: ` ${reqData.caseType} Value (Case Type) should be integer.`,
            });
        }

        reqData.caseType = validateCaseTypeId.data;

        let caseTypeDetails = await caseTypeModel.getCaseTypeById(reqData.caseType);

        if (isEmpty(caseTypeDetails)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "No case type found",
            });
        }

        dataForUpdateCase.case_type_id = reqData.caseType
    }


    // dataForUpdateCase.created_by = req.decoded.userInfo.id;
    dataForUpdateCase.updated_by = req.decoded.userInfo.id;
    dataForUpdateCase.created_at = await commonObject.getGMT();
    dataForUpdateCase.updated_at = await commonObject.getGMT();


    // console.log(dataForUpdateCase)
    let result = await caseModel.updateCaseByID(reqData.id, dataForUpdateCase);

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
        "message": "Case update successfully done."
    });

});


router.post('/uploadFile', [verifyToken, routeAccessChecker("caseFileUpload")], async (req, res) => {

    let id = req.body.id;

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

    let reqData = {};

    let caseData = await caseModel.getCaseAllDetailsById(id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }

    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, id);

    if (caseMemberCheck.success == false && caseData[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You have no permission to access this case.",
            });
    }

    // associate members of this case

    let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "caseFile", "file");

    if (fileUploadCode.success == false) {
        return res.status(200).send({
            "success": false,
            "status": 400,
            "message": fileUploadCode.message,
        });
    }

    reqData.file_original_name = req.files.file.name;
    reqData.file_temp_name = fileUploadCode.fileName;
    reqData.case_id = caseData[0].id;
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();


    let result = await caseFileModel.addNewCaseFile(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    // notifications
    let caseMemberIds = await commonObject.getCaseMembersUserIds(id);

    for (let i = 0; i < caseMemberIds.data.length; i++) {
        if (caseMemberIds.data[i].user_id != req.decoded.userInfo.id) {
            // notification
            let notification = {
                "sender_id": req.decoded.userInfo.id,
                "receiver_id": caseMemberIds.data[i].user_id,
                "is_receive_all": 0, // no
                "receiver_type": caseMemberIds.data[i].role_id,
                "title": `A new case file has been uploaded on  ${caseData[0].case_id}`,
                "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id,
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
            }

            let insertNotification = await notificationModel.addNewNotification(notification);
            if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database."
                });
            }

            // emit notifications
            req.socket_io.emit('notification', {
                "receiverId": notification.receiver_id,
                "notification": notification.title,
                "isReceiveAll": notification.is_receive_all,
                "receiverType": notification.receiver_type,
                "url": notification.url,
            });
        }
    }

    // notification for admin super admin
    let notificationOne = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 1, // super Admin
        "title": `A new case file has been uploaded on  ${caseData[0].case_id}`,
        "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotification = await notificationModel.addNewNotification(notificationOne);
    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    let notificationTwo = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 2, // Admin
        "title": `A new case file has been uploaded on  ${caseData[0].case_id}`,
        "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotificationTwo = await notificationModel.addNewNotification(notificationTwo);
    if (insertNotificationTwo.affectedRows == undefined || insertNotificationTwo.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    req.socket_io.emit('notification', {
        "receiverId": notificationOne.receiver_id,
        "notification": notificationOne.title,
        "isReceiveAll": notificationOne.is_receive_all,
        "receiverType": notificationOne.receiver_type,
        "url": notificationOne.url,
    });

    req.socket_io.emit('notification', {
        "receiverId": notificationTwo.receiver_id,
        "notification": notificationTwo.title,
        "isReceiveAll": notificationTwo.is_receive_all,
        "receiverType": notificationTwo.receiver_type,
        "url": notificationTwo.url,
    });


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Case file successfully added."
    });

});


router.get('/file-download/:id', [verifyToken, routeAccessChecker("caseFileDownload")], async (req, res) => {

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


    let caseFileData = await caseFileModel.getCaseFileDataById(id);

    if (isEmpty(caseFileData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case File Not Found."
            });
    }


    let caseData = await caseModel.getCaseAllDetailsById(caseFileData[0].case_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }

    // check if user has permission to access this case.
    let nowDateTimeGMT = await commonObject.getGMT();
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, caseFileData[0].case_id);
    let caseMemberRecommendListInThisServiceForThisUser = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdAndUserId(caseFileData[0].case_id, req.decoded.userInfo.id, nowDateTimeGMT);

    if (req.decoded.userInfo.role_id !== 1 && req.decoded.userInfo.role_id !== 2) {
        //if(req.decoded.userInfo.role_id === 3 || req.decoded.userInfo.role_id === 4 || req.decoded.userInfo.role_id === 5 || req.decoded.userInfo.role_id === 6){

        if (caseMemberCheck.success == false && isEmpty(caseMemberRecommendListInThisServiceForThisUser) && caseData[0].created_by != req.decoded.userInfo.id) {
            return res.status(401)
                .send({
                    "success": false,
                    "status": 401,
                    "message": "You have no permission to access this case.",
                });
        }
    }


    let fileUploadCode = await fileUploaderCommonObject.fileDecrypt(caseFileData[0].file_temp_name, "caseFile");
    // console.log(fileUploadCode);

    if (fileUploadCode.success == false) {
        return res.status(200).send({
            "success": false,
            "status": 400,
            "message": fileUploadCode.message,
        });
    } else {

        res.status(200)
            .download(fileUploadCode.data.decrypt_file_with_image_path, fileUploadCode.data.decrypt_file_name, (err) => {

                fs.unlink(fileUploadCode.data.decrypt_file_with_image_path, function (err) {
                    if (err) {
                        console.error(err.toString());
                    } else {
                        console.warn(fileUploadCode.data.decrypt_file_with_image_path + ' deleted');
                    }
                });

            })

        // res.set({'Content-Type': 'file/stl'});
        // return res.status(200).send({
        //     "success": false,
        //     "status": 400,
        //     "message": fileUploadCode.data.decrypt_file_with_image_path,
        // });
        // fileUploaderCommonObject.fileRemove("11645095378103-FilamentClipV2.stl", "caseFile");
        // res.set({'Content-Type': 'image/png'});
        // return res.download("a.jpg");
        // return res.download(fileUploadCode.data.decrypt_file_with_image_path);

        // let stream = fs.createReadStream(fileUploadCode.data.decrypt_file_with_image_path);
        // stream.pipe(res).once("close", function () {
        //     stream.destroy(); 
        //     // deleteFile();
        //     fs.unlink(fileUploadCode.data.decrypt_file_with_image_path, function (err) {
        //         if (err) {
        //             console.error(err.toString());
        //         } else {
        //             console.warn(fileUploadCode.data.decrypt_file_with_image_path + ' deleted');
        //         }
        //     });
        // });


        // res.sendFile(fileUploadCode.data.decrypt_file_with_image_path, function (err) {
        //     if (err) {
        //         next(err);
        //     } else {
        //         console.log('Sent:', fileUploadCode.data.decrypt_file_with_image_path);
        //     }
        // });







    }

    // console.log(fileUploadCode.fileName);


    // data: {
    //     "encrypt_file_name": fileName,
    //     "decrypt_file_name": decryptFileName,
    //     "decrypt_file_with_image_path": decryptFilePath,
    // }

    // dataForUpdateCase.created_by = req.decoded.userInfo.id;
    // dataForUpdateCase.updated_by = req.decoded.userInfo.id;
    // dataForUpdateCase.created_at = await commonObject.getGMT();
    // dataForUpdateCase.updated_at = await commonObject.getGMT();

    // // console.log(dataForUpdateCase)
    // let result = await caseModel.updateCaseByID(reqData.id, dataForUpdateCase);

    // if (result.affectedRows == undefined || result.affectedRows < 1) {
    //     return res.status(500).send({
    //         "success": false,
    //         "status": 500,
    //         "message": "Something Wrong in system database."
    //     });
    // }




    // return res.status(201).send({
    //     "success": true,
    //     "status": 201,
    //     "message": "Case update successfully done."
    // });

    // fileUploadCode.fileName


});

router.put('/changeCaseStatus', [verifyToken, routeAccessChecker("changeCaseStatus")], async (req, res) => {

    let reqData = {
        "id": req.body.id,
        "caseProgressStatus": req.body.status
    }

    let validateId = await commonObject.checkItsNumber(reqData.id);


    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Case id should be integer."
        });
    } else {
        reqData.id = validateId.data;
    }



    let caseDetails = await caseModel.getCaseByIdAndUserId(reqData.id, req.decoded.userInfo.id);
    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }

    if ([1, 2, 3].indexOf(reqData.caseProgressStatus) == -1) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Unknown status."
            });
    }


    if (caseDetails[0].status === 3) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Case is postponed. You can't change status."
        });


    } else if (caseDetails[0].status === 2) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });

    } else {

        let finalStatus = "";

        if (caseDetails[0].caseProgressStatus === reqData.caseProgressStatus) {
            finalStatus = caseDetails[0].caseProgressStatus === 1 ? "Todo" : caseDetails[0].caseProgressStatus === 2 ? "In Progress" : "Done";
            return res.status(404)
                .send({
                    "success": false,
                    "status": 200,
                    "message": "Case already in " + finalStatus
                });

        } else {

            let finalRequest = {
                "case_progress_status": reqData.caseProgressStatus,
                "updated_by": req.decoded.userInfo.id,
                "updated_at": await commonObject.getGMT()
            }


            let result = await caseModel.updateCaseByID(reqData.id, finalRequest);

            if (result.affectedRows == undefined || result.affectedRows == 0) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database."
                });
            } else {

                finalStatus = reqData.caseProgressStatus === 1 ? "Todo" : reqData.caseProgressStatus === 2 ? "In Progress" : "Done";

                // notification
                if (reqData.caseProgressStatus === 1 || reqData.caseProgressStatus === 2) {
                    let caseMemberIds = await commonObject.getCaseMembersUserIds(caseDetails[0].id);

                    for (let i = 0; i < caseMemberIds.data.length; i++) {
                        if (caseMemberIds.data[i].user_id != req.decoded.userInfo.id) {
                            // notification
                            let notification = {
                                "sender_id": req.decoded.userInfo.id,
                                "receiver_id": caseMemberIds.data[i].user_id,
                                "is_receive_all": 0, // no
                                "receiver_type": caseMemberIds.data[i].role_id,
                                "title": `Dentist has changed the case status of Case: ${caseDetails[0].case_id} to ${finalStatus}`,
                                "url": `${process.env.frontend_url}/case/${caseDetails[0].id}`,
                                "created_by": req.decoded.userInfo.id,
                                "updated_by": req.decoded.userInfo.id,
                                "created_at": await commonObject.getGMT(),
                                "updated_at": await commonObject.getGMT(),
                            }

                            let insertNotification = await notificationModel.addNewNotification(notification);
                            if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                                return res.status(500).send({
                                    "success": false,
                                    "status": 500,
                                    "message": "Something Wrong in system database."
                                });
                            }

                            // emit notifications
                            req.socket_io.emit('notification', {
                                "receiverId": notification.receiver_id,
                                "notification": notification.title,
                                "isReceiveAll": notification.is_receive_all,
                                "receiverType": notification.receiver_type,
                                "url": notification.url,
                            });
                        }
                    }
                }

                return res.status(200).send({
                    "success": true,
                    "status": 200,
                    "message": "Case status changed. from Now it is " + finalStatus
                });
            }


        }
    }
});


router.post('/userListForAddService', [verifyToken, routeAccessChecker("userListForAddService")], async (req, res) => {

    let reqServiceId = req.body.service_id;
    let reqCaseId = req.body.case_id;

    let validateId = await commonObject.checkItsNumber(reqCaseId);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Case ID should be integer.",
        });
    }

    reqCaseId = validateId.data;

    let caseDetails = await caseModel.getCaseAllDetailsById(reqCaseId);
    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }

    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, reqCaseId);

    if (caseMemberCheck.success == false && caseDetails[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You have no permission to access this case.",
            });
    }

    validateId = await commonObject.checkItsNumber(reqServiceId);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    reqServiceId = validateId.data;

    let existingServiceData = await serviceModel.getServiceById(reqServiceId);
    if (isEmpty(existingServiceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No data found",
        });
    }

    // check user/member already added in this service
    let caseMemberListInThisService = await caseMemberModel.getRunningCaseMemberListByCaseIdServiceId(reqCaseId, reqServiceId);

    if (!isEmpty(caseMemberListInThisService)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 422,
                "message": "Already member added in this service."
            });
    }

    let nowDateTimeGMT = await commonObject.getGMT();
    let caseMemberRecommendListInThisServiceForThisUser = await caseMemberRequestModel.getSentCaseMemberRecommendListByCaseIdAndServiceId(reqCaseId, reqServiceId, nowDateTimeGMT);

    if (!isEmpty(caseMemberRecommendListInThisServiceForThisUser)) {
        return res.status(400)
            .send({
                "success": true,
                "status": 400,
                "message": "Already sent recommend request for this user.",
            });
    }

    let userAccessList = await serviceAccessRolesModel.getUserListByServiceId(
        reqServiceId
    );

    let userList = [];
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let alreadySentRequestUserList = [];

    // already request sent user list

    let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceId(reqCaseId, reqServiceId, nowDateTimeGMT);


    if (!isEmpty(caseMemberRequestListInThisService)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 422,
                "message": "Already member request sent for this service."
            });
    }

    // get  user list, who already get service request
    // if (!isEmpty(caseMemberRequestListInThisService)) {
    //     for (let i = 0; i < caseMemberRequestListInThisService.length; i++) {
    //         alreadySentRequestUserList.push(caseMemberRequestListInThisService[i].service_provider_id);
    //     }
    // }

    for (let index = 0; index < userAccessList.length; index++) {
        const element = userAccessList[index];

        //   remove user who already get service request
        // if (alreadySentRequestUserList.indexOf(element.user_id) !== -1) {
        //     continue;
        // }


        let roleInfo = await roleModel.getRoleById(element.role_id);
        let user = await userModel.getUserById(element.user_id);
        let profileInfo;

        if (!isEmpty(roleInfo) && !isEmpty(user) && req.decoded.userInfo.id != user[0].id) {
            if (element.role_id == 4) {
                profileInfo = await consultantModel.getConsultantById(user[0].profile_id);
            } else if (element.role_id == 5) {
                profileInfo = await labModel.getLabById(user[0].profile_id);
            } else if (element.role_id == 6) {
                profileInfo = await techCompanyModel.getTechCompanyById(user[0].profile_id);
            }

            if (!isEmpty(profileInfo)) {
                profileInfo[0].profileImageFolderPath = imageFolderPath;
                userList.push({
                    "user_id": element.user_id,
                    "userProfileInfo": profileInfo[0],
                    "role": roleInfo[0],
                    "service_price": element.price
                });
            }
        }
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "User List.",
        "count": userList.length,
        "data": userList
    });
});


router.post('/sendRequest', [verifyToken, routeAccessChecker("sendRequest")], async (req, res) => {

    let reqServiceId = req.body.service_id;
    let reqCaseId = req.body.case_id;
    let reqUserId = req.body.user_id;
    let paymentType = req.body.payment_type;


    let validateId = await commonObject.checkItsNumber(reqServiceId);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Service ID should be integer.",
        });
    }

    reqServiceId = validateId.data;

    let existingServiceData = await serviceModel.getServiceById(reqServiceId);
    if (isEmpty(existingServiceData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Service not found.",
        });
    }

    let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
        reqServiceId
    );


    validateId = await commonObject.checkItsNumber(reqCaseId);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Case ID should be integer.",
        });
    }
    reqCaseId = validateId.data;


    validateId = await commonObject.checkItsNumber(reqUserId);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "User ID should be integer.",
        });
    }
    reqUserId = validateId.data;


    let caseDetails = await caseModel.getCaseAllDetailsById(reqCaseId);
    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }


    // check case has file before sending request to member
    let caseFileList = await caseFileModel.getCaseFileListByCaseId(caseDetails[0].id);

    if (caseFileList.length == 0) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Please add case file before adding members."
            });
    }

    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, reqCaseId);

    if (caseMemberCheck.success == false && caseDetails[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You have no permission to access this case."
            });
    }


    let userInfo = await userModel.getUserById(reqUserId);

    if (isEmpty(userInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "User not found."
            });
    }

    let flag = false; // user it for check user role has permission to access the service

    for (let index = 0; index < accessList.length; index++) {
        if (accessList[index].role_id == userInfo[0].role_id) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Can't add this user in this service."
            });
    }


    // user provide service list check
    let isRequestUserProvideThisService = await userProvideServiceModel.getUserProvideServiceByUserIdAndServiceId(reqUserId, reqServiceId);

    if (isEmpty(isRequestUserProvideThisService)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Can't add this user in this service."
            });
    }


    let providerProvideServicePrice = isRequestUserProvideThisService[0].price;


    // check any user/member already added in this service
    let caseMemberListInThisService = await caseMemberModel.getRunningCaseMemberListByCaseIdServiceId(reqCaseId, reqServiceId);

    if (!isEmpty(caseMemberListInThisService)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 422,
                "message": "Already member added in this service."
            });
    }



    let nowDateTime = new Date();
    let nowDateTimeGMT = await commonObject.getGMT(nowDateTime);
    let expiredDateGMT = await commonObject.getGMT(await commonObject.getCustomDateTime(nowDateTime, parseInt(process.env.CASE_REQUEST_ACCEPT_TIME)));


    // already request sent user list
    // let nowDateTimeGMT = await commonObject.getGMT();
    let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceId(reqCaseId, reqServiceId, nowDateTimeGMT);
    let caseMemberRecommendListInThisServiceForThisUser = await caseMemberRequestModel.getSentCaseMemberRecommendListByCaseIdAndServiceId(reqCaseId, reqServiceId, nowDateTimeGMT);

    if (!isEmpty(caseMemberRequestListInThisService)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 422,
                "message": "Already member request sent for this service."
            });
    }

    // return res.status(404)
    // .send({
    //     "success": false,
    //     "status": 422,
    //     "message": "tessssssssssssssst.",
    //     caseMemberRequestListInThisService
    // });


    // let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceIdAndUserId(reqCaseId, reqServiceId, reqUserId, nowDateTimeGMT);

    // if (!isEmpty(caseMemberRecommendListInThisServiceForThisUser)) {

    // console.log(caseMemberRequestListInThisService);
    // if (caseMemberRequestListInThisService[0].request_type == 2 && caseMemberRequestListInThisService[0].request_status == 3) {


    if (!isEmpty(caseMemberRecommendListInThisServiceForThisUser)) {

        if (req.decoded.userInfo.id != caseDetails[0].created_by) {
            return res.status(201)
                .send({
                    "success": true,
                    "status": 201,
                    "message": "Already sent recommend request for this user.",
                });
        }


        let objectForAddRequest = {
            "updated_by": req.decoded.userInfo.id,
            "request_status": 1,
            "service_provider_response": 3,
            "expired_at": expiredDateGMT,
            "updated_at": nowDateTime
        }

        // now check owner balance for add user in this service
        let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

        let walletTransaction = {
            "userWallet": [],
            "easifiWallet": [],
            "walletTransaction": [],
        };

        // wallet
        if (paymentType == 1) {
            let currentBalance = await userBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);

            if (isEmpty(currentBalance)) {
                return res.status(404)
                    .send({
                        "success": false,
                        "status": 404,
                        "message": "Your easifi wallet is empty.",
                    });
            }


            if (currentBalance[0].balance < caseMemberRecommendListInThisServiceForThisUser[0].amount) {
                return res.status(404)
                    .send({
                        "success": false,
                        "status": 404,
                        "message": "Your easifi wallet balance is not enough, please add money in your wallet.",
                    });
            } else {

                walletTransaction.userWallet.push({
                    "user_id": req.decoded.userInfo.id,
                    "balance": currentBalance[0].balance - caseMemberRecommendListInThisServiceForThisUser[0].amount
                });

                walletTransaction.easifiWallet.push({
                    "balance": easifiBalance[0].balance + caseMemberRecommendListInThisServiceForThisUser[0].amount
                });

                walletTransaction.walletTransaction.push({
                    "user_id": req.decoded.userInfo.id,
                    "table_name": "mtae_user_account_balance",
                    "table_id": currentBalance[0].id,
                    "starting_amount": currentBalance[0].balance,
                    "ending_amount": currentBalance[0].balance - caseMemberRecommendListInThisServiceForThisUser[0].amount,
                    "amount": caseMemberRecommendListInThisServiceForThisUser[0].amount,
                    "transaction_type": 2,
                    "transaction_to": "Account",
                    "reason": "Cut amount for sent request to service provider.",
                    "transaction_info": JSON.stringify(walletTransaction.userWallet[0]),
                    "created_at": await commonObject.getGMT(),
                    "updated_at": await commonObject.getGMT(),
                    "created_by": req.decoded.userInfo.id,
                    "updated_by": req.decoded.userInfo.id
                    // "transaction_info": "",
                })

                walletTransaction.walletTransaction.push({
                    "user_id": 0,
                    "table_name": "mtae_easifi_account_balance",
                    "table_id": 1,
                    "starting_amount": easifiBalance[0].balance,
                    "ending_amount": easifiBalance[0].balance + caseMemberRecommendListInThisServiceForThisUser[0].amount,
                    "amount": caseMemberRecommendListInThisServiceForThisUser[0].amount,
                    "transaction_type": 1,
                    "transaction_to": "Account",
                    "reason": "Get amount as user sent request to service provider.",
                    "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
                    "created_at": await commonObject.getGMT(),
                    "updated_at": await commonObject.getGMT(),
                    "created_by": req.decoded.userInfo.id,
                    "updated_by": req.decoded.userInfo.id
                    // "transaction_info": "",
                })

            }
        } else {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Select Stripe payment type."
            });
        }


        let updateResult = await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, caseMemberRecommendListInThisServiceForThisUser[0].id, walletTransaction);

        if (updateResult.affectedRows == undefined || updateResult.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        } else {
            return res.status(201)
                .send({
                    "success": true,
                    "status": 201,
                    "message": "Request sent successfully.",
                });
        }

        // } else {
        //     return res.status(422)
        //         .send({
        //             "success": false,
        //             "status": 422,
        //             "message": "Already send request to member."
        //         });
        // }
    } else {

        let objectForAddRequest = {
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id,
            "case_id": reqCaseId,
            "service_id": reqServiceId,
            "service_provider_id": reqUserId,
            "request_user_id": req.decoded.userInfo.id,
            "amount": providerProvideServicePrice,
            "request_type": 1,
            "request_status": 1,
            "service_provider_response": 3,
            "expired_at": expiredDateGMT,
            "created_at": nowDateTimeGMT,
            "updated_at": nowDateTimeGMT
        }


        let walletTransaction = {
            "userWallet": [],
            "easifiWallet": [],
            "walletTransaction": [],
        };

        let message = "Request sent successfully.";
        let willSendRequestDirect = true;
        let willCutMoney = true;

        // without case creator(Dentist), other member only recommend to add user

        // Check user has permission to send request to the user
        let requestSendDirectMemberPermission = await commonObject.getPermissionListForSendRequestDirectly([userInfo[0].role_id]);

        if (req.decoded.permissions.indexOf(requestSendDirectMemberPermission) === -1) {
            willSendRequestDirect = false;
        }

        // console.log(requestSendDirectMemberPermission)
        // console.log(req.decoded.permissions)

        if (req.decoded.userInfo.id != caseDetails[0].created_by && willSendRequestDirect == false) {
            objectForAddRequest.request_type = 2;
            objectForAddRequest.request_status = 3;
            message = "Recommend request successfully send.";
            willCutMoney = false;
        }

        // return res.status(201)
        // .send({
        //     "success": true,
        //     "status": 201,
        //     "message": req.decoded.permissions.indexOf(requestSendDirectMemberPermission)
        // });

        // Check user has permission to send request to the user
        let requestMemberPermission = await commonObject.getPermissionListForSendRequestOrRecommend([userInfo[0].role_id]);
        let requestMemberPermissionFlag = false;

        for (let tempSendPermissionIndex = 0; tempSendPermissionIndex < requestMemberPermission.length; tempSendPermissionIndex++) {
            for (let tempMainPermissionIndex = 0; tempMainPermissionIndex < req.decoded.permissions.length; tempMainPermissionIndex++) {
                if (requestMemberPermission[tempSendPermissionIndex] === req.decoded.permissions[tempMainPermissionIndex]) {
                    requestMemberPermissionFlag = true;
                    break;
                }
            }
        }

        if (requestMemberPermissionFlag === false) {
            return res.status(404)
                .send({
                    "success": false,
                    "status": 400,
                    "message": "You don't have permission to send request to this user.",
                });
        } else {

            // get easifi account balance
            let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

            if (willCutMoney) {
                if (paymentType == 1) {
                    let currentBalance = await userBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);

                    if (isEmpty(currentBalance)) {
                        return res.status(404)
                            .send({
                                "success": false,
                                "status": 404,
                                "message": "Your easifi wallet is empty.",
                            });
                    }


                    if (currentBalance[0].balance < objectForAddRequest.amount) {
                        return res.status(404)
                            .send({
                                "success": false,
                                "status": 404,
                                "message": "Your easifi wallet balance is not enough, please add money in your wallet.",
                            });
                    } else {

                        walletTransaction.userWallet.push({
                            "user_id": req.decoded.userInfo.id,
                            "balance": currentBalance[0].balance - objectForAddRequest.amount
                        });

                        walletTransaction.easifiWallet.push({
                            "balance": easifiBalance[0].balance + objectForAddRequest.amount
                        });

                        walletTransaction.walletTransaction.push({
                            "user_id": req.decoded.userInfo.id,
                            "table_name": "mtae_user_account_balance",
                            "table_id": currentBalance[0].id,
                            "starting_amount": currentBalance[0].balance,
                            "ending_amount": currentBalance[0].balance - objectForAddRequest.amount,
                            "amount": objectForAddRequest.amount,
                            "transaction_type": 2,
                            "transaction_to": "Account",
                            "reason": "Cut amount for sent request to service provider.",
                            "transaction_info": JSON.stringify(walletTransaction.userWallet[0]),
                            "created_at": await commonObject.getGMT(),
                            "updated_at": await commonObject.getGMT(),
                            "created_by": req.decoded.userInfo.id,
                            "updated_by": req.decoded.userInfo.id
                            // "transaction_info": "",
                        })

                        walletTransaction.walletTransaction.push({
                            "user_id": 0,
                            "table_name": "mtae_easifi_account_balance",
                            "table_id": 1,
                            "starting_amount": easifiBalance[0].balance,
                            "ending_amount": easifiBalance[0].balance + objectForAddRequest.amount,
                            "amount": objectForAddRequest.amount,
                            "transaction_type": 1,
                            "transaction_to": "Account",
                            "reason": "Get amount as user sent request to service provider.",
                            "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
                            "created_at": await commonObject.getGMT(),
                            "updated_at": await commonObject.getGMT(),
                            "created_by": req.decoded.userInfo.id,
                            "updated_by": req.decoded.userInfo.id
                            // "transaction_info": "",
                        })
                    }

                } else {
                    return res.status(500).send({
                        "success": false,
                        "status": 500,
                        "message": "Select Stripe payment type."
                    });
                }
            }




            let result = await caseMemberRequestModel.addNewCaseMemberRequest(objectForAddRequest, walletTransaction);
            if (result.affectedRows == undefined || result.affectedRows == 0) {
                return res.status(505)
                    .send({
                        "success": false,
                        "status": 505,
                        "message": "Something went wrong. try again later.",
                    });
            } else {

                easifiAccountBalanceModel.updateBalanceById(1);
                userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);

                // generate notification
                let notificationList = [];

                notificationList.push({
                    "sender_id": req.decoded.userInfo.id,
                    "receiver_id": objectForAddRequest.service_provider_id,
                    "is_receive_all": 0,
                    "receiver_type": 0,
                    "title": `You get a member request for Case ID:  ${caseDetails[0].case_id}`,
                    "url": `${process.env.frontend_url}/requests`,
                    "created_by": req.decoded.userInfo.id,
                    "updated_by": req.decoded.userInfo.id,
                    "created_at": nowDateTime,
                    "updated_at": nowDateTime,
                });


                if (req.decoded.userInfo.id != caseDetails[0].created_by) {

                    let tempName = req.decoded.profileInfo.hasOwnProperty("first_name") ? req.decoded.profileInfo.first_name + " " + req.decoded.profileInfo.last_name : req.decoded.profileInfo.name;

                    // notification
                    let notificationOne = {
                        "sender_id": req.decoded.userInfo.id,
                        "receiver_id": caseDetails[0].created_by,
                        "is_receive_all": 0,
                        "receiver_type": 3, // dentist
                        "title": `A new service provider is recommended for Case ID:  ${caseDetails[0].case_id}  by ${tempName} (Consultant)`,
                        "url": `${process.env.frontend_url}/requests`,
                        "created_by": req.decoded.userInfo.id,
                        "updated_by": req.decoded.userInfo.id,
                        "created_at": nowDateTime,
                        "updated_at": nowDateTime,
                    }

                    if (willSendRequestDirect == true) {
                        notificationOne.title = `A new service provider request is sent for Case ID: ${caseDetails[0].case_id} by ${tempName} (Lab)`;
                        notificationOne.url = `${process.env.frontend_url}/requests`;
                    }


                    notificationList.push(notificationOne)


                    // send email when recommend sent
                    if (willSendRequestDirect == false) {

                        let profileDetails = await commonObject.getUserInfoByUserId(caseDetails[0].created_by);
                        let receiverMail = profileDetails.data[0].email;

                        // let emailBody = `
                        //     <p>A new service provider is recommended for Case ID: ${caseDetails[0].case_id}</p>
                        //     `;

                        emailCommonObject.sentEmailByHtmlFormate(
                            receiverMail,
                            "A new Recommendation",
                            `A new service provider is recommended for Case ID: ${caseDetails[0].case_id}`,
                            "Go to easifi",
                            `${process.env.frontend_url}`
                        );
                    }
                }

                // send notification  BY socket.io
                for (let index = 0; index < notificationList.length; index++) {
                    let notification = notificationList[index];

                    notificationModel.addNewNotification(notification);

                    req.socket_io.emit('notification', {
                        "receiverId": notification.receiver_id,
                        "notification": notification.title,
                        "isReceiveAll": notification.is_receive_all,
                        "receiverType": notification.receiver_type,
                        "url": notification.url,
                    });

                }

                /// send notification to the service provider

                return res.status(201)
                    .send({
                        "success": true,
                        "status": 201,
                        "message": message,
                    });
            }
        }
    }


});

//user can see all case member request list which was send him/her
router.get('/myRequestList', [verifyToken, routeAccessChecker("myRequestList")], async (req, res) => {

    let nowDateTime = await commonObject.getGMT();


    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTime);
    let result = await caseMemberRequestModel.getMyRequestList(req.decoded.userInfo.id);


    for (let index = 0; index < result.length; index++) {
        let profileDetails = await commonObject.getUserInfoByUserId(result[index].created_by);
        result[index].creator_name = profileDetails.data[0].full_name;

        // let serviceDetails = await serviceModel.getServiceById(result[index].service_id);
        // result[index].service_name = serviceDetails[0].name;

        // let caseDetails = await caseModel.getCaseById(result[index].case_id);
        // result[index].case_identification_number = caseDetails[0].case_id;
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case List.",
        "count": result.length,
        "data": result
    });

});


router.post('/responseForMyRequest', [verifyToken, routeAccessChecker("responseForMyRequest")], async (req, res) => {

    let nowDateTime = await commonObject.getGMT();
    let id = req.body.id;
    let action = req.body.action;

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;

    validateId = await commonObject.checkItsNumber(action);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Action should be integer.",
        });
    }

    action = validateId.data;

    if (!(action == 1 || action == 2)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Unknown action id.",
        });
    }


    // check request id is exist or not
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTime);
    let memberRequestDetails = await caseMemberRequestModel.getMyRequestByIdAndServiceProviderId(id, req.decoded.userInfo.id);

    if (isEmpty(memberRequestDetails)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Request not found.",
        });
    }

    // check user already added or not
    let caseMemberListInThisService = await caseMemberModel.getRunningCaseMemberListByCaseIdServiceId(memberRequestDetails[0].case_id, memberRequestDetails[0].service_id);

    if (!isEmpty(caseMemberListInThisService)) {
        if (caseMemberListInThisService[0].user_id == req.decoded.userInfo.id) {
            return res.status(404)
                .send({
                    "success": false,
                    "status": 422,
                    "message": "Sorry you are already member in this service."
                });

        } else {
            // update request status
            await caseMemberRequestModel.updateCaseMemberRequestByID({ "service_provider_response": 4, "status": 4, "updated_at": nowDateTime }, id);
            return res.status(404)
                .send({
                    "success": false,
                    "status": 422,
                    "message": "Service already handed over to other, try to next time."
                });
        }
    }

    // if case remove
    let caseDetails = await caseModel.getCaseAllDetailsById(memberRequestDetails[0].case_id);
    if (isEmpty(caseDetails)) {
        await caseMemberRequestModel.updateCaseMemberRequestByID({ "status": 2, "updated_at": nowDateTime }, id);
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }

    let message = "";


    if (action == 2) {

        // now check owner balance for add user in this service
        let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

        walletTransaction = {
            "userWallet": [],
            "easifiWallet": [],
            "walletTransaction": [],
        };


        let currentBalance = await userBalanceModel.getCurrentBalanceByUserID(memberRequestDetails[0].request_user_id);

        if (isEmpty(currentBalance)) {
            return res.status(404)
                .send({
                    "success": false,
                    "status": 404,
                    "message": "Your easifi wallet is not found.",
                });
        }


        walletTransaction.userWallet.push({
            "user_id": memberRequestDetails[0].request_user_id,
            "balance": currentBalance[0].balance + memberRequestDetails[0].amount
        });

        walletTransaction.easifiWallet.push({
            "balance": easifiBalance[0].balance - memberRequestDetails[0].amount
        });

        walletTransaction.walletTransaction.push({
            "user_id": memberRequestDetails[0].request_user_id,
            "table_name": "mtae_user_account_balance",
            "table_id": currentBalance[0].id,
            "starting_amount": currentBalance[0].balance,
            "ending_amount": currentBalance[0].balance + memberRequestDetails[0].amount,
            "amount": memberRequestDetails[0].amount,
            "transaction_type": 1,
            "transaction_to": "Account",
            "reason": "Get amount as service provider cancel the service request.",
            "transaction_info": JSON.stringify(walletTransaction.userWallet[0]),
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT(),
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id
        })

        walletTransaction.walletTransaction.push({
            "user_id": 0,
            "table_name": "mtae_easifi_account_balance",
            "table_id": 1,
            "starting_amount": easifiBalance[0].balance,
            "ending_amount": easifiBalance[0].balance - memberRequestDetails[0].amount,
            "amount": memberRequestDetails[0].amount,
            "transaction_type": 2,
            "transaction_to": "Account",
            "reason": "Pay amount as service provider cancel the service request.",
            "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT(),
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id
        });


        let result = await caseMemberRequestModel.rejectMyCaseMemberRequest(req.decoded.userInfo.id, nowDateTime, id, walletTransaction);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(505)
                .send({
                    "success": false,
                    "status": 505,
                    "message": "Something went wrong. try again later.",
                });

        }

        easifiAccountBalanceModel.updateBalanceById(1);
        userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);

        message = "Thank you for your response.";

    } else {
        // if service remove from service list
        let existingServiceData = await serviceModel.getServiceById(memberRequestDetails[0].service_id);
        if (isEmpty(existingServiceData)) {
            await caseMemberRequestModel.updateCaseMemberRequestByID({ "status": 2, "updated_at": nowDateTime }, id);
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Request not found.",
            });
        }

        let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
            memberRequestDetails[0].service_id
        );


        // if case access remove
        let flag = false; // user it for check user role has permission to access the service

        for (let index = 0; index < accessList.length; index++) {
            if (accessList[index].role_id == req.decoded.role.id) {
                flag = true;
                false;
            }
        }

        if (!flag) {
            await caseMemberRequestModel.updateCaseMemberRequestByID({ "status": 2, "updated_at": nowDateTime }, id);
            return res.status(404)
                .send({
                    "success": false,
                    "status": 404,
                    "message": "service has been removed."
                });
        }

        let caseMemberObject = {
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id,
            "case_id": memberRequestDetails[0].case_id,
            "service_id": memberRequestDetails[0].service_id,
            "user_id": req.decoded.userInfo.id,
            "mtae_members_request_id": id,
            "amount": memberRequestDetails[0].amount,
            "service_status": 1,
            "status": 1,
            "created_at": nowDateTime,
            "updated_at": nowDateTime
        };

        let result = await caseMemberRequestModel.acceptMyCaseMemberRequest(caseMemberObject, req.decoded.userInfo.id, nowDateTime, id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(505)
                .send({
                    "success": false,
                    "status": 505,
                    "message": "Something went wrong. try again later.",
                });

        }

        message = "You are added to the case.";
    }


    let notificationList = [];

    // notification for dentist
    notificationList.push({
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": caseDetails[0].created_by,
        "is_receive_all": 0,
        "receiver_type": 3,
        "title": action == 2 ? `Service provider cancel request for your case, Case ID:  ${caseDetails[0].case_id}` : `Service provider accept request for your case, Case ID:  ${caseDetails[0].case_id}`,
        "url": `${process.env.frontend_url}/case/${caseDetails[0].id}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": nowDateTime,
        "updated_at": nowDateTime,
    });




    // notification for who send request, and also not a dentist.
    if (caseDetails[0].created_by != memberRequestDetails[0].request_user_id) {
        notificationList.push({
            "sender_id": req.decoded.userInfo.id,
            "receiver_id": memberRequestDetails[0].request_user_id,
            "is_receive_all": 0,
            "receiver_type": 5,  // lab
            "title": action == 2 ? `Service provider cancel your request for Case ID:  ${caseDetails[0].case_id}` : `Service provider accept your request for Case ID:  ${caseDetails[0].case_id}`,
            "url": `${process.env.frontend_url}/case/${caseDetails[0].id}`,
            "created_by": req.decoded.userInfo.id,
            "updated_by": req.decoded.userInfo.id,
            "created_at": nowDateTime,
            "updated_at": nowDateTime,
        });
    }


    for (let index = 0; index < notificationList.length; index++) {
        let notification = notificationList[index];

        notificationModel.addNewNotification(notification);

        req.socket_io.emit('notification', {
            "receiverId": notification.receiver_id,
            "notification": notification.title,
            "isReceiveAll": notification.is_receive_all,
            "receiverType": notification.receiver_type,
            "url": notification.url,
        });

    }



    // send email when recommend sent

    try {
        let profileDetails = await commonObject.getUserInfoByUserId(caseDetails[0].created_by);
        let receiverMail = profileDetails.data[0].email;

        let tempAction = action == 1 ? "accepted" : "cancelled";

        // let emailBody = `
        //             <p>Service provider has ${tempAction} your request for Case ID:  ${caseDetails[0].case_id}</p>
        //             <a href="${process.env.frontend_url}/case/${caseDetails[0].id}" >p> link </p> </a>
        //             `;

        emailCommonObject.sentEmailByHtmlFormate(
            receiverMail,
            `Service request has ${tempAction}.`,
            `Service provider has ${tempAction} your request for Case ID:  ${caseDetails[0].case_id}`,
            "Click here to view details",
            `${process.env.frontend_url}/case/${caseDetails[0].id}`
        );

    } catch (error) {
        console.log("sorry email not sent.")
    }



    return res.status(201)
        .send({
            "success": true,
            "status": 201,
            "message": message,
        });


});


router.get('/mySendRequestList', [verifyToken, routeAccessChecker("mySendRequestList")], async (req, res) => {

    let nowDateTime = await commonObject.getGMT();
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTime);
    let result = await caseMemberRequestModel.getSendRequestListByUserId(req.decoded.userInfo.id);

    // case details
    for (let index = 0; index < result.length; index++) {
        let caseDetails = await caseModel.getCaseAllDetailsById(result[index].case_id);
        caseDetails[0].patient_name = await commonObject.decodingUsingCrypto(caseDetails[0].patient_name);
        result[index].patient_name = caseDetails[0].patient_name;
    }

    let finalResult = [];

    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        let user = await userModel.getUserById(element.service_provider_id);
        let profileInfo;


        if (!isEmpty(user)) {
            if (user[0].role_id == 4) {
                profileInfo = await consultantModel.getConsultantForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 5) {
                profileInfo = await labModel.getLabForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 6) {
                profileInfo = await techCompanyModel.getTechCompanyForOtherById(user[0].profile_id);
            }


            if (!isEmpty(profileInfo)) {
                profileInfo[0].profileImageFolderPath = imageFolderPath;
                element.service_provider_info = profileInfo[0];
                finalResult.push(element);
            }
        }
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "My send request list.",
        "count": finalResult.length,
        "data": finalResult
    });

});

router.get('/mySendRecommendList', [verifyToken, routeAccessChecker("mySendRecommendList")], async (req, res) => {

    let nowDateTime = await commonObject.getGMT();
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTime);
    let result = await caseMemberRequestModel.getSendRecommendListByUserId(req.decoded.userInfo.id);

    for (let index = 0; index < result.length; index++) {
        let profileDetails = await commonObject.getUserInfoByUserId(result[index].created_by);
        result[index].creator_name = profileDetails.data[0].full_name;
    }

    let finalResult = [];

    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        let user = await userModel.getUserById(element.service_provider_id);
        let profileInfo;


        if (!isEmpty(user)) {
            if (user[0].role_id == 4) {
                profileInfo = await consultantModel.getConsultantForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 5) {
                profileInfo = await labModel.getLabForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 6) {
                profileInfo = await techCompanyModel.getTechCompanyForOtherById(user[0].profile_id);
            }


            if (!isEmpty(profileInfo)) {
                profileInfo[0].profileImageFolderPath = imageFolderPath;
                element.service_provider_info = profileInfo[0];
                finalResult.push(element);
            }
        }
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "My Recommend request list.",
        "count": finalResult.length,
        "data": finalResult,
    });

});

router.get('/recommendListForCase', [verifyToken, routeAccessChecker("recommendListForCase")], async (req, res) => {

    let nowDateTime = await commonObject.getGMT();
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTime);
    let result = await caseMemberRequestModel.getRecommendListByUserId(req.decoded.userInfo.id);

    for (let index = 0; index < result.length; index++) {
        let profileDetails = await commonObject.getUserInfoByUserId(result[index].created_by);
        result[index].creator_name = profileDetails.data[0].full_name;
    }

    let finalResult = [];

    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        let user = await userModel.getUserById(element.service_provider_id);
        let profileInfo;


        if (!isEmpty(user)) {
            if (user[0].role_id == 4) {
                profileInfo = await consultantModel.getConsultantForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 5) {
                profileInfo = await labModel.getLabForOtherById(user[0].profile_id);
            } else if (user[0].role_id == 6) {
                profileInfo = await techCompanyModel.getTechCompanyForOtherById(user[0].profile_id);
            }


            if (!isEmpty(profileInfo)) {
                profileInfo[0].profileImageFolderPath = imageFolderPath;
                element.service_provider_info = profileInfo[0];
                finalResult.push(element);
            }
        }
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Recommend list.",
        "count": finalResult.length,
        "data": finalResult
    });

});

router.post('/responseForRecommend', [verifyToken, routeAccessChecker("responseForRecommend")], async (req, res) => {

    let id = req.body.id;
    let action = req.body.action;
    let paymentType = req.body.payment_type;
    let nowDateTime = new Date();
    let nowDateTimeGMT = await commonObject.getGMT(nowDateTime);
    let expiredDateGMT = await commonObject.getGMT(await commonObject.getCustomDateTime(nowDateTime, parseInt(process.env.CASE_REQUEST_ACCEPT_TIME)));

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;

    validateId = await commonObject.checkItsNumber(action);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Action should be integer.",
        });
    }

    action = validateId.data;

    if (!(action == 1 || action == 2)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Unknown action id.",
        });
    }


    let objectForAddRequest = {
        "status": 0,
        "updated_by": req.decoded.userInfo.id,
        "updated_at": nowDateTimeGMT
    }





    // check request id is exist or not
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTimeGMT);
    let recommendDetails = await caseMemberRequestModel.getRecommendDetailsByIdAndCaseCreatorUserId(id, req.decoded.userInfo.id);

    if (isEmpty(recommendDetails)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Recommend request not found.",
        });
    }


    let caseDetails = await caseModel.getCaseAllDetailsById(recommendDetails[0].case_id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }


    let existingServiceData = await serviceModel.getServiceById(recommendDetails[0].service_id);
    if (isEmpty(existingServiceData)) {
        // delete this request as service is deleted
        await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id);
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Service not found.",
        });
    }

    let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
        recommendDetails[0].service_id
    );


    let userInfo = await userModel.getUserById(recommendDetails[0].service_provider_id);

    if (isEmpty(userInfo)) {
        // delete this request as user delete
        await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id);
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "User not found."
            });
    }

    let flag = false; // user it for check user role has permission to access the service

    for (let index = 0; index < accessList.length; index++) {
        if (accessList[index].role_id == userInfo[0].role_id) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        // delete this request as user role not match
        await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id);
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Can't add this user in this service."
            });
    }

    // user provide service list check
    let isRequestUserProvideThisService = await userProvideServiceModel.getUserProvideServiceByUserIdAndServiceId(recommendDetails[0].service_provider_id, recommendDetails[0].service_id);

    if (isEmpty(isRequestUserProvideThisService)) {
        // delete this request as now user not provide this service
        await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id);
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Can't add this user in this service."
            });
    }

    // check any user/member already added in this service
    let caseMemberListInThisService = await caseMemberModel.getRunningCaseMemberListByCaseIdServiceId(recommendDetails[0].case_id, recommendDetails[0].service_id);

    if (!isEmpty(caseMemberListInThisService)) {
        // delete this request as member already added in this service
        await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id);
        return res.status(404)
            .send({
                "success": false,
                "status": 422,
                "message": "Already member added in this service."
            });
    }


    let caseMemberRequestListInThisServiceForThisUser = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceIdAndUserId(recommendDetails[0].case_id,
        recommendDetails[0].service_id, recommendDetails[0].service_provider_id, nowDateTimeGMT);

    let walletTransaction = {};

    if (!isEmpty(caseMemberRequestListInThisServiceForThisUser)) {

        if (caseMemberRequestListInThisServiceForThisUser[0].request_type == 2 && caseMemberRequestListInThisServiceForThisUser[0].request_status == 3) {

            objectForAddRequest = {};

            if (action == 1) {
                objectForAddRequest = {
                    "updated_by": req.decoded.userInfo.id,
                    "request_user_id": req.decoded.userInfo.id,
                    "request_status": 1,
                    "expired_at": expiredDateGMT,
                    "updated_at": nowDateTime
                }

                // now check owner balance for add user in this service
                let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

                walletTransaction = {
                    "userWallet": [],
                    "easifiWallet": [],
                    "walletTransaction": [],
                };

                if (paymentType == 1) {
                    let currentBalance = await userBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);

                    if (isEmpty(currentBalance)) {
                        return res.status(404)
                            .send({
                                "success": false,
                                "status": 404,
                                "message": "Your easifi wallet is empty.",
                            });
                    }

                    if (currentBalance[0].balance < recommendDetails[0].amount) {
                        return res.status(404)
                            .send({
                                "success": false,
                                "status": 404,
                                "message": "Your easifi wallet balance is not enough, please add money in your wallet.",
                            });
                    } else {

                        walletTransaction.userWallet.push({
                            "user_id": req.decoded.userInfo.id,
                            "balance": currentBalance[0].balance - recommendDetails[0].amount
                        });

                        walletTransaction.easifiWallet.push({
                            "balance": easifiBalance[0].balance + recommendDetails[0].amount
                        });


                        walletTransaction.walletTransaction.push({
                            "user_id": req.decoded.userInfo.id,
                            "table_name": "mtae_user_account_balance",
                            "table_id": currentBalance[0].id,
                            "starting_amount": currentBalance[0].balance,
                            "ending_amount": currentBalance[0].balance - recommendDetails[0].amount,
                            "amount": recommendDetails[0].amount,
                            "transaction_type": 2,
                            "transaction_to": "Account",
                            "reason": "Cut amount for sent request to service provider.",
                            "transaction_info": JSON.stringify(walletTransaction.userWallet[0]),
                            "created_at": await commonObject.getGMT(),
                            "updated_at": await commonObject.getGMT(),
                            "created_by": req.decoded.userInfo.id,
                            "updated_by": req.decoded.userInfo.id
                            // "transaction_info": "",
                        })

                        walletTransaction.walletTransaction.push({
                            "user_id": 0,
                            "table_name": "mtae_easifi_account_balance",
                            "table_id": 1,
                            "starting_amount": easifiBalance[0].balance,
                            "ending_amount": easifiBalance[0].balance + recommendDetails[0].amount,
                            "amount": recommendDetails[0].amount,
                            "reason": "Get amount as user sent request to service provider.",
                            "transaction_type": 1,
                            "transaction_to": "Account",
                            "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
                            "created_at": await commonObject.getGMT(),
                            "updated_at": await commonObject.getGMT(),
                            "created_by": req.decoded.userInfo.id,
                            "updated_by": req.decoded.userInfo.id
                            // "transaction_info": "",
                        })

                    }
                } else {
                    return res.status(500).send({
                        "success": false,
                        "status": 500,
                        "message": "Select Stripe payment type."
                    });
                }

            } else {
                objectForAddRequest = {
                    "updated_by": req.decoded.userInfo.id,
                    "request_status": 2,
                    "updated_at": nowDateTime
                }
            }


            let updateResult = await caseMemberRequestModel.updateCaseMemberRequestByID(objectForAddRequest, recommendDetails[0].id, walletTransaction);

            easifiAccountBalanceModel.updateBalanceById(1);
            userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);

            if (updateResult.affectedRows == undefined || updateResult.affectedRows == 0) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database."
                });
            } else {

                if (action == 1) {

                    let recommendationSenderDetails = await commonObject.getUserInfoByUserId(recommendDetails[0].request_user_id);

                    // notification
                    let notificationOne = {
                        "sender_id": req.decoded.userInfo.id,
                        "receiver_id": recommendDetails[0].request_user_id,
                        "is_receive_all": 0,
                        "receiver_type": recommendationSenderDetails.data[0].role_id,
                        "title": "Recommendation for Case ID: " + caseDetails[0].case_id + " has been approved",
                        "url": `${process.env.frontend_url}/case/${id}`,
                        "created_by": req.decoded.userInfo.id,
                        "updated_by": req.decoded.userInfo.id,
                        "created_at": nowDateTime,
                        "updated_at": nowDateTime,
                    }

                    let insertNotification = await notificationModel.addNewNotification(notificationOne);
                    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                        return res.status(500).send({
                            "success": false,
                            "status": 500,
                            "message": "Something Wrong in system database."
                        });
                    }

                    // notification send to the recommended service

                    req.socket_io.emit('notification', {
                        "receiverId": notificationOne.receiver_id,
                        "notification": notificationOne.title,
                        "isReceiveAll": notificationOne.is_receive_all,
                        "receiverType": notificationOne.receiver_type,
                        "url": notificationOne.url,
                    });

                    // send email


                    let receiverMail = recommendationSenderDetails.data[0].email;

                    // let emailBody = `
                    //     <p>Recommendation for Case ID:  ${caseDetails[0].case_id} has been approved</p>
                    //     `;

                    let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
                        receiverMail,
                        "Recommendation Update",
                        `Recommendation for Case ID:  ${caseDetails[0].case_id} has been approved`,
                        "Click here to view details",
                        `${process.env.frontend_url}/case/${caseDetails[0].id}`
                    );

                } else if (action == 2) {
                    let recommendationSenderDetails = await commonObject.getUserInfoByUserId(recommendDetails[0].request_user_id);

                    // notification
                    let notificationOne = {
                        "sender_id": req.decoded.userInfo.id,
                        "receiver_id": recommendDetails[0].request_user_id,
                        "is_receive_all": 0,
                        "receiver_type": recommendationSenderDetails.data[0].role_id,
                        "title": "Recommendation for Case ID: " + caseDetails[0].case_id + " has been rejected",
                        "url": `${process.env.frontend_url}/case/${id}`,
                        "created_by": req.decoded.userInfo.id,
                        "updated_by": req.decoded.userInfo.id,
                        "created_at": nowDateTime,
                        "updated_at": nowDateTime,
                    }

                    let insertNotification = await notificationModel.addNewNotification(notificationOne);
                    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                        return res.status(500).send({
                            "success": false,
                            "status": 500,
                            "message": "Something Wrong in system database."
                        });
                    }

                    // notification send to the recommended service

                    req.socket_io.emit('notification', {
                        "receiverId": notificationOne.receiver_id,
                        "notification": notificationOne.title,
                        "isReceiveAll": notificationOne.is_receive_all,
                        "receiverType": notificationOne.receiver_type,
                        "url": notificationOne.url,
                    });

                    // send email


                    let receiverMail = recommendationSenderDetails.data[0].email;

                    // let emailBody = `
                    //     <p>Recommendation for Case ID:  ${caseDetails[0].case_id} has been rejected</p>
                    //     `;

                    let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
                        receiverMail,
                        "Recommendation Update",
                        `Recommendation for Case ID:  ${caseDetails[0].case_id} has been rejected`,
                        "Click here to view details",
                        `${process.env.frontend_url}/case/${caseDetails[0].id}`
                    );
                }

                return res.status(201)
                    .send({
                        "success": true,
                        "status": 201,
                        "message": action == 1 ? "Recommendation approved and request has sent." : "Request reject successfully.",
                    });
            }
        } else {
            return res.status(422)
                .send({
                    "success": false,
                    "status": 422,
                    "message": "Already send request to member."
                });
        }
    } else {
        return res.status(201)
            .send({
                "success": true,
                "status": 422,
                "message": "Already send request to member.",
            });
    }

});


router.post('/cancelMySendRequest', [verifyToken, routeAccessChecker("cancelMySendRequest")], async (req, res) => {

    let id = req.body.id;
    let nowDateTime = new Date();
    let nowDateTimeGMT = await commonObject.getGMT(nowDateTime);

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTimeGMT);
    let result = await caseMemberRequestModel.getSendRequestDetailsByIdAndUserId(id, req.decoded.userInfo.id);

    if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown request.",
        });
    }

    if (result[0].service_provider_response !== 3) {
        return res.status(422).send({
            success: false,
            status: 403,
            message: "Request already accepted or rejected. So you cant cancel this user.",
        });
    }


    // now check owner balance for add user in this service
    let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

    walletTransaction = {
        "userWallet": [],
        "easifiWallet": [],
        "walletTransaction": [],
    };


    let currentBalance = await userBalanceModel.getCurrentBalanceByUserID(req.decoded.userInfo.id);

    if (isEmpty(currentBalance)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Your easifi wallet is not found.",
            });
    }


    walletTransaction.userWallet.push({
        "user_id": req.decoded.userInfo.id,
        "balance": currentBalance[0].balance + result[0].amount
    });

    walletTransaction.easifiWallet.push({
        "balance": easifiBalance[0].balance - result[0].amount
    });

    walletTransaction.walletTransaction.push({
        "user_id": req.decoded.userInfo.id,
        "table_name": "mtae_user_account_balance",
        "table_id": currentBalance[0].id,
        "starting_amount": currentBalance[0].balance,
        "ending_amount": currentBalance[0].balance + result[0].amount,
        "amount": result[0].amount,
        "transaction_type": 1,
        "transaction_to": "Account",
        "reason": "Service provider cancel request",
        "transaction_info": JSON.stringify(walletTransaction.userWallet[0]),
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT(),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
    })

    walletTransaction.walletTransaction.push({
        "user_id": 0,
        "table_name": "mtae_easifi_account_balance",
        "table_id": 1,
        "starting_amount": easifiBalance[0].balance,
        "ending_amount": easifiBalance[0].balance - result[0].amount,
        "amount": result[0].amount,
        "transaction_type": 2,
        "transaction_to": "Account",
        "reason": "Service provider cancel request",
        "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT(),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
    });

    result = await caseMemberRequestModel.updateCaseMemberRequestByID({ "updated_by": req.decoded.userInfo.id, "status": 0, "updated_at": nowDateTime }, id, walletTransaction);

    easifiAccountBalanceModel.updateBalanceById(1);
    userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);

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
        "message": "Member request cancel successfully done.",
    });

});


router.post('/cancelMySendRecommendList', [verifyToken, routeAccessChecker("cancelMySendRecommendList")], async (req, res) => {

    let id = req.body.id;
    let nowDateTime = new Date();
    let nowDateTimeGMT = await commonObject.getGMT(nowDateTime);

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTimeGMT);
    let result = await caseMemberRequestModel.getPendingSentRecommendListByIdAndUserId(id, req.decoded.userInfo.id);

    if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown request.",
        });
    }

    result = await caseMemberRequestModel.updateCaseMemberRequestByID({ "updated_by": req.decoded.userInfo.id, "status": 0, "updated_at": nowDateTime }, id);

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
        "message": "Member request successfully done."
    });

});


router.post('/changeMyServiceStatus', [verifyToken, routeAccessChecker("changeMyCaseServiceStatus")], async (req, res) => {

    let nowDateTimeGMT = await commonObject.getGMT();
    let id = req.body.id;
    let action = req.body.action;

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;

    validateId = await commonObject.checkItsNumber(action);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Action should be integer.",
        });
    }

    action = validateId.data;

    if ([1, 2, 3].indexOf(action) === -1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Unknown action id. It's 1 = Todo, 2 = Inprogress, 3 = Complete.",
        });
    }

    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTimeGMT);
    let caseMemberDetails = await caseMemberModel.getCaseMemberInfoByIdAndUserId(id, req.decoded.userInfo.id); // check user is member or not

    if (isEmpty(caseMemberDetails)) {
        return res.status(401).send({
            success: false,
            status: 401,
            message: "Unknown case u can't access this.",
        });
    } else if (caseMemberDetails[0].service_status == 3) {

        return res.status(401).send({
            success: false,
            status: 401,
            message: "Service already complete,  you can't change service status.",
        });

    }

    let caseData = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }


    caseMemberDetails = caseMemberDetails[0];

    // console.log(caseMemberDetails);
    let customerPayableAmount = [];

    if (action === 3) {

        // now check owner balance for add user in this service

        // casePaymentRecord.userWallet.push({
        //     "user_id": req.decoded.userInfo.id,
        //     "balance": currentBalance[0].balance + result[0].amount
        // });

        // walletTransaction.easifiWallet.push({
        //     "balance": easifiBalance[0].balance - result[0].amount
        // });

        // id: 2,
        // created_by: 72,
        // updated_by: 72,
        // case_id: 8,
        // service_id: 2,
        // user_id: 72,
        // mtae_members_request_id: 6,
        // amount: 200,
        // service_status: 2,
        // status: 1,

        let memberRequestDetails = await caseMemberRequestModel.getCaseMemberRequestById(caseMemberDetails.mtae_members_request_id);

        if (isEmpty(memberRequestDetails)) {
            return res.status(401).send({
                success: false,
                status: 401,
                message: "A problem arise in your payment, please contact to support team.",
            });
        }

        customerPayableAmount.push({
            "payment_sender_id": memberRequestDetails[0].request_user_id,
            "payment_receiver_id": caseMemberDetails.user_id,
            "table_name": "mtae_case_members",
            "table_id": id,
            "amount": caseMemberDetails.amount,
            "is_approve": 2,
            "reason": "Case complete, so pay the service provider",
            "status": 1,
            "created_at": await commonObject.getGMT(),
            "updated_at": await commonObject.getGMT()
        });

    }


    // return res.status(500).send({
    //     "success": false,
    //     "status": 500,
    //     "message": "Something Wrong in system database.",
    //     customerPayableAmount
    // });

    result = await caseMemberModel.updateCaseMemberByID({ "updated_by": req.decoded.userInfo.id, "service_status": action, "updated_at": nowDateTimeGMT }, id, customerPayableAmount);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    // notification for user
    let caseMemberIds = await commonObject.getCaseMembersUserIds(caseData[0].id);


    for (let i = 0; i < caseMemberIds.data.length; i++) {
        if (caseMemberIds.data[i].user_id != req.decoded.userInfo.id) {
            // notification
            let notification = {
                "sender_id": req.decoded.userInfo.id,
                "receiver_id": caseMemberIds.data[i].user_id,
                "is_receive_all": 0, // no
                "receiver_type": caseMemberIds.data[i].role_id,
                "title": `One of the service status on  ${caseData[0].case_id} has changed`,
                "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id,
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
            }

            let insertNotification = await notificationModel.addNewNotification(notification);
            if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database."
                });
            }

            // emit notifications
            req.socket_io.emit('notification', {
                "receiverId": notification.receiver_id,
                "notification": notification.title,
                "isReceiveAll": notification.is_receive_all,
                "receiverType": notification.receiver_type,
                "url": notification.url,
            });
        }
    }


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Service status now in " + (action == 1 ? "Todo" : (action == 2 ? "Inprogress" : "Complete")) + "."
    });

});

/// case delete
router.delete("/caseDelete", [verifyToken, routeAccessChecker("caseDelete")], async (req, res) => {

    let reqData = {
        id: req.body.id,
    };

    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.id = validateId.data;

    let caseData = await caseModel.getCaseAllDetailsById(reqData.id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }

    // check if user has permission to access this case.

    if (caseData[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You don't have permission to delete this Case."
            });
    }

    let caseMemberList = await caseMemberModel.getCaseMemberListByCaseId(reqData.id);

    if (caseMemberList.length > 0) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You cant delete this Case as Service has added."
            });
    }

    let caseMemberRequestList = await caseMemberRequestModel.getCaseMemberRequestListByCaseId(reqData.id);

    let totalMemberInRequestList = 0;

    if (caseMemberRequestList.length > 0) {
        totalMemberInRequestList = caseMemberRequestList.length;
    }

    // case files list
    // let caseFileList = await caseFileModel.getCaseFileListByCaseId(caseData[0].id);

    // let totalCaseFile = 0;
    // let caseTrashFileData = {};
    // let caseFileIds = []; 

    // if (caseFileList.length > 0) {
    //     totalCaseFile = caseFileList.length;

    //     for(let i = 0; i < totalCaseFile; i++) {
    //         caseFileIds.push(caseFileList[i].id);
    //     }

    // let caseTrashFileData = {
    //     "user_id": req.decoded.userInfo.id,
    //     "trash_type": "case_file",
    //     "table_name": "mtae_case_files",
    //     "table_id": caseFileData[0].id,
    //     "expired_time": await commonObject.getCustomDateTime(nowDateTimeGMT, parseInt(expiredTime)),
    // }
    //}

    let nowDateTimeGMT = await commonObject.getGMT();
    let expiredTime = process.env.AUTO_DELETE_FILE;

    let caseTrashData = {
        "user_id": req.decoded.userInfo.id,
        "trash_type": "case",
        "table_name": "mtae_cases",
        "table_id": caseData[0].id,
        "expired_time": await commonObject.getCustomDateTime(nowDateTimeGMT, parseInt(expiredTime)),
    }


    let result = await caseModel.deleteCaseById(reqData, totalMemberInRequestList, caseTrashData);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something Wrong in system database.",
        });
    }

    // notification
    let notificationOne = {
        "sender_id": 0,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 1, // super Admin
        "title": `Case id ${caseData[0].case_id} has been deleted`,
        "url": '',
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotification = await notificationModel.addNewNotification(notificationOne);
    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    let notificationTwo = {
        "sender_id": 0,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 2, // Admin
        "title": `Case id ${caseData[0].case_id} has been deleted`,
        "url": '',
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotificationTwo = await notificationModel.addNewNotification(notificationTwo);
    if (insertNotificationTwo.affectedRows == undefined || insertNotificationTwo.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    req.socket_io.emit('notification', {
        "receiverId": notificationOne.receiver_id,
        "notification": notificationOne.title,
        "isReceiveAll": notificationOne.is_receive_all,
        "receiverType": notificationOne.receiver_type,
        "url": notificationOne.url,
    });

    req.socket_io.emit('notification', {
        "receiverId": notificationTwo.receiver_id,
        "notification": notificationTwo.title,
        "isReceiveAll": notificationTwo.is_receive_all,
        "receiverType": notificationTwo.receiver_type,
        "url": notificationTwo.url,
    });

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case  Deleted Successfully.",
    });
}
);

/// case file delete
router.delete("/caseFileDelete", [verifyToken, routeAccessChecker("caseFileDelete")], async (req, res) => {

    let reqData = {
        id: req.body.id,
    };

    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    }

    reqData.id = validateId.data;

    let caseFileData = await caseFileModel.getCaseFileDataById(reqData.id);

    if (isEmpty(caseFileData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case File Not Found."
            });
    }




    let caseData = await caseModel.getCaseAllDetailsById(caseFileData[0].case_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }

    // check if user has permission to access this case.

    if (caseFileData[0].created_by != req.decoded.userInfo.id && caseData[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You don't have permission to delete this file."
            });
    }

    let nowDateTimeGMT = await commonObject.getGMT();
    let expiredTime = process.env.AUTO_DELETE_FILE;

    let trashData = {
        "user_id": req.decoded.userInfo.id,
        "trash_type": "case_file",
        "table_name": "mtae_case_files",
        "table_id": caseFileData[0].id,
        "expired_time": await commonObject.getCustomDateTime(nowDateTimeGMT, parseInt(expiredTime)),
    }


    let result = await caseFileModel.deleteCaseFileById(reqData, trashData);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something Wrong in system database.",
        });
    }

    // notifications
    let caseMemberIds = await commonObject.getCaseMembersUserIds(caseData[0].id);

    for (let i = 0; i < caseMemberIds.data.length; i++) {
        if (caseMemberIds.data[i].user_id != req.decoded.userInfo.id) {

            let notification = {
                "sender_id": req.decoded.userInfo.id,
                "receiver_id": caseMemberIds.data[i].user_id,
                "is_receive_all": 0, // no
                "receiver_type": caseMemberIds.data[i].role_id,
                "title": `A case file deleted from  ${caseData[0].case_id}`,
                "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id,
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
            }

            let insertNotification = await notificationModel.addNewNotification(notification);
            if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
                return res.status(500).send({
                    "success": false,
                    "status": 500,
                    "message": "Something Wrong in system database."
                });
            }

            // emit notifications
            req.socket_io.emit('notification', {
                "receiverId": notification.receiver_id,
                "notification": notification.title,
                "isReceiveAll": notification.is_receive_all,
                "receiverType": notification.receiver_type,
                "url": notification.url,
            });
        }
    }

    // notification for admin super admin
    let notificationOne = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 1, // super Admin
        "title": `A case file deleted from  ${caseData[0].case_id}`,
        "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotification = await notificationModel.addNewNotification(notificationOne);
    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    let notificationTwo = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": 0,
        "is_receive_all": 1,
        "receiver_type": 2, // Admin
        "title": `A case file deleted from  ${caseData[0].case_id}`,
        "url": `${process.env.frontend_url}/case/${caseData[0].id}`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    let insertNotificationTwo = await notificationModel.addNewNotification(notificationTwo);
    if (insertNotificationTwo.affectedRows == undefined || insertNotificationTwo.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    req.socket_io.emit('notification', {
        "receiverId": notificationOne.receiver_id,
        "notification": notificationOne.title,
        "isReceiveAll": notificationOne.is_receive_all,
        "receiverType": notificationOne.receiver_type,
        "url": notificationOne.url,
    });

    req.socket_io.emit('notification', {
        "receiverId": notificationTwo.receiver_id,
        "notification": notificationTwo.title,
        "isReceiveAll": notificationTwo.is_receive_all,
        "receiverType": notificationTwo.receiver_type,
        "url": notificationTwo.url,
    });

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case File Deleted Successfully.",
    });
}
);


// router.get('/case/payment/:case_id', [verifyToken, routeAccessChecker("casePayablePaymentList")], async (req, res) => {

//     let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
//     let id = req.params.case_id;
//     let validateId = await commonObject.checkItsNumber(id);
//     if (validateId.success == false) {
//         return res.status(400).send({
//             "success": false,
//             "status": 400,
//             "message": "Id should be integer.",
//             "id": id

//         });
//     } else {
//         id = validateId.data;
//     }

//     let caseDetails = await caseModel.getCaseById(id);

//     if (isEmpty(caseDetails)) {
//         return res.status(404)
//             .send({
//                 "success": false,
//                 "status": 404,
//                 "message": "Case not found."
//             });
//     }


//     // check if user has permission to access this case.
//     let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, caseDetails[0].id);
//     let hasVIPPermission = await commonObject.accessPermissionChecker(req, "caseDetailsViewForAdministration");

//     let userAccessRole = "zero";
//     let nowDateTimeGMT = await commonObject.getGMT();
//     let result = [];


//     if (caseDetails[0].created_by === req.decoded.userInfo.id) {

//         userAccessRole = "case-owner";
//         caseDetails[0].patient_name = await commonObject.decodingUsingCrypto(caseDetails[0].patient_name);
//         caseDetails[0].patient_age = await commonObject.decodingUsingCrypto(caseDetails[0].patient_age);
//         caseDetails[0].patient_address = await commonObject.decodingUsingCrypto(caseDetails[0].patient_address);

//     } else if (caseMemberCheck.success === true || hasVIPPermission) {

//         userAccessRole = hasVIPPermission ? "admin-view" : "case-member";
//         delete caseDetails[0].patient_name;
//         delete caseDetails[0].patient_age;
//         delete caseDetails[0].patient_address;

//     } else {

//         let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdAndUserId(id, req.decoded.userInfo.id, nowDateTimeGMT);

//         if (isEmpty(caseMemberRequestListInThisService)) {
//             return res.status(404)
//                 .send({
//                     "success": false,
//                     "status": 404,
//                     "message": "Case not found."
//                 });
//         } else {
//             userAccessRole = "case-member-request";

//             delete caseDetails[0].patient_name;
//             delete caseDetails[0].patient_age;
//             delete caseDetails[0].patient_address;
//         }
//     }

//     let profileDetails = await commonObject.getUserInfoByUserId(caseDetails[0].created_by);
//     caseDetails[0].creator_name = profileDetails.data[0].full_name;
//     caseDetails[0].profile_image = profileDetails.data[0].profile_image;

//     let serviceList = [];

//     if (userAccessRole !== "case-member-request") {

//         let tempServiceList = await serviceModel.getServiceList();

//         for (let index = 0; index < tempServiceList.length; index++) {
//             let service = tempServiceList[index];
//             service.can_add_member = false;

//             let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
//                 service.id
//             );

//             //  get user access role for this service
//             let tempAccessList = [];

//             for (let index = 0; index < accessList.length; index++) {
//                 let access = accessList[index];
//                 tempAccessList.push(access.role_id);
//             }

//             // Check user has permission to send request to the user
//             let requestMemberPermission = await commonObject.getPermissionListForSendRequestOrRecommend(tempAccessList);

//             for (let tempSendPermissionIndex = 0; tempSendPermissionIndex < requestMemberPermission.length; tempSendPermissionIndex++) {
//                 for (let tempMainPermissionIndex = 0; tempMainPermissionIndex < req.decoded.permissions.length; tempMainPermissionIndex++) {
//                     if (requestMemberPermission[tempSendPermissionIndex] === req.decoded.permissions[tempMainPermissionIndex]) {
//                         service.can_add_member = true;
//                         break;
//                     }
//                 }
//             }

//             // if (req.decoded.permissions.includes(requestMemberPermission) === true) {
//             //     service.can_add_member = true;
//             // }

//             let caseMemberListInThisService = await caseMemberModel.getTotalCaseMemberListByCaseIdServiceId(id, service.id);

//             for (let index = 0; index < caseMemberListInThisService.length; index++) {
//                 let profileDetails = await commonObject.getUserInfoByUserId(caseMemberListInThisService[index].user_id);

//                 caseMemberListInThisService[index].profile_name = profileDetails.data[0].full_name;
//                 caseMemberListInThisService[index].profile_image = profileDetails.data[0].profile_image;

//                 // delete unwanted field
//                 if (caseMemberListInThisService[index].hasOwnProperty("created_by")) delete caseMemberListInThisService[index].created_by;
//                 if (caseMemberListInThisService[index].hasOwnProperty("updated_by")) delete caseMemberListInThisService[index].updated_by;
//                 if (caseMemberListInThisService[index].hasOwnProperty("case_id")) delete caseMemberListInThisService[index].case_id;
//                 if (caseMemberListInThisService[index].hasOwnProperty("service_id")) delete caseMemberListInThisService[index].service_id;
//                 if (caseMemberListInThisService[index].hasOwnProperty("mtae_members_request_id")) delete caseMemberListInThisService[index].mtae_members_request_id;
//                 if (caseMemberListInThisService[index].hasOwnProperty("created_at")) delete caseMemberListInThisService[index].created_at;
//                 if (caseMemberListInThisService[index].hasOwnProperty("updated_at")) delete caseMemberListInThisService[index].updated_at;
//             }

//             let caseMemberRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRequestListByCaseIdServiceId(id, service.id, nowDateTimeGMT);

//             for (let i = 0; i < caseMemberRequestListInThisService.length; i++) {
//                 let profileDetails = await commonObject.getUserInfoByUserId(caseMemberRequestListInThisService[i].service_provider_id);

//                 caseMemberRequestListInThisService[i].profile_name = profileDetails.data[0].full_name;
//                 caseMemberRequestListInThisService[i].profile_image = profileDetails.data[0].profile_image;

//                 // delete unwanted field
//                 //if (caseMemberRequestListInThisService[i].hasOwnProperty("created_by")) delete caseMemberRequestListInThisService[i].created_by;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("updated_by")) delete caseMemberRequestListInThisService[i].updated_by;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("case_id")) delete caseMemberRequestListInThisService[i].case_id;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("service_id")) delete caseMemberRequestListInThisService[i].service_id;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("request_user_id")) delete caseMemberRequestListInThisService[i].request_user_id;
//                 //if (caseMemberRequestListInThisService[i].hasOwnProperty("service_provider_response")) delete caseMemberRequestListInThisService[i].service_provider_response;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("created_at")) delete caseMemberRequestListInThisService[i].created_at;
//                 if (caseMemberRequestListInThisService[i].hasOwnProperty("updated_at")) delete caseMemberRequestListInThisService[i].updated_at;
//             }

//             let caseMemberRecommendRequestListInThisService = await caseMemberRequestModel.getSentCaseMemberRecommendListByCaseIdAndServiceId(id, service.id, nowDateTimeGMT);

//             for (let i = 0; i < caseMemberRecommendRequestListInThisService.length; i++) {
//                 let profileDetails = await commonObject.getUserInfoByUserId(caseMemberRecommendRequestListInThisService[i].service_provider_id);

//                 caseMemberRecommendRequestListInThisService[i].profile_name = profileDetails.data[0].full_name;
//                 caseMemberRecommendRequestListInThisService[i].profile_image = profileDetails.data[0].profile_image;

//                 // delete unwanted field
//                 //if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("created_by")) delete caseMemberRecommendRequestListInThisService[i].created_by;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("updated_by")) delete caseMemberRecommendRequestListInThisService[i].updated_by;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("case_id")) delete caseMemberRecommendRequestListInThisService[i].case_id;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("service_id")) delete caseMemberRecommendRequestListInThisService[i].service_id;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("request_user_id")) delete caseMemberRecommendRequestListInThisService[i].request_user_id;
//                 //if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("service_provider_response")) delete caseMemberRecommendRequestListInThisService[i].service_provider_response;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("created_at")) delete caseMemberRecommendRequestListInThisService[i].created_at;
//                 if (caseMemberRecommendRequestListInThisService[i].hasOwnProperty("updated_at")) delete caseMemberRecommendRequestListInThisService[i].updated_at;
//             }

//             serviceList.push({
//                 "service": service,
//                 "caseMember": caseMemberListInThisService,
//                 "caseMemberRequest": caseMemberRequestListInThisService,
//                 "caseMemberRecommendRequest": caseMemberRecommendRequestListInThisService,
//             });
//         }
//     }

//     // case files list
//     let caseFileList = await caseFileModel.getCaseFileListByCaseId(caseDetails[0].id);

//     // get creator info
//     for (let index = 0; index < caseFileList.length; index++) {
//         let profileDetails = await commonObject.getUserInfoByUserId(caseFileList[index].created_by);
//         caseFileList[index].uploaded_by = profileDetails.data[0].full_name;
//     }

//     caseDetails[0].imageFolderPath = imageFolderPath;
//     caseDetails[0].userAccessRole = userAccessRole;
//     caseDetails[0].serviceList = serviceList;
//     caseDetails[0].caseFileList = caseFileList;


//     //  let fileLis = await fileUploaderCommonObject.uploadFile(req, "caseFile", "file");


//     return res.status(200).send({
//         "success": true,
//         "status": 200,
//         "message": "Case List.",
//         "file-path": `${process.env.backend_url}${process.env.case_file_path_name}`,
//         "data": caseDetails[0]
//     });
// });


router.post('/payment-pay-to-service-holder', [verifyToken, routeAccessChecker("paymentPayToServiceHolder")], async (req, res) => {

    let nowDateTimeGMT = await commonObject.getGMT();
    let id = req.body.id;
    let rating = req.body.rating;
    let review = req.body.review;

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }


    id = validateId.data;

    // rating validate
    let validateRating = await commonObject.checkItsNumber(rating);
    if (validateRating.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Rating should be integer.",
        });
    }


    rating = validateRating.data;

    if (rating > 5 || rating < 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Rating should be between 1 to 5.",
        });
    }

    // review validate
    if (review == undefined || review == "") {
        review = '';
    }


    let customerPayableAmountDetails = await customerPayableAmountModel.getPaymentRequestInfoByIdAndPaymentSenderId(id, req.decoded.userInfo.id);

    if (isEmpty(customerPayableAmountDetails)) {
        return res.status(401).send({
            success: false,
            status: 401,
            message: "Unknown payment request."
        });
    } else if (customerPayableAmountDetails[0].is_approve == 1) {
        return res.status(401).send({
            success: false,
            status: 401,
            message: "You already pay  this payment.."
        });
    }


    // now check owner balance for add user in this service
    let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

    let walletTransaction = {
        "userWallet": [],
        "easifiWallet": [],
        "walletTransaction": [],
        "casePaymentRecord": [],
    };


    let receiverCurrentBalance = await userBalanceModel.getCurrentBalanceByUserID(customerPayableAmountDetails[0].payment_receiver_id);

    if (isEmpty(receiverCurrentBalance)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "A problem arise in your payment, please contact to support team.",
            });
    }

    walletTransaction.userWallet.push({
        "user_id": customerPayableAmountDetails[0].payment_receiver_id,
        "balance": receiverCurrentBalance[0].balance + customerPayableAmountDetails[0].amount,
        "updated_at": nowDateTimeGMT
    });

    walletTransaction.easifiWallet.push({
        "balance": easifiBalance[0].balance - customerPayableAmountDetails[0].amount,
        "updated_at": nowDateTimeGMT
    });

    walletTransaction.walletTransaction.push({
        "user_id": customerPayableAmountDetails[0].payment_receiver_id,
        "table_name": "mtae_customer_payable_amount",
        "table_id": receiverCurrentBalance[0].id,
        "starting_amount": receiverCurrentBalance[0].balance,
        "ending_amount": receiverCurrentBalance[0].balance + customerPayableAmountDetails[0].amount,
        "amount": customerPayableAmountDetails[0].amount,
        "transaction_type": 1,
        "transaction_to": "Account",
        "reason": "Get payment for service",
        "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": "Get payment for service provide" }),
        "created_at": nowDateTimeGMT,
        "updated_at": nowDateTimeGMT,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
        // "transaction_info": "",
    })

    walletTransaction.walletTransaction.push({
        "user_id": 0,
        "table_name": "mtae_customer_payable_amount",
        "table_id": 1,
        "starting_amount": easifiBalance[0].balance,
        "ending_amount": easifiBalance[0].balance - customerPayableAmountDetails[0].amount,
        "amount": customerPayableAmountDetails[0].amount,
        "transaction_type": 2,
        "transaction_to": "Account",
        "reason": "Give payment to service provider",
        "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
        "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `Payment to service holder id ${customerPayableAmountDetails[0].payment_receiver_id} as provider already complete the work. User ${customerPayableAmountDetails[0].payment_sender_id} approve it.` }),
        "created_at": nowDateTimeGMT,
        "updated_at": nowDateTimeGMT,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
        // "transaction_info": "",
    })

    walletTransaction.casePaymentRecord.push({
        "table_name": "mtae_customer_payable_amount",
        "table_id": id,
        "case_id": customerPayableAmountDetails[0].table_id,
        "case_member_id": customerPayableAmountDetails[0].payment_receiver_id,
        "payment_method": "Account",
        "transaction_status": 1,
        "amount": customerPayableAmountDetails[0].amount,
        "created_at": nowDateTimeGMT,
        "updated_at": nowDateTimeGMT
    })


    let result = await customerPayableAmountModel.updateCustomerPayableAmountByID({ "is_approve": 1, "updated_at": nowDateTimeGMT, "rating": rating, "review": review }, id, walletTransaction);

    easifiAccountBalanceModel.updateBalanceById(1);
    userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);
    userBalanceModel.updateBalanceByUserId(customerPayableAmountDetails[0].payment_receiver_id);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    // profile table rating update code start
    let profileDetailsOfServiceProvider = await commonObject.getUserInfoByUserId(customerPayableAmountDetails[0].payment_receiver_id);

    let currentAvgRating = profileDetailsOfServiceProvider.data[0].ratings;
    let totalCompletedCase = profileDetailsOfServiceProvider.data[0].completed_case;

    let newAvgRating = (currentAvgRating * totalCompletedCase + rating) / (totalCompletedCase + 1);
    newAvgRating = parseFloat(newAvgRating.toFixed(2));
    let newTotalCompletedCase = totalCompletedCase + 1;

    let updateRatingObject = {
        "ratings": newAvgRating,
        "completed_case": newTotalCompletedCase,
        "updated_at": nowDateTimeGMT
    }

    if (profileDetailsOfServiceProvider.data[0].role_id === 3) {
        let updateProfileRating = await dentistModel.updateRatingById(updateRatingObject, profileDetailsOfServiceProvider.data[0].id);

        if (updateProfileRating.affectedRows == undefined || updateProfileRating.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in updating Rating."
            });
        }

    } else if (profileDetailsOfServiceProvider.data[0].role_id === 4) {
        let updateProfileRating = await consultantModel.updateRatingById(updateRatingObject, profileDetailsOfServiceProvider.data[0].id);

        if (updateProfileRating.affectedRows == undefined || updateProfileRating.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in updating Rating."
            });
        }

    } else if (profileDetailsOfServiceProvider.data[0].role_id === 5) {
        let updateProfileRating = await labModel.updateRatingById(updateRatingObject, profileDetailsOfServiceProvider.data[0].id);

        if (updateProfileRating.affectedRows == undefined || updateProfileRating.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in updating Rating."
            });
        }


    } else if (profileDetailsOfServiceProvider.data[0].role_id === 6) {
        let updateProfileRating = await techCompanyModel.updateRatingById(updateRatingObject, profileDetailsOfServiceProvider.data[0].id);

        if (updateProfileRating.affectedRows == undefined || updateProfileRating.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in updating Rating."
            });
        }

    }

    // notification
    let notification = {
        "sender_id": req.decoded.userInfo.id,
        "receiver_id": customerPayableAmountDetails[0].payment_receiver_id,
        "is_receive_all": 0,
        "receiver_type": profileDetailsOfServiceProvider.data[0].role_id,
        "title": "One of your service payment has been confirmed.",
        "url": `${process.env.frontend_url}/payments`,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT(),
    }

    let insertNotification = await notificationModel.addNewNotification(notification);
    if (insertNotification.affectedRows == undefined || insertNotification.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    req.socket_io.emit('notification', {
        "receiverId": notification.receiver_id,
        "notification": notification.title,
        "isReceiveAll": notification.is_receive_all,
        "receiverType": notification.receiver_type,
        "url": notification.url,
    });


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Payment successfully done.",
    });

});



router.post('/cancelServiceInCase', [verifyToken], async (req, res) => {

    let nowDateTimeGMT = await commonObject.getGMT();
    let id = req.body.id;
    // let notifications = [];

    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "ID should be integer.",
        });
    }

    id = validateId.data;



    // update date over request date;
    let updatedAllDateOverRequest = await caseMemberRequestModel.updatedAllDateOverRequest(nowDateTimeGMT);
    let caseMemberDetails = await caseMemberModel.getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId(id, req.decoded.userInfo.id); // check user is member or not

    // let caseMemberAndCaseDetails = await caseMemberModel.getCaseMemberInfoAndCaseInfoById(id); // check user is member or not



    if (isEmpty(caseMemberDetails)) {
        return res.status(401).send({
            success: false,
            status: 401,
            message: "Unknown case member.",
        });
    }


    // case details
    let caseDetails = await caseModel.getCaseById(caseMemberDetails[0].case_id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }


    let hourAlreadyPass = Math.floor((await commonObject.compareTwoDate(nowDateTimeGMT, caseMemberDetails[0].created_at, false)).hours);
    hourAlreadyPass = hourAlreadyPass == 0 ? 1 : hourAlreadyPass;

    let serviceAssociatedType = caseMemberDetails[0].request_user_id != req.decoded.userInfo.id ? "service_provider" : "sender";
    let caseServiceStatus = caseMemberDetails[0].service_status;
    let cancelRules = await caseCancelScenarioModel.getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour(serviceAssociatedType, caseServiceStatus, hourAlreadyPass);
    let message = "Service member remove successfully done.";

    if (isEmpty(cancelRules) || cancelRules[0].is_allow != 1) {
        return res.status(401).send({
            success: false,
            status: 401,
            message: "You can't cancel this member in this service.",
            cancelRules
        });
    }



    let cancelFeeAmount = cancelRules[0].cancellation_fee_type == 1 ? caseMemberDetails[0].amount * (cancelRules[0].cancellation_fee / 100) : cancelRules[0].cancellation_fee;

    // console.log(hourAlreadyPass);
    // console.log(caseMemberDetails);
    // console.log(cancelRules);
    // console.log(cancelFeeAmount);

    let isEasifiProvideCharge = false;
    let isEasifiReceiveFine = cancelRules[0].cancellation_fee_receiver === "Go to easifi" ? true : false;
    let serviceProviderObjectUpdate = {}

    if (cancelRules[0].service_associated_type === "service_provider" && req.decoded.profileInfo.hasOwnProperty("service_cancel_availability")) {

        if (req.decoded.profileInfo.service_cancel_availability > 0) {
            isEasifiProvideCharge = true;
            serviceProviderObjectUpdate = {
                "id": req.decoded.profileInfo.id,
                "roleId": req.decoded.role.id,
                "service_cancel_availability": req.decoded.profileInfo.service_cancel_availability - 1,
            }
        }
    }



    let easifiBalance = await easifiAccountBalanceModel.getBalanceByID(1);

    let walletTransaction = {
        "userWallet": [],
        "easifiWallet": [],
        "walletTransaction": [],
        "extraInfoUpdate": {
            "userProfile": []
        }
    };



    let serviceProviderBalance = await userBalanceModel.getCurrentBalanceByUserID(caseMemberDetails[0].user_id);
    let requestCreatorBalance = await userBalanceModel.getCurrentBalanceByUserID(caseMemberDetails[0].request_user_id);
    let serviceCancelRequestUserBalance;

    // console.log("hourAlreadyPass")
    // console.table(hourAlreadyPass)

    // console.log("cancelRules")
    // console.table(cancelRules[0])

    // console.log("serviceProviderBalance")
    // console.table(serviceProviderBalance)

    // console.log("requestCreatorBalance")
    // console.table(requestCreatorBalance)

    // console.log(req.decoded.userInfo)
    // console.log(req.decoded.profileInfo)
    // console.log(req.decoded.role)


    let notification = {
        "sender_id": req.decoded.userInfo.id,
        "is_receive_all": 0,
        "receiver_type": req.decoded.userInfo.role_id,
        "url": '#',
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id,
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT()
    }

    // console.log(caseMemberDetails);
    // console.log(caseMemberDetails);


    if (serviceAssociatedType == "sender") {

        //member request sender,  request for cancel member, so he will be charge.

        walletTransaction.userWallet.push({
            "user_id": caseMemberDetails[0].request_user_id,
            "balance": requestCreatorBalance[0].balance + caseMemberDetails[0].amount - cancelFeeAmount,
            "updated_at": nowDateTimeGMT
        });

        serviceCancelRequestUserBalance = requestCreatorBalance;

        notification.receiver_id = caseMemberDetails[0].created_by;
        notification.title = `You are remove from Case Id ${caseDetails[0].case_id}`;



    } else {

        walletTransaction.userWallet.push({
            "user_id": caseMemberDetails[0].request_user_id,
            "balance": requestCreatorBalance[0].balance + caseMemberDetails[0].amount + (isEasifiReceiveFine ? 0 : cancelFeeAmount),
            "updated_at": nowDateTimeGMT
        });

        serviceCancelRequestUserBalance = serviceProviderBalance;

        notification.receiver_id = caseMemberDetails[0].request_user_id;
        notification.title = `Service remover his/her membership from the case  ${caseDetails[0].case_id}`;

    }

    walletTransaction.easifiWallet.push({
        "balance": easifiBalance[0].balance - caseMemberDetails[0].amount + (isEasifiReceiveFine ? cancelFeeAmount : 0) - (isEasifiProvideCharge ? cancelFeeAmount : 0),
        "updated_at": nowDateTimeGMT
    });


  
    walletTransaction.walletTransaction.push({
        "user_id": requestCreatorBalance[0].user_id,
        "table_name": "mtae_user_account_balance",
        "table_id": requestCreatorBalance[0].id,
        "starting_amount": requestCreatorBalance[0].balance,
        "ending_amount": requestCreatorBalance[0].balance + caseMemberDetails[0].amount,
        "amount": caseMemberDetails[0].amount,
        "transaction_type": 1,
        "transaction_to": "Account",
        "reason": "Remove member from case",
        "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": "User cancel the service member" }),
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT(),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
        // "transaction_info": "",
    })

    walletTransaction.walletTransaction.push({
        "user_id": 0,
        "table_name": "mtae_easifi_account_balance",
        "table_id": 1,
        "starting_amount": easifiBalance[0].balance,
        "ending_amount": easifiBalance[0].balance - caseMemberDetails[0].amount,
        "amount": caseMemberDetails[0].amount,
        "transaction_type": 2,
        "transaction_to": "Account",
        "reason": "Remove member from case",
        "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
        "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `User cancel the service member` }),
        "created_at": await commonObject.getGMT(),
        "updated_at": await commonObject.getGMT(),
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id
        // "transaction_info": "",
    })

    if (cancelFeeAmount > 0) {
        // this is depend on the service provider or sender who cancel the service member,  
        // so i use serviceCancelRequestUserBalance where we store who request for cancel the service member.


        if (isEasifiProvideCharge) {

            walletTransaction.walletTransaction.push({
                "user_id": 0,
                "table_name": "mtae_easifi_account_balance",
                "table_id": 1,
                "starting_amount": easifiBalance[0].balance - caseMemberDetails[0].amount,
                "ending_amount": easifiBalance[0].balance - caseMemberDetails[0].amount - cancelFeeAmount,
                "amount": cancelFeeAmount,
                "transaction_type": 1,
                "transaction_to": "Account",
                "reason": "Give cancel fee to easifi account",
                "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
                "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `Fine service member (${serviceAssociatedType})` }),
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id
                // "transaction_info": "",
            });

            message = "Service member remove successfully done. If you cancel any service further you will be fined a penalty of $50 according to Easifi policy.";
            walletTransaction.extraInfoUpdate.userProfile.push(serviceProviderObjectUpdate);

        } else {

            walletTransaction.walletTransaction.push({
                "user_id": serviceCancelRequestUserBalance[0].user_id,
                "table_name": "mtae_user_account_balance",
                "table_id": serviceCancelRequestUserBalance[0].id,
                "starting_amount": serviceCancelRequestUserBalance[0].balance + caseMemberDetails[0].amount,
                "ending_amount": serviceCancelRequestUserBalance[0].balance + caseMemberDetails[0].amount - cancelFeeAmount,
                "amount": cancelFeeAmount,
                "transaction_type": 2,
                "transaction_to": "Account",
                "reason": "Give fine as user remove member from case",
                "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `Fine service member` }),
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id
                // "transaction_info": "",
            })

        }

        if (isEasifiReceiveFine) {
            walletTransaction.walletTransaction.push({
                "user_id": 0,
                "table_name": "mtae_easifi_account_balance",
                "table_id": 1,
                "starting_amount": easifiBalance[0].balance - caseMemberDetails[0].amount,
                "ending_amount": easifiBalance[0].balance - caseMemberDetails[0].amount + cancelFeeAmount,
                "amount": cancelFeeAmount,
                "transaction_type": 1,
                "transaction_to": "Account",
                "reason": "Get fine as user cancel member from case",
                "transaction_info": JSON.stringify(walletTransaction.easifiWallet[0]),
                "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": `Fine service member (${serviceAssociatedType})` }),
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id
                // "transaction_info": "",
            })

        } else {

            walletTransaction.walletTransaction.push({
                "user_id": requestCreatorBalance[0].user_id,
                "table_name": "mtae_user_account_balance",
                "table_id": requestCreatorBalance[0].id,
                "starting_amount": requestCreatorBalance[0].balance + caseMemberDetails[0].amount,
                "ending_amount": requestCreatorBalance[0].balance + caseMemberDetails[0].amount + cancelFeeAmount,
                "amount": cancelFeeAmount,
                "transaction_type": 1,
                "transaction_to": "Account",
                "reason": "Get fine as service provider cancel case service",
                "transaction_info": JSON.stringify({ ...walletTransaction.userWallet[0], "reason": "User cancel the service member" }),
                "created_at": await commonObject.getGMT(),
                "updated_at": await commonObject.getGMT(),
                "created_by": req.decoded.userInfo.id,
                "updated_by": req.decoded.userInfo.id
                // "transaction_info": "",
            })
        }
    }


    // return res.status(401).send({
    //     // cancelRules,
    //     success: false,
    //     status: 401,
    //     message: "You can cancel this member in this service.",
    //     walletTransaction,
    //     isEasifiProvideCharge,
    //     cancelFeeAmount,
    //     // "use":  req.decoded,
    // });


    // return res.status(500).send({
    //     "success": false,
    //     "status": 500,
    //     "message": "Something Wrong in system database.",
    //     walletTransaction
    // });


    result = await caseMemberModel.cancelCaseMemberByID({ "updated_by": req.decoded.userInfo.id, "status": 0, "updated_at": nowDateTimeGMT }, id, walletTransaction);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    let insertNotificationResult = await notificationModel.addNewNotification(notification);
    req.socket_io.emit('notification', {
        "receiverId": notification.receiver_id,
        "notification": notification.title,
        "isReceiveAll": notification.is_receive_all,
        "receiverType": notification.receiver_type,
        "url": notification.url,
    });


    easifiAccountBalanceModel.updateBalanceById(1);
    // userBalanceModel.updateBalanceByUserId(req.decoded.userInfo.id);
    userBalanceModel.updateBalanceByUserId(serviceCancelRequestUserBalance[0].user_id);


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": message
    });

});

// case complete list
router.get('/completeList/:id', [verifyToken, routeAccessChecker("completeList")], async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let id = req.params.id;
    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Id should be integer.",
            "id": id

        });
    } else {
        id = validateId.data;
    }

    let caseDetails = await caseModel.getCaseById(id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }

    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, id);

    if (caseMemberCheck.success == false && caseDetails[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You have no permission to access this case.",
            });
    }


    let result = [];
    let table_name = "mtae_case_members";

    result = await customerPayableAmountModel.getMyCaseCompletedListByCaseId(req.decoded.userInfo.id, table_name, id);

    for (let i = 0; i < result.length; i++) {
        let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(result[i].table_id);

        result[i].case_member_details = caseMemberDetails[0];

        let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
        if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
        if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
        if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
        result[i].case_details = caseDetails[0];

        let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
        result[i].service = serviceDetails[0];
        result[i].service_name = serviceDetails[0].name;



        let profileDetails = await commonObject.getUserInfoByUserId(caseMemberDetails[0].user_id);
        result[i].name = profileDetails.data[0].full_name;
        result[i].profile_image = profileDetails.data[0].profile_image;
        result[i].service_status = 'Complete';

    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case Complete List.",
        "imageFolderPath": imageFolderPath,
        "count": result.length,
        "data": result
    });
});

// case payment history list
router.get('/casePaymentHistory/:id', [verifyToken, routeAccessChecker("casePaymentHistory")], async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let id = req.params.id;
    let validateId = await commonObject.checkItsNumber(id);
    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Id should be integer.",
            "id": id

        });
    } else {
        id = validateId.data;
    }

    let caseDetails = await caseModel.getCaseById(id);

    if (isEmpty(caseDetails)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case not found."
            });
    }

    // check if user has permission to access this case.
    let caseMemberCheck = await commonObject.checkUserAccessInThisCase(req.decoded.userInfo.id, id);

    if (caseMemberCheck.success == false && caseDetails[0].created_by != req.decoded.userInfo.id) {
        return res.status(401)
            .send({
                "success": false,
                "status": 401,
                "message": "You have no permission to access this case.",
            });
    }


    let table_name = "mtae_case_members";
    let caseApprovedPayments = [];

    if (caseDetails[0].created_by == req.decoded.userInfo.id) {
        // case approved payment list
        caseApprovedPayments = await customerPayableAmountModel.getCaseApprovedPaymentsByCaseId(table_name, id);

        for (let i = 0; i < caseApprovedPayments.length; i++) {
            let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(caseApprovedPayments[i].table_id);
            let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
            caseApprovedPayments[i].service = serviceDetails[0];
            caseApprovedPayments[i].service_name = serviceDetails[0].name;



            let profileDetails = await commonObject.getUserInfoByUserId(caseMemberDetails[0].user_id);
            caseApprovedPayments[i].name = profileDetails.data[0].full_name;
            caseApprovedPayments[i].profile_image = profileDetails.data[0].profile_image;

        }
    } else if (caseMemberCheck.success == true && req.decoded.userInfo.role_id == 5) {
        // case approved payment list
        caseApprovedPayments = await customerPayableAmountModel.getCaseApprovedPaymentsByCaseIdAndUserId(req.decoded.userInfo.id, table_name, id);

        for (let i = 0; i < caseApprovedPayments.length; i++) {
            let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(caseApprovedPayments[i].table_id);
            let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
            caseApprovedPayments[i].service = serviceDetails[0];
            caseApprovedPayments[i].service_name = serviceDetails[0].name;



            let profileDetails = await commonObject.getUserInfoByUserId(caseMemberDetails[0].user_id);
            caseApprovedPayments[i].name = profileDetails.data[0].full_name;
            caseApprovedPayments[i].profile_image = profileDetails.data[0].profile_image;

        }

    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case Payment History.",
        "imageFolderPath": imageFolderPath,
        "count": caseApprovedPayments.length,
        "data": caseApprovedPayments
    });
});

module.exports = router;