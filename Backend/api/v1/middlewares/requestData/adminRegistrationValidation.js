var express = require('express');
var router = express.Router();
const isEmpty = require("is-empty");
const commonObject = require('../../common/common');
const roleModel = require('../../models/role');
const multer = require('multer');
var upload = multer({ dest: 'upload/'});
var fs = require('fs');

  
// var upload = multer({ storage: storage });

router.use(async function (req, res, next) {

    let reqUserData = {
        "firstName": req.body.first_name,
        "lastName": req.body.last_name,
        // "profileImage": fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.profile_image)),
        "userType": req.body.user_type,
        "phoneNumber": req.body.phone_number,
        "email": req.body.email,
        "address": req.body.address,
        "userName": req.body.user_name,
        "password": req.body.password,
        "confirmPassword": req.body.confirm_password
    }


    let errorMessage = "";
    let isError = 0;


    // role check
    if (isEmpty(reqUserData.userType)) {
        
        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Please provide user type."
            });
    } 

    reqUserData.userType = parseInt(reqUserData.userType);

    let validateUserType = await commonObject.checkItsNumber(reqUserData.userType);

    if (validateUserType.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."
        });
    } else {
        req.body.user_type = validateUserType.data;
        reqUserData.userType = validateUserType.data;
    }

    let roleTypeData = await roleModel.getRoleByIdentityId(reqUserData.userType);

    if(isEmpty(roleTypeData)){
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No Role found",

        });
    }

    if(roleTypeData[0].identity_id !== 2){
        return res.status(401).send({
            "success": false,
            "status": 401,
            "message": "You are not allowed to register this user type.",

        });
    }

    // First name valid
    let validateFirstName = await commonObject.characterLimitCheck(reqUserData.firstName, "First Name");
        
    if (validateFirstName.success == false) {
        isError = 1;
        errorMessage += validateFirstName.message;
    }

    reqUserData.firstName = validateFirstName.data;

    //last name valid
    let validateLastName = await commonObject.characterLimitCheck(reqUserData.lastName, "Last Name");
    
    if (validateLastName.success == false) {
        isError = 1;
        errorMessage += validateLastName.message;
    }

     reqUserData.lastName = validateLastName.data;

     // phone number valid

    if (isEmpty(reqUserData.phoneNumber)) {

        isError = 1;
        errorMessage += "Mobile number should not empty.";
        

    }

     let validateMobileNumber = await commonObject.isValidPhoneNumberOfUS(reqUserData.phoneNumber);

     if (validateMobileNumber == false) {

        isError = 1;
        errorMessage += "Mobile number is not valid.";
        
    }

    

    // email validation
    if (isEmpty(reqUserData.email)) {

        isError = 1;
        errorMessage += "Email should not empty.";
    }

    let validateEmail = await commonObject.isValidEmail(reqUserData.email);

     if (validateEmail == false) {

        isError = 1;
        errorMessage += "Email is not valid.";

    }

    // address check
    let validateAddress = await commonObject.characterLimitCheck(reqUserData.address, "Address");
        
    if (validateAddress.success == false) {
        isError = 1;
        errorMessage += validateAddress.message;
    }

    reqUserData.address = validateAddress.data;


    // user name check
    let validateUserName = await commonObject.characterLimitCheck(reqUserData.userName, "User Name");
        
    if (validateUserName.success == false) {
        isError = 1;
        errorMessage += validateUserName.message;
    }

    reqUserData.userName = validateUserName.data;

    // password check
    let validatePassword = await commonObject.characterLimitCheck(reqUserData.password, "Password");

    if (validatePassword.success == false) {
        isError = 1;
        errorMessage += validatePassword.message;
    }

    reqUserData.password = validatePassword.data;

    if(reqUserData.password !== reqUserData.confirmPassword){
        isError = 1;
        errorMessage += "Password and Confirm password should be same.";
    }

    // image check
    // let validateImage = await commonObject.imageFileValidate(reqUserData.profileImage);

    // return res.status(400).send({
    //     "success": false,
    //     "status": 400,
    //     "message": validateImage
    // });

   
    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }
    
    
    
    req.registrationData = reqUserData;
    
     next();

});

module.exports = router;
