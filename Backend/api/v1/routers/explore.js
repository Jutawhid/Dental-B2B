require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const stateModel = require('../models/state');
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
const exploreModel = require('../models/explore');
const userProvideServiceModel = require('../models/userProvideService');
const serviceModel = require("../models/service");
const serviceAccessRolesModel = require("../models/serviceAccessRoles");
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");


//explore page data without limit
router.get("/homeExploreListWithoutLimit", [verifyToken, routeAccessChecker("homeExploreListWithoutLimit")], async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    let consultantList = await consultantModel.getActiveConsultantList();
    let labList = await labModel.getActiveLabList();
    let techList = await techCompanyModel.getActiveTechList();

    // user provide services and favorite
    let isFavorite ;

    // for consultant
    
    for (let i = 0; i < consultantList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,consultantList[i].user_id,consultantList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            consultantList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            consultantList[i].is_favorite = isFavorite;
        }
        consultantList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(consultantList[i].user_id, consultantList[i].role_id);
    }

    // for lab

    for (let i = 0; i < labList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,labList[i].user_id,labList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            labList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            labList[i].is_favorite = isFavorite;
        }
        labList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(labList[i].user_id, labList[i].role_id);
    }
    // for tech
    for (let i = 0; i < techList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,techList[i].user_id,techList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            techList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            techList[i].is_favorite = isFavorite;
        }
        techList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(techList[i].user_id, techList[i].role_id);
    }


    let consultantResponse = {
        role_name: "Consultant",
        role_id: 4,
        total_count: consultantList.length,
        imageFolderPath: imageFolderPath,
        data: consultantList,
    };

    let labResponse = {
        role_name: "Lab",
        role_id: 5,
        total_count: labList.length,
        imageFolderPath: imageFolderPath,
        data: labList,
    };

    let techResponse = {
        role_name: "Tech",
        role_id: 6,
        total_count: techList.length,
        imageFolderPath: imageFolderPath,
        data: techList,
    };

    let response = [];
    response.push(consultantResponse);
    response.push(labResponse);
    response.push(techResponse);

    // if(req.decoded.userInfo.role_id == 3){
    //     response.push(consultantResponse);
    //     response.push(labResponse);
    //     response.push(techResponse);
    // } else if(req.decoded.userInfo.role_id == 4){
    //     response.push(labResponse);
    //     response.push(techResponse);
    // } else if(req.decoded.userInfo.role_id == 5){
    //     response.push(techResponse);
    // }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "User List",
        data: response,
    });
}
);

// explore page data with limit
router.get("/homeExploreList", [verifyToken, routeAccessChecker("homeExploreList")], async (req, res) => {

    let limit = 10;
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    let consultantList = await exploreModel.getExploreConsultantList(limit);
    let labList = await exploreModel.getExploreLabList(limit);
    let techList = await exploreModel.getExploreTechList(limit);

    // total all users
    
    let allConsultant = await consultantModel.getActiveConsultantList();
    let allLab = await labModel.getActiveLabList();
    let allTech = await techCompanyModel.getActiveTechList();


    // user provide services and favorite
    let isFavorite ;
    // for consultant
    
    for (let i = 0; i < consultantList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,consultantList[i].user_id,consultantList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            consultantList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            consultantList[i].is_favorite = isFavorite;
        }
        consultantList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(consultantList[i].user_id, consultantList[i].role_id);
    }

    // for lab

    for (let i = 0; i < labList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,labList[i].user_id,labList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            labList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            labList[i].is_favorite = isFavorite;
        }
        labList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(labList[i].user_id, labList[i].role_id);
    }
    // for tech
    for (let i = 0; i < techList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,techList[i].user_id,techList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            techList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            techList[i].is_favorite = isFavorite;
        }
        techList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(techList[i].user_id, techList[i].role_id);
    }


    let consultantResponse = {
        role_name: "Consultant",
        role_id: 4,
        total_count: consultantList.length,
        limit: limit,
        end_id:
            consultantList.length > 0
                ? consultantList[consultantList.length - 1].id
                : 0,
        has_next: consultantList.length >= limit ? true : false,
        total_pages: Math.ceil(allConsultant.length / limit),
        imageFolderPath: imageFolderPath,
        data: consultantList,
    };

    let labResponse = {
        role_name: "Lab",
        role_id: 5,
        total_count: labList.length,
        limit: limit,
        end_id: labList.length > 0 ? labList[labList.length - 1].id : 0,
        has_next: labList.length >= limit ? true : false,
        total_pages: Math.ceil(allLab.length / limit),
        imageFolderPath: imageFolderPath,
        data: labList,
    };

    let techResponse = {
        role_name: "Tech",
        role_id: 6,
        total_count: techList.length,
        limit: limit,
        end_id: techList.length > 0 ? techList[techList.length - 1].id : 0,
        has_next: techList.length >= limit ? true : false,
        total_pages: Math.ceil(allTech.length / limit),
        imageFolderPath: imageFolderPath,
        data: techList,
    };

    let response = [];
    response.push(consultantResponse);
    response.push(labResponse);
    response.push(techResponse);

    // if(req.decoded.userInfo.role_id == 3){
    //     response.push(consultantResponse);
    //     response.push(labResponse);
    //     response.push(techResponse);
    // } else if(req.decoded.userInfo.role_id == 4){
    //     response.push(labResponse);
    //     response.push(techResponse);
    // } else if(req.decoded.userInfo.role_id == 5){
    //     response.push(techResponse);
    // }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "User List",
        data: response,
    });
}
);

