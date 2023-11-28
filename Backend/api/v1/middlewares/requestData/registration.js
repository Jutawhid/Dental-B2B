var express = require('express');
var router = express.Router();
const isEmpty = require("is-empty");
const commonObject = require('../../common/common');
const roleModel = require('../../models/role');
const zipModel = require('../../models/zip');

router.use(async function (req, res, next) {

    let reqUserData = {
        "name": req.body.name,
        "firstName": req.body.first_name,
        "lastName": req.body.last_name,
        "userType": req.body.user_type,
        "phoneNumber": req.body.phone_number,
        "email": req.body.email,
        "fax": req.body.fax,
        "npi": req.body.npi,
        "licenseNumber": req.body.license_number,
        "address": req.body.address,
        "stateId": req.body.state_id,
        "cityId": req.body.city_id,
        "zipId": req.body.zip_id,
        "userName": req.body.user_name,
        "password": req.body.password,
        "confirmPassword": req.body.confirm_password
    }

    //req.registrationData = reqUserData;

    let errorMessage = "";
    let isError = 0;


    if (reqUserData.userType != req.body.decoded.userType) {
        isError = 1;
        errorMessage += " Request user-type & token user-type are not same.";

    } else if (isEmpty(reqUserData.userType)) {
        isError = 1;
        errorMessage += " Please provide user type.";
    }


    let validateUserType = await commonObject.checkItsNumber(reqUserData.userType);

    if (validateUserType.success == false) {
        isError = 1;
        errorMessage += " Value should be integer.";
    } else {
        req.body.user_type = validateUserType.data;
        reqUserData.userType = validateUserType.data;
    }



    let roleTypeData = await roleModel.getRoleByIdentityId(reqUserData.userType);
    if (isEmpty(roleTypeData)) {
        isError = 1;
        errorMessage += " No Role found.";
    }



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


    //Fax number valid
    if (isEmpty(reqUserData.fax)) {
        isError = 1;
        errorMessage += "Fax should not empty.";
    }


    // let validateFax = await commonObject.isValidFaxOfUS(reqUserData.fax);
    // if (validateFax == false) {
    //     isError = 1;
    //     errorMessage += "Fax number is not valid.";
    // }


    // email validation
    if (isEmpty(reqUserData.email)) {
        isError = 1;
        errorMessage += "Email should not empty.";
    }

    if (reqUserData.email !== req.body.decoded.email) {
        isError = 1;
        errorMessage += " Request email & token email are not same.";
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


    if (isEmpty(reqUserData.stateId)) {
        isError = 1;
        errorMessage += "State should not empty.";

    } else if (isEmpty(reqUserData.cityId)) {
        isError = 1;
        errorMessage += " City should not empty.";

    } else if (isEmpty(reqUserData.zipId)) {
        isError = 1;
        errorMessage += " Zip  should not empty.";

    } else {

        let validateZipId = await commonObject.checkItsNumber(reqUserData.zipId);

        if (validateZipId.success == false) {
            isError = 1;
            errorMessage += " Value should be integer.";

        } else {

            req.body.zip_id = validateZipId.data;
            reqUserData.zipId = validateZipId.data;

            let resultZip = await zipModel.getZipById(reqUserData.zipId);

            if (isEmpty(resultZip)) {
                isError = 1;
                errorMessage += "Zip code is not valid.";

            } else {

                if (resultZip[0].city_id != reqUserData.cityId) {
                    isError = 1;
                    errorMessage += "Zip code with city code has no relation.";

                } else if (resultZip[0].state_id != reqUserData.stateId) {
                    isError = 1;
                    errorMessage += "Zip code with state code has no relation.";
                }
            }
        }
    }


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

    if (reqUserData.password !== reqUserData.confirmPassword) {
        isError = 1;
        errorMessage += "Password and Confirm password should be same.";
    }

    



    // check dentist
    if (reqUserData.userType === 3 || reqUserData.userType === 4) {


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




        // NPI valid
        if (isEmpty(reqUserData.npi)) {
            isError = 1;
            errorMessage += "NPI should not empty."
        }


        let validateNPI = await commonObject.isValidNPI(reqUserData.npi);

        if (validateNPI == false) {
            isError = 1;
            errorMessage += "NPI number is not valid.";
        }

        // license number valid
        if (isEmpty(reqUserData.licenseNumber)) {
            isError = 1;
            errorMessage += "License number should not empty.";
        }



    } else if (reqUserData.userType === 5 || reqUserData.userType === 6) {

        //  name valid
        let validateName = await commonObject.characterLimitCheck(reqUserData.name, "Name");

        if (validateName.success == false) {
            isError = 1;
            errorMessage += validateName.message;
        }

        reqUserData.name = validateName.data;
    }


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
