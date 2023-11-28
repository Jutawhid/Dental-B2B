const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fileUpload = require('express-fileupload');


const userModel = require('../models/user');
const superAdminModel = require('../models/superAdmin');
const adminModel = require('../models/admin');
const dentistModel = require('../models/dentist');
const consultantModel = require('../models/consultant');
const labModel = require('../models/lab');
const techCompanyModel = require('../models/techCompany');
const roleModel = require('../models/role');
const registrationValidation = require('../middlewares/requestData/registration');
const adminRegistrationValidation = require('../middlewares/requestData/adminRegistrationValidation');
const userNameChecker = require('../middlewares/requestData/userNameCheck');
const passwordChangeChecker = require('../middlewares/requestData/passwordChangeChecker');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');

const loginTrackModel = require('../models/loginTrack');
const commonObject = require('../common/common');
const emailCommonObject = require('../common/email');
const fileUploaderCommonObject = require('../common/fileUploader');
const crypto = require('crypto');

// all  admin list
router.get('/list', [verifyToken, routeAccessChecker("adminList")], async (req, res) => {

    let result = await adminModel.getAllAdminList();

    for (let i = 0; i < result.length; i++) {

        if (req.decoded.userInfo.id === result[i].user_id) {
            result.splice(i, 1);
        }
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "All Admin List",
        "count": result.length,
        "imageFolderPath": `${process.env.backend_url}${process.env.admin_image_path_name}`,
        "data": result
    });

});

router.post('/registration', [verifyToken, routeAccessChecker("adminRegistration"), adminRegistrationValidation], async (req, res) => {


    // file upload code
    // let fileUploadCode = await fileUploaderCommonObject.uploadFile(REQ, "image", "profile_image");

    let reqData = req.registrationData;

    let errorMessage = "";
    let isError = 0;

    // Email already in use check
    let existingUserByEmail = await userModel.getUserByEmail(reqData.email);

    if (!isEmpty(existingUserByEmail)) {
        isError = 1;
        errorMessage += " Email already in Use.";
    }

    // Mobile number already in use check
    let existingUserByPhone = await userModel.getUserByPhone(reqData.phoneNumber);

    if (!isEmpty(existingUserByPhone)) {
        isError = 1;
        errorMessage += " Phone number already in Use.";
    }

    // duplicate user name check
    let userDataList = await userModel.getUserByUserName(reqData.userName);
    if (!isEmpty(userDataList)) {
        isError = 1;
        errorMessage += " This user name already in Use.";
    }

    reqData.password = bcrypt.hashSync(reqData.password, 10); // hashing Password



    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }


    let userInfo = {};
    let profileInfo = {};




    // data formatting
    userInfo = {

        // according to the DB Column name

        "phone": reqData.phoneNumber,
        "email": reqData.email,
        "user_name": reqData.userName,
        "role_id": reqData.userType,
        "password": reqData.password,
        //"created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id


    };

    profileInfo = {

        // according to the DB Column name
        "first_name": reqData.firstName,
        "last_name": reqData.lastName,
        "phone": reqData.phoneNumber,
        "email": reqData.email,
        "address": reqData.address,
        "user_name": reqData.userName,
        "created_by": req.decoded.userInfo.id,
        "updated_by": req.decoded.userInfo.id

    };

    let result = await userModel.addNewUser(userInfo, profileInfo);


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
        "message": "Admin Registered Successfully."
    });


});



// reset password for Easifi Admin by Super Admin
router.post('/resetPassword', [verifyToken, routeAccessChecker("adminResetPassword")], async (req, res) => {


    let updateRequestData = {
        "id": req.body.id
    }

    updateRequestData.updated_by = req.decoded.userInfo.id;
    updateRequestData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(updateRequestData.id);


    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        req.body.id = validateId.data;
        updateRequestData.id = validateId.data;
    }


    let existingUserInfo = await userModel.getUserById(updateRequestData.id);

    if (isEmpty(existingUserInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    }

    if (existingUserInfo[0].role_id != 2) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "User should be admin"
        });
    }

    let existingAdminInfo = await adminModel.getAdminById(existingUserInfo[0].profile_id);

    if (isEmpty(existingAdminInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    }

    // reset password

    existingUserInfo[0].password = bcrypt.hashSync("123456", 10); // hashing Password
    let result = await userModel.resetPasswordForUser(existingUserInfo[0].id, existingUserInfo[0].password, updateRequestData.updated_by, updateRequestData.updated_at);

    if (!isEmpty(result) && result.affectedRows == 0) {
        return res.status(500)
            .send({
                "success": false,
                "status": 500,
                "message": "Password change fail! Try again",
            });
    } else {
        return res.status(200)
            .send({
                "status": 200,
                "success": true,
                "message": "Password change successfully done"
            });
    }

});