// will use later
router.post("/globalSearch", [verifyToken, routeAccessChecker("globalSearch")], async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    let searchField = {};
    let errorMessage = "";
    let isError = 0;


    // let reqData = {
    //     id: req.body.id,
    // };

    // service ids
    if (req.body.service_id !== undefined && Array.isArray(req.body.service_id) && req.body.service_id.length > 0) {

        // check duplicate element in array
        let duplicate = req.body.service_id.some((element, index) => {
            return req.body.service_id.indexOf(element) !== index;
          });
  
          if (duplicate) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: "Service id contains duplicate value.",
            });
          }
  
          // check service type
          for (let i = 0; i < req.body.service_id.length; i++) {
            
  
            let validateServiceId = await commonObject.checkItsNumber(req.body.service_id[i]);
  
            if (validateServiceId.success == false) {
  
              return res.status(400).send({
                success: false,
                status: 400,
                message: `${req.body.service_id[i]} Value should be integer.`
              });
  
            }
  
            req.body.service_id[i] = validateServiceId.data;
            
  
            let serviceData = await serviceModel.getServiceById(req.body.service_id[i]);
            
            if (isEmpty(serviceData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: `${req.body.service_id[i]} not found.`
            });
            }
          }
          searchField.service_id = req.body.service_id;
    }


    // state id
    if (req.body.state_id !== undefined && req.body.state_id !== "") {

        let validateId = await commonObject.checkItsNumber(req.body.state_id);

        if (validateId.success === false) {
            return res.status(400).send({
            success: false,
            status: 400,
            message: ` ${req.body.state_id} Value (State value) should be integer.`,
            });
        }

        req.body.state_id = validateId.data;
        searchField.state_id = req.body.state_id;

        let stateData = await stateModel.getStateById(req.body.state_id);

        if (isEmpty(stateData)) {
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": "No State found",

            });

    }
    }


    // name
    if (req.body.name !== undefined && req.body.name !== "") {
        if (req.body.name.length < 1) {
            return res.send({
                "error": true,
                "message": "Need valid  name and there should be at least one character",
            });
        } else {
            searchField.name = req.body.name;
        }

    }


    // rating

    if (req.body.ratings !== undefined && req.body.ratings !== "") {

        let validateId = await commonObject.checkItsNumber(req.body.ratings);

        if (validateId.success === false) {
            return res.status(400).send({
            success: false,
            status: 400,
            message: `${req.body.ratings} Value should be integer.`,
            });
        }

        req.body.ratings = validateId.data;
        searchField.ratings = req.body.ratings;
    }

    
    let consultantList = await consultantModel.getActiveConsultantList();
    let labList = await labModel.getActiveLabList();
    let techList = await techCompanyModel.getActiveTechList();
    
    return res.status(200).send({
        success: true,
        status: 200,
        message: searchField
    });

    

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case File Restored Successfully.",
    });
}
);


//tech lab consultant search
router.post("/companySearch", [verifyToken, routeAccessChecker("companySearch")], async (req, res) => {

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let searchField = {};
    let errorMessage = "";
    let isError = 0;

    // name
    if (req.body.name !== undefined && req.body.name !== "") {
        if (req.body.name.length < 1) {
            return res.send({
                "error": true,
                "message": "Need valid  company name and there should be at least one character",
            });
        } else {
            searchField.name = req.body.name;
        }

    }

    let dentistList = await dentistModel.getDentistListByName(searchField.name);
    let consultantList = await consultantModel.getConsultantListByName(searchField.name);
    let labList = await labModel.getLabListByName(searchField.name);
    let techList = await techCompanyModel.getTechListByName(searchField.name);

    // user provide services and favorite
    let isFavorite ;

    // for consultant
    
    for (let i = 0; i < consultantList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,consultantList[i].user_id,consultantList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            consultantList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            consultantList[i].is_favorite = isFavorite;
        }
        consultantList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(consultantList[i].user_id, consultantList[i].role_id);
    }

    // for lab

    for (let i = 0; i < labList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,labList[i].user_id,labList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            labList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            labList[i].is_favorite = isFavorite;
        }
        labList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(labList[i].user_id, labList[i].role_id);
    }
    // for tech
    for (let i = 0; i < techList.length; i++) {
        let existInFavoriteList = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id,techList[i].user_id,techList[i].role_id); 
        if(!isEmpty(existInFavoriteList)){
            isFavorite = true;
            techList[i].is_favorite = isFavorite;
        } else {
            isFavorite = false;
            techList[i].is_favorite = isFavorite;
        }
        techList[i].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(techList[i].user_id, techList[i].role_id);
    }


    let dentistResponse = {
        role_name: "Dentist",
        role_id: 4,
        total_count: dentistList.length,
        imageFolderPath: imageFolderPath,
        data: dentistList,
    };

    let consultantResponse = {
        role_name: "Consultant",
        role_id: 4,
        total_count: consultantList.length,
        imageFolderPath: imageFolderPath,
        data: consultantList,
    };

    let labResponse = {
        role_name: "Lab",
        role_id: 5,
        total_count: labList.length,
        imageFolderPath: imageFolderPath,
        data: labList,
    };

    let techResponse = {
        role_name: "Tech",
        role_id: 6,
        total_count: techList.length,
        imageFolderPath: imageFolderPath,
        data: techList,
    };

    let response = [];

    if(req.decoded.userInfo.role_id == 1 || req.decoded.userInfo.role_id == 2){
        response.push(dentistResponse);
    }

    response.push(consultantResponse);
    response.push(labResponse);
    response.push(techResponse);

    return res.status(200).send({
        success: true,
        status: 200,
        message: "User List Searched By Name",
        data: response
    });
}
);





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