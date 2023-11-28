var express = require('express');
var router = express.Router();
const isEmpty = require("is-empty");
const commonObject = require('../../common/common');
const roleModel = require('../../models/role');
const zipModel = require('../../models/zip');

router.use(async function (req, res, next) {

    let reqUserData = {
        "id" : req.decoded.profileInfo.id,
        "name": req.body.name,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "phone": req.body.phone,
        "fax": req.body.fax,
        "license": req.body.license,
        "address": req.body.address,
        "state_id": req.body.state_id,
        "city_id": req.body.city_id,
        "zip_id": req.body.zip_id,
        "description": req.body.description,
    }

    let errorMessage = "";
    let isError = 0;


    // id validation
    let validateId = await commonObject.checkItsNumber(reqUserData.id);

    if (validateId.success == false) {

        isError = 1;
        errorMessage += "Value should be integer."
        
    } else {
        reqUserData.id = validateId.data;
    }

    // phone number valid
    if (isEmpty(reqUserData.phone)) {
        isError = 1;
        errorMessage += "Mobile number should not empty.";
    }


    let validateMobileNumber = await commonObject.isValidPhoneNumberOfUS(reqUserData.phone);

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

    


    // address check
    let validateAddress = await commonObject.characterLimitCheck(reqUserData.address, "Address");
    if (validateAddress.success == false) {
        isError = 1;
        errorMessage += validateAddress.message;
    }

    reqUserData.address = validateAddress.data;


    if (isEmpty(reqUserData.state_id)) {
        isError = 1;
        errorMessage += "State should not empty.";

    } else if (isEmpty(reqUserData.city_id)) {
        isError = 1;
        errorMessage += " City should not empty.";

    } else if (isEmpty(reqUserData.zip_id)) {
        isError = 1;
        errorMessage += " Zip  should not empty.";

    } else {

        let validateZipId = await commonObject.checkItsNumber(reqUserData.zip_id);
        if (validateZipId.success == false) {
            isError = 1;
            errorMessage += " Value should be integer.";

        } else {

            req.body.zip_id = validateZipId.data;
            reqUserData.zip_id = validateZipId.data;

            let resultZip = await zipModel.getZipById(reqUserData.zip_id);

            if (isEmpty(resultZip)) {
                isError = 1;
                errorMessage += "Zip code is not valid.";

            } else {

                if (resultZip[0].city_id != reqUserData.city_id) {
                    isError = 1;
                    errorMessage += "Zip code with city code has no relation.";

                } else if (resultZip[0].state_id != reqUserData.state_id) {
                    isError = 1;
                    errorMessage += "Zip code with state code has no relation.";
                }
            }
        }
    }



    // check dentist
    if (req.decoded.userInfo.role_id === 3 || req.decoded.userInfo.role_id === 4) {


        // First name valid
        let validateFirstName = await commonObject.characterLimitCheck(reqUserData.first_name, "First Name");

        if (validateFirstName.success == false) {
            isError = 1;
            errorMessage += validateFirstName.message;
        }

        reqUserData.first_name = validateFirstName.data;



        //last name valid
        let validateLastName = await commonObject.characterLimitCheck(reqUserData.last_name, "Last Name");

        if (validateLastName.success == false) {
            isError = 1;
            errorMessage += validateLastName.message;
        }

        reqUserData.last_name = validateLastName.data;


        // license number valid
        if (isEmpty(reqUserData.license)) {
            isError = 1;
            errorMessage += "License number should not empty.";
        }

    } else if (req.decoded.userInfo.role_id === 5 || req.decoded.userInfo.role_id === 6) {

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


    req.data = reqUserData;

    next();

});

module.exports = router;
