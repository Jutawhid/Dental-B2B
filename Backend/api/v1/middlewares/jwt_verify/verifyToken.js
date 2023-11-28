var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");

const commonObject = require('../../common/common');
const userModel = require('../../models/user');
const superAdminModel = require('../../models/superAdmin');
const adminModel = require('../../models/admin');
const dentistModel = require('../../models/dentist');
const consultantModel = require('../../models/consultant');
const labModel = require('../../models/lab');
const techCompanyModel = require('../../models/techCompany');
const roleModel = require('../../models/role');
const routePermissionModel = require('../../permissions/route_permission');

router.use(async function (req, res, next) {
    const token = req.headers['x-access-token'];

   

    if (token) {
        jwt.verify(token, global.config.secretKey,
            {
                algorithm: global.config.algorithm

            }, async function (err, decoded) {
                if (err) {
                    // let errorData = {
                    //     message: err.message,
                    //     expiredAt: err.expiredAt
                    // };

                    return res.status(400)
                        .send({
                            "success": false,
                            "status": 400,
                            "message": "Timeout Login Fast"
                        });
                }

                try {

                    //api_token then decode user id,  convert to number
                    let userData = await userModel.getUserById(parseInt(await commonObject.decodingUsingCrypto(decoded.api_token)));
                    let profileInfo = {};

                    if (isEmpty(userData) || !decoded.hasOwnProperty('identity_id')) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }


                    //  device verification 
                    let deviceVerify = await commonObject.compareDeviceInfo(req, decoded.identity_id);
                    if (deviceVerify === false) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. Login Fast"
                            });
                    }



                    //Check Role 
                    let roleData = await roleModel.getRoleByIdentityId(userData[0].role_id);
                    if (isEmpty(roleData) || userData[0].role_id != decoded.role.role_id) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }

                    if (userData[0].role_id == 1) {
                        profileInfo = await superAdminModel.getSuperAdminById(userData[0].profile_id);

                    } else if (userData[0].role_id == 2) {
                        profileInfo = await adminModel.getAdminById(userData[0].profile_id,);

                    } else if (userData[0].role_id == 3) {
                        profileInfo = await dentistModel.getDentistById(userData[0].profile_id);

                    } else if (userData[0].role_id == 4) {
                        profileInfo = await consultantModel.getConsultantById(userData[0].profile_id);

                    } else if (userData[0].role_id == 5) {
                        profileInfo = await labModel.getLabById(userData[0].profile_id);

                    } else if (userData[0].role_id == 6) {
                        profileInfo = await techCompanyModel.getTechCompanyById(userData[0].profile_id);

                    } else {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }

  
                    if (isEmpty(profileInfo)) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }

                    decoded = {
                        userInfo: {
                            id: userData[0].id,
                            user_name: userData[0].user_name,
                            status: userData[0].status,
                            role_id: userData[0].role_id,
                        },
                        profileInfo: { ...profileInfo[0] },
                        role: { ...roleData[0] },
                        permissions: await routePermissionModel.getRouterPermissionList(userData[0].role_id),
                        uuid: decoded.identity_id

                    };

                    // console.log(decoded);


                    req.decoded = decoded;

                    next();

                } catch (error) {

                }
            });
    } else {

        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Unauthorize Request"
            });
    }
});

module.exports = router;