router.post('/changeAdminStatus', [verifyToken, routeAccessChecker("changeAdminStatus")], async (req, res) => {

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

    let existingUserInfo = await userModel.getUserDetailsById(reqData.id);


    if (isEmpty(existingUserInfo)) {

        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    }

    if (existingUserInfo[0].role_id != 2) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "User should be admin"
        });
    }

    let existingAdminInfo = await adminModel.getAdminDetailsById(existingUserInfo[0].profile_id);

    if (isEmpty(existingAdminInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    }


    if (existingUserInfo[0].status === 1 && existingAdminInfo[0].status === 1) {

        let result = await userModel.disableUserById(reqData.updated_by, reqData.updated_at, existingUserInfo[0].id, existingAdminInfo[0].id, existingUserInfo[0].role_id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }


        // send mail
        let receiverMail = existingUserInfo[0].email;

        let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
            receiverMail,
            "Easifi User Status Change",
            "You have been made disable in Easifi Platform. Please Contact with admin for any queries", 
            "Go to easifi", 
            `${process.env.frontend_url}`
        );

    } else if (existingUserInfo[0].status === 2 && existingAdminInfo[0].status === 2) {
        let result = await userModel.enableUserById(reqData.updated_by, reqData.updated_at, existingUserInfo[0].id, existingAdminInfo[0].id, existingUserInfo[0].role_id);

        if (result.affectedRows == undefined || result.affectedRows == 0) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }

        // send mail
        let receiverMail = existingUserInfo[0].email;

        let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
            receiverMail,
            "Easifi User Status Change",
            "You have been made enable in Easifi Platform. Please Contact with admin for any queries", "Go to easifi", 
            `${process.env.frontend_url}`
        );
    } else {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "User is already disable."
        });
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "User Status Changed."
    });

});

