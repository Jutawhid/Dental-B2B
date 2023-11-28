
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
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const serviceModel = require("../models/service");
const serviceAccessRolesModel = require("../models/serviceAccessRoles");
const userProvideServiceModel = require('../models/userProvideService');

const { routeAccessChecker } = require('../middlewares/routeAccess');


router.get('/list', [verifyToken, routeAccessChecker("caseTypeList")], async (req, res) => {

    let result = await caseTypeModel.getCaseTypeList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Case Type List",
        "count" : result.length,
        "data": result
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