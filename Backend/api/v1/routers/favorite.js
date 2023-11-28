require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const zipModel = require('../models/zip');
const userModel = require('../models/user');
const superAdminModel = require('../models/superAdmin');
const adminModel = require('../models/admin');
const dentistModel = require('../models/dentist');
const consultantModel = require('../models/consultant');
const labModel = require('../models/lab');
const techCompanyModel = require('../models/techCompany');
const roleModel = require('../models/role');
const favoriteModel = require('../models/favorite');
const userProvideServiceModel = require('../models/userProvideService');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");


// all fav without limit
router.get("/allFavoriteList",[verifyToken, routeAccessChecker("allFavoriteList")],async (req, res) => {
    
    
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    
    let consultantRole = await roleModel.getRoleByIdentityId(4);

    if (isEmpty(consultantRole)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: " Unknown User role.",
        });
    }

    let labRole = await roleModel.getRoleByIdentityId(5);

    if (isEmpty(labRole)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: " Unknown User role.",
        });
    }
    let techRole = await roleModel.getRoleByIdentityId(6);

    if (isEmpty(techRole)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: " Unknown User role.",
        });
    }

    let consultantRoleId = consultantRole[0].identity_id;
    let labRoleId = labRole[0].identity_id;
    let techRoleId = techRole[0].identity_id;


    let allFavorites = await favoriteModel.getAllFavoriteList(req.decoded.userInfo.id);

    // my all favorites by user role

    let myAllFavConsultants = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,consultantRoleId);
    let myAllFavLabs = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,labRoleId);
    let myAllFavTechs = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,techRoleId);

    let userData;

    // user provide services

    // for consultant
    
    for(let i=0;i<myAllFavConsultants.length;i++){
        userData = await userModel.getUserById(myAllFavConsultants[i].favorite_user_id);
        myAllFavConsultants[i].profileData = await consultantModel.getConsultantById(userData[0].profile_id); 
        myAllFavConsultants[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myAllFavConsultants[i].favorite_user_id,consultantRoleId);

        zipInfoDetails = await zipModel.getZipDetailsById(myAllFavConsultants[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

        myAllFavConsultants[i].profileData[0].zip_info = zipInfo;
         
    }
    

    // for lab
    
    for(let i=0;i<myAllFavLabs.length;i++){
        userData = await userModel.getUserById(myAllFavLabs[i].favorite_user_id);
        myAllFavLabs[i].profileData = await labModel.getLabById(userData[0].profile_id); 
        myAllFavLabs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myAllFavLabs[i].favorite_user_id,labRoleId);

        zipInfoDetails = await zipModel.getZipDetailsById(myAllFavLabs[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

            myAllFavLabs[i].profileData[0].zip_info = zipInfo;
         
    }

    // for tech
    for(let i=0;i<myAllFavTechs.length;i++){
        userData = await userModel.getUserById(myAllFavTechs[i].favorite_user_id);
        myAllFavTechs[i].profileData = await techCompanyModel.getTechCompanyById(userData[0].profile_id);
        myAllFavTechs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myAllFavTechs[i].favorite_user_id,techRoleId);

        zipInfoDetails = await zipModel.getZipDetailsById(myAllFavTechs[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

            myAllFavTechs[i].profileData[0].zip_info = zipInfo;
         
    }
    

    let consultantResponse = {
        role_name: "Consultant",
        role_id: 4,
        total_count: myAllFavConsultants.length,
        imageFolderPath: imageFolderPath,
        data: myAllFavConsultants,
    };

    let labResponse = {
        role_name: "Lab",
        role_id: 5,
        total_count: myAllFavLabs.length,
        imageFolderPath: imageFolderPath,
        data: myAllFavLabs,
    };

    let techResponse = {
        role_name: "Tech",
        role_id: 6,
        total_count: myAllFavTechs.length,
        imageFolderPath: imageFolderPath,
        data: myAllFavTechs,
    };

    let response = [];

    if(req.decoded.userInfo.role_id == 3){
        response.push(consultantResponse);
        response.push(labResponse);
        response.push(techResponse);
    } else if(req.decoded.userInfo.role_id == 4){
        response.push(labResponse);
        response.push(techResponse);
    } else if(req.decoded.userInfo.role_id == 5){
        response.push(techResponse);
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Favorite List",
        data: response,
    });
}
);

/// All Favorite List
router.get("/favoriteList",[verifyToken, routeAccessChecker("favoriteList")],async (req, res) => {
    
        let limit = 10;
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
        
        let consultantRole = await roleModel.getRoleByIdentityId(4);

        if (isEmpty(consultantRole)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: " Unknown User role.",
            });
        }

        let labRole = await roleModel.getRoleByIdentityId(5);

        if (isEmpty(labRole)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: " Unknown User role.",
            });
        }
        let techRole = await roleModel.getRoleByIdentityId(6);

        if (isEmpty(techRole)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: " Unknown User role.",
            });
        }

        let consultantRoleId = consultantRole[0].identity_id;
        let labRoleId = labRole[0].identity_id;
        let techRoleId = techRole[0].identity_id;


        let allFavorites = await favoriteModel.getAllFavoriteList(req.decoded.userInfo.id);
        let myFavConsultants = await favoriteModel.getMyFavByRoleId(req.decoded.userInfo.id,consultantRoleId,limit);
        let myFavLabs = await favoriteModel.getMyFavByRoleId(req.decoded.userInfo.id,labRoleId,limit);
        let myFavTechs = await favoriteModel.getMyFavByRoleId(req.decoded.userInfo.id,techRoleId,limit);

        // my all favorites by user role

        let myAllFavConsultants = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,consultantRoleId);
        let myAllFavLabs = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,labRoleId);
        let myAllFavTechs = await favoriteModel.getMyAllFavByRoleId(req.decoded.userInfo.id,techRoleId);

        let userData;

        // user provide services

        // for consultant
        
        for(let i=0;i<myFavConsultants.length;i++){
            userData = await userModel.getUserById(myFavConsultants[i].favorite_user_id);
            myFavConsultants[i].profileData = await consultantModel.getConsultantById(userData[0].profile_id); 
            myFavConsultants[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myFavConsultants[i].favorite_user_id,consultantRoleId);
             
            zipInfoDetails = await zipModel.getZipDetailsById(myAllFavConsultants[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

            myAllFavConsultants[i].profileData[0].zip_info = zipInfo;
        }
        

        // for lab
        
        for(let i=0;i<myFavLabs.length;i++){
            userData = await userModel.getUserById(myFavLabs[i].favorite_user_id);
            myFavLabs[i].profileData = await labModel.getLabById(userData[0].profile_id); 
            myFavLabs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myFavLabs[i].favorite_user_id,labRoleId);
             
            zipInfoDetails = await zipModel.getZipDetailsById(myAllFavLabs[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

            myAllFavLabs[i].profileData[0].zip_info = zipInfo;
        }

        // for tech
        for(let i=0;i<myFavTechs.length;i++){
            userData = await userModel.getUserById(myFavTechs[i].favorite_user_id);
            myFavTechs[i].profileData = await techCompanyModel.getTechCompanyById(userData[0].profile_id);
            myFavTechs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myFavTechs[i].favorite_user_id,techRoleId);
             

            zipInfoDetails = await zipModel.getZipDetailsById(myAllFavTechs[i].profileData[0].zip_id);

            if (!isEmpty(zipInfoDetails)) {
                zipInfo = {
                    zip_id: zipInfoDetails[0].id,
                    zip_code: zipInfoDetails[0].code,
                    city_id: zipInfoDetails[0].city_id,
                    city_name: zipInfoDetails[0].city_name,
                    state_id: zipInfoDetails[0].state_id,
                    state_name: zipInfoDetails[0].state_name,
                };
            }

            myAllFavTechs[i].profileData[0].zip_info = zipInfo;

        }
        

        let consultantResponse = {
            role_name: "Consultant",
            role_id: 4,
            total_count: myFavConsultants.length,
            limit: limit,
            end_id:
            myFavConsultants.length > 0
                    ? myFavConsultants[myFavConsultants.length - 1].id
                    : 0,
            has_next: myFavConsultants.length === limit ? true : false,
            total_pages: Math.ceil(myAllFavConsultants.length / limit),
            imageFolderPath: imageFolderPath,
            data: myFavConsultants,
        };

        let labResponse = {
            role_name: "Lab",
            role_id: 5,
            total_count: myFavLabs.length,
            limit: limit,
            end_id: myFavLabs.length > 0 ? myFavLabs[myFavLabs.length - 1].id : 0,
            has_next: myFavLabs.length === limit ? true : false,
            total_pages: Math.ceil(myAllFavLabs.length / limit),
            imageFolderPath: imageFolderPath,
            data: myFavLabs,
        };

        let techResponse = {
            role_name: "Tech",
            role_id: 6,
            total_count: myFavTechs.length,
            limit: limit,
            end_id: myFavTechs.length > 0 ? myFavTechs[myFavTechs.length - 1].id : 0,
            has_next: myFavTechs.length === limit ? true : false,
            total_pages: Math.ceil(myAllFavTechs.length / limit),
            imageFolderPath: imageFolderPath,
            data: myFavTechs,
        };

        let response = [];

        if(req.decoded.userInfo.role_id == 3){
            response.push(consultantResponse);
            response.push(labResponse);
            response.push(techResponse);
        } else if(req.decoded.userInfo.role_id == 4){
            response.push(labResponse);
            response.push(techResponse);
        } else if(req.decoded.userInfo.role_id == 5){
            response.push(techResponse);
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Favorite List",
            data: response,
        });
    }
);

router.get("/nextFavList/:role_id/:start_id",[verifyToken, routeAccessChecker("nextFavList")],async (req, res) => {
        let limit = 2;
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
        let roleId = req.params.role_id;
        let startId = req.params.start_id;

        // role check
        if (isEmpty(roleId)) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Please provide user type.",
            });
        }

        let validateUserType = await commonObject.checkItsNumber(roleId);

        if (validateUserType.success == false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User Type Value should be integer.",
            });
        } else {
            req.params.role_id = validateUserType.data;
            roleId = validateUserType.data;
        }

        let roleTypeData = await roleModel.getRoleByIdentityId(roleId);

        if (isEmpty(roleTypeData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "No Role found",
            });
        }

        // check role
    if(req.decoded.userInfo.role_id === 3){
        if(roleId !== 4 && roleId !== 5 && roleId !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Dentist can request favorite list only for Consultant, Lab and Tech Company."
            });
        }
    } else if(req.decoded.userInfo.role_id === 4){
        if(roleId !== 5 && roleId !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Consultant can request favorite list only for  Lab and Tech Company."
            });
        }

    } else if(req.decoded.userInfo.role_id === 5){
        if(roleId !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Lab can request favorite list only for  Tech Company."
            });
        }
    } else if(req.decoded.userInfo.role_id === 6){
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "You can't use this feature."
            });
    }

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
 
        if (roleTypeData[0].identity_id === 4) {
            let myNextFavConsultants = await favoriteModel.getMyNextFavByRoleId(req.decoded.userInfo.id,roleTypeData[0].identity_id,startId,limit);

            for(let i=0;i<myNextFavConsultants.length;i++){
                userData = await userModel.getUserById(myNextFavConsultants[i].favorite_user_id);
                myNextFavConsultants[i].profileData = await consultantModel.getConsultantById(userData[0].profile_id); 
                myNextFavConsultants[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myNextFavConsultants[i].favorite_user_id,roleTypeData[0].identity_id);
                 
            }

            let consultantResponse = {
                role_name: "Consultant",
                role_id: 4,
                total_count: myNextFavConsultants.length,
                limit: limit,
                end_id:
                myNextFavConsultants.length > 0
                        ? myNextFavConsultants[myNextFavConsultants.length - 1].id
                        : 0,
                // has_next: myNextFavConsultants.length === limit ? true : false,
                // total_pages: Math.ceil(myNextFavConsultants.length / limit),
                // imageFolderPath: imageFolderPath,
                data: myNextFavConsultants,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "Favorite List",
                data: consultantResponse,
            });
        } else if(roleTypeData[0].identity_id === 5){
            let myNextFavLabs = await favoriteModel.getMyNextFavByRoleId(req.decoded.userInfo.id,roleTypeData[0].identity_id,startId,limit);

            for(let i=0;i<myNextFavLabs.length;i++){
                userData = await userModel.getUserById(myNextFavLabs[i].favorite_user_id);
                myNextFavLabs[i].profileData = await labModel.getLabById(userData[0].profile_id); 
                myNextFavLabs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myNextFavLabs[i].favorite_user_id,roleTypeData[0].identity_id);
                 
            }

            let labResponse = {
                role_name: "Lab",
                role_id: 5,
                total_count: myNextFavLabs.length,
                limit: limit,
                end_id:
                myNextFavLabs.length > 0
                        ? myNextFavLabs[myNextFavLabs.length - 1].id
                        : 0,
                // has_next: myNextFavLabs.length === limit ? true : false,
                // total_pages: Math.ceil(myNextFavLabs.length / limit),
                // imageFolderPath: imageFolderPath,
                data: myNextFavLabs,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "Favorite List",
                data: labResponse,
            });
        } else if(roleTypeData[0].identity_id === 6){
            let myNextFavTechs = await favoriteModel.getMyNextFavByRoleId(req.decoded.userInfo.id,roleTypeData[0].identity_id,startId,limit);

            for(let i=0;i<myNextFavTechs.length;i++){
                userData = await userModel.getUserById(myNextFavTechs[i].favorite_user_id);
                myNextFavTechs[i].profileData = await techCompanyModel.getTechCompanyById(userData[0].profile_id); 
                myNextFavTechs[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(myNextFavTechs[i].favorite_user_id,roleTypeData[0].identity_id);
                 
            }

            let techResponse = {
                role_name: "Tech",
                role_id: 6,
                total_count: myNextFavTechs.length,
                limit: limit,
                end_id:
                myNextFavTechs.length > 0
                        ? myNextFavTechs[myNextFavTechs.length - 1].id
                        : 0,
                // has_next: myNextFavTechs.length === limit ? true : false,
                // total_pages: Math.ceil(myNextFavTechs.length / limit),
                // imageFolderPath: imageFolderPath,
                data: myNextFavTechs,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "Favorite List",
                data: techResponse,
            });
        }

    }
);