/// profile update
router.put('/profile/update', [verifyToken, routeAccessChecker("adminProfileUpdate")], async (req, res) => {

    let updateRequestData = {
        "id": req.decoded.profileInfo.id,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "phone": req.body.phone,
        "address": req.body.address,
    }

    // id validation
    let validateId = await commonObject.checkItsNumber(updateRequestData.id);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        updateRequestData.id = validateId.data;
    }

    // user data validate
    let existingUserInfo = await userModel.getUserById(req.decoded.userInfo.id);

    if (isEmpty(existingUserInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    } else if (existingUserInfo[0].status !== 1) {

        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "User Deactivated."
            });

    }

    // admin details
    let existingAdminInfo = await adminModel.getAdminDetailsById(updateRequestData.id);

    if (isEmpty(existingAdminInfo)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Data not found."
            });
    } else if (existingAdminInfo[0].status !== 1) {

        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Admin Deactivated."
            });

    }

    let previousProfileImage = existingAdminInfo[0].profile_image;


    let updateData = {};
    let updateUserData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;

    //first name 
    if (existingAdminInfo[0].first_name !== updateRequestData.first_name) {


        // First name valid
        let validateFirstName = await commonObject.characterLimitCheck(updateRequestData.first_name, "First Name");

        if (validateFirstName.success == false) {
            isError = 1;
            errorMessage += validateFirstName.message;
        } else {
            updateRequestData.first_name = validateFirstName.data;
            willWeUpdate = 1;
            updateData.first_name = updateRequestData.first_name;

        }

    }

    //last name 
    if (existingAdminInfo[0].last_name !== updateRequestData.last_name) {


        // last name valid
        let validateLastName = await commonObject.characterLimitCheck(updateRequestData.last_name, "Last Name");

        if (validateLastName.success == false) {
            isError = 1;
            errorMessage += validateLastName.message;
        } else {
            updateRequestData.last_name = validateLastName.data;
            willWeUpdate = 1;
            updateData.last_name = updateRequestData.last_name;

        }

    }

    //email
    if (existingAdminInfo[0].email !== updateRequestData.email) {

        // email validation
        if (isEmpty(updateRequestData.email)) {

            isError = 1;
            errorMessage += "Email should not empty.";
        }

        let validateEmail = await commonObject.isValidEmail(updateRequestData.email);

        if (validateEmail == false) {

            isError = 1;
            errorMessage += "Email is not valid.";

        } else {
            // Email already in use check
            let existingUserByEmail = await userModel.getUserByEmail(updateRequestData.email);

            if (!isEmpty(existingUserByEmail)) {
                isError = 1;
                errorMessage += " Email already in Use.";
            } else {
                willWeUpdate = 1;
                updateData.email = updateRequestData.email;
                updateUserData.email = updateRequestData.email;
            }
        }

    }

    //phone
    if (existingAdminInfo[0].phone !== updateRequestData.phone) {

        // phone number valid

        if (isEmpty(updateRequestData.phone)) {
            isError = 1;
            errorMessage += "Mobile number should not empty.";

        }

        let validateMobileNumber = await commonObject.isValidPhoneNumberOfUS(updateRequestData.phone);
        if (validateMobileNumber == false) {
            isError = 1;
            errorMessage += "Mobile number is not valid.";
        }

        let existingUserByPhone = await userModel.getUserByPhone(updateRequestData.phone);

        if (!isEmpty(existingUserByPhone)) {
            isError = 1;
            errorMessage += " Phone number already in Use.";
        } else {

            willWeUpdate = 1;
            updateData.phone = updateRequestData.phone;
            updateUserData.phone = updateRequestData.phone;

        }

    }

    //address 
    if (existingAdminInfo[0].address !== updateRequestData.address) {

        // address check
        let validateAddress = await commonObject.characterLimitCheck(updateRequestData.address, "Address");

        if (validateAddress.success == false) {
            isError = 1;
            errorMessage += validateAddress.message;
        } else {
            updateRequestData.address = validateAddress.data;
            willWeUpdate = 1;
            updateData.address = updateRequestData.address;

        }

    }

    // image code
    if (req.files && Object.keys(req.files).length > 0) {

        let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "adminImage", "image");

        if (fileUploadCode.success == false) {
            return res.status(200).send({
                "success": false,
                "status": 400,
                "message": fileUploadCode.message,
            });
        }

        willWeUpdate = 1;
        updateRequestData.profile_image = fileUploadCode.fileName;
        updateData.profile_image = updateRequestData.profile_image;
    }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    // 

    if (willWeUpdate == 1) {

        updateData.updated_by = req.decoded.userInfo.id;
        updateData.updated_at = await commonObject.getGMT();

        if (!isEmpty(updateUserData)) {
            updateUserData.id = req.decoded.userInfo.id;
            updateUserData.updated_by = req.decoded.userInfo.id;
            updateUserData.updated_at = await commonObject.getGMT();
        }

        let result = await adminModel.updateAdminProfileById(updateRequestData.id, req.decoded.userInfo.id, updateData, updateUserData);


        if (result.affectedRows == undefined || result.affectedRows < 1) {
            return res.status(500).send({
                "success": true,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }

        if (req.files && Object.keys(req.files).length > 0) {
            if (previousProfileImage != updateData.profile_image) {
                if (previousProfileImage != "default_profile_image.png") {
                    let fileDelete = await fileUploaderCommonObject.fileRemove(previousProfileImage, "adminImage");
                }
            }
        }

        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Profile successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }



});

router.get("/adminProfileDetails/:user_id", [verifyToken, routeAccessChecker("adminProfileDetails")], async (req, res) => {

    let userId = req.params.user_id;
    let imageFolderPath =  `${process.env.backend_url}${process.env.admin_image_path_name}`;

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

        let existingUserInfo = await userModel.getUserById(userId);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User not found.",
            });
        }


        if (existingUserInfo[0].hasOwnProperty("password"))
            delete existingUserInfo[0].password;
        if (existingUserInfo[0].hasOwnProperty("user_name"))
            delete existingUserInfo[0].user_name;
        if (existingUserInfo[0].hasOwnProperty("updated_by"))
            delete existingUserInfo[0].updated_by;
        if (existingUserInfo[0].hasOwnProperty("updated_at"))
            delete existingUserInfo[0].updated_at;
        if (existingUserInfo[0].hasOwnProperty("email"))
            delete existingUserInfo[0].email;
        if (existingUserInfo[0].hasOwnProperty("phone"))
            delete existingUserInfo[0].phone;

        if (existingUserInfo[0].role_id != 2) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User should be  Admin.",
            });
        }

        let profileInfo = {};

        
        profileInfo = await await adminModel.getAdminById(existingUserInfo[0].profile_id);
        profileInfo[0].user_id = existingUserInfo[0].id;
        profileInfo[0].role_id = existingUserInfo[0].role_id;
        profileInfo[0].image_folder_path = imageFolderPath;

        if (isEmpty(profileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User not exist.",
            });
        }

        if (profileInfo[0].hasOwnProperty("email"))
            delete profileInfo[0].email;
        if (profileInfo[0].hasOwnProperty("phone"))
            delete profileInfo[0].phone;
        

        return res.status(200).send({
            success: true,
            status: 200,
            data: profileInfo[0],
        });
    
}
);



module.exports = router;