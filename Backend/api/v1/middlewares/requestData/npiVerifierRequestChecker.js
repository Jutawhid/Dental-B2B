var express = require('express');
var router = express.Router();
const isEmpty = require("is-empty");
const commonObject = require('../../common/common');
const roleModel = require('../../models/role');

router.use(async function (req, res, next) {

    let reqData = {
        "npi": req.body.npi,
        "userType": req.body.user_type
    }

    let errorMessage = "";
    let isError = 0;

    // role check
    if (isEmpty(reqData.userType)) {
        isError = 1;
        errorMessage += "Please provide user type.";

    } else {

        let validateUserType = await commonObject.checkItsNumber(reqData.userType);

        if (validateUserType.success === false) {
            isError = 1;
            errorMessage += "Value should be integer. ";

        } else {

            req.body.user_type = validateUserType.data;
            reqData.userType = validateUserType.data;

            if ([3, 4].indexOf(reqData.userType) == -1) {
                isError = 1;
                errorMessage += "Unknown user type (User type must be 3 / 4). ";
            }
        }
    }



    // NPI valid check
    if (isEmpty(reqData.npi)) {
        isError = 1;
        errorMessage += "NPI should not empty.";

    } else {

        let validateNPI = await commonObject.isValidNPI(reqData.npi);

        if (validateNPI === false) {
            isError = 1;
            errorMessage += "NPI number is not valid.";
        }
    }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    next();

});

module.exports = router;