router.post('/addToFavorite', [verifyToken, routeAccessChecker("addToFavorite")], async (req, res) => {

    let reqData = {
        "favorite_user_id": req.body.favorite_user_id
    }
    
    // favorite user data validate
    let validateId = await commonObject.checkItsNumber(reqData.favorite_user_id);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        req.body.favorite_user_id = validateId.data;
        reqData.favorite_user_id = validateId.data;
    }

    let favoriteUserInfo = await userModel.getUserById(reqData.favorite_user_id);

    if (isEmpty(favoriteUserInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    } else if (favoriteUserInfo[0].id == req.decoded.userInfo.id) {

        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Both id is same."
            });
    }

    if (favoriteUserInfo[0].hasOwnProperty("password")) delete favoriteUserInfo[0].password;
    if (favoriteUserInfo[0].hasOwnProperty("updated_by")) delete favoriteUserInfo[0].updated_by;
    if (favoriteUserInfo[0].hasOwnProperty("updated_at")) delete favoriteUserInfo[0].updated_at;
    
   

    // check role
    if(req.decoded.userInfo.role_id === 3){
        if(favoriteUserInfo[0].role_id !== 4 && favoriteUserInfo[0].role_id !== 5 && favoriteUserInfo[0].role_id !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Dentist can add to favorite only Consultant, Lab and Tech Company."
            });
        }
    } else if(req.decoded.userInfo.role_id === 4){
        if(favoriteUserInfo[0].role_id !== 5 && favoriteUserInfo[0].role_id !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Consultant can add to favorite only  Lab and Tech Company."
            });
        }

    } else if(req.decoded.userInfo.role_id === 5){
        if(favoriteUserInfo[0].role_id !== 6 ){
            return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Lab can add to favorite only  Tech Company."
            });
        }
    } else if(req.decoded.userInfo.role_id === 6){
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "You can't use this feature."
            });
    }
   
    // check if already added
    let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,favoriteUserInfo[0].id,favoriteUserInfo[0].role_id);

    if(existInFavoriteList.length > 0){
        return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This is already added to favorite list."
        });
    }

    reqData.favorite_user_role_id = favoriteUserInfo[0].role_id;
    reqData.user_id  = req.decoded.userInfo.id;
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();

    let result = await favoriteModel.addToFavorite(reqData);

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
        "message": "Added to favorite list."
    });

    
});


router.put('/removeFromFavorite', [verifyToken, routeAccessChecker("removeFromFavorite")], async (req, res) => {

    let reqData = {
        "favorite_user_id": req.body.favorite_user_id
    }
    
    // favorite user data validate
    let validateId = await commonObject.checkItsNumber(reqData.favorite_user_id);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        req.body.favorite_user_id = validateId.data;
        reqData.favorite_user_id = validateId.data;
    }
    
    let favoriteUserInfo = await userModel.getUserById(reqData.favorite_user_id);

    if (isEmpty(favoriteUserInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    } else if (favoriteUserInfo[0].id == req.decoded.userInfo.id) {

        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Both id is same."
            });
    }

    if (favoriteUserInfo[0].hasOwnProperty("password")) delete favoriteUserInfo[0].password;
    if (favoriteUserInfo[0].hasOwnProperty("updated_by")) delete favoriteUserInfo[0].updated_by;
    if (favoriteUserInfo[0].hasOwnProperty("updated_at")) delete favoriteUserInfo[0].updated_at;
    
    // check this user is favorite of him or not
    let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,favoriteUserInfo[0].id,favoriteUserInfo[0].role_id);

    if(isEmpty(existInFavoriteList)){
        return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This is not added in your favorite list."
        });
    }


    // remove from favorite list
    let updated_at = await commonObject.getGMT();
    let result = await favoriteModel.removeFromFavorite(existInFavoriteList[0].id,updated_at);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Removed from favorite list."
    }); 
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