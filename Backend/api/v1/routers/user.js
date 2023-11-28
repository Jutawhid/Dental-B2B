const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fileUpload = require("express-fileupload");

const zipModel = require("../models/zip");
const userModel = require("../models/user");
const forgetPasswordModel = require("../models/forgetPassword");
const otpModel = require("../models/otp");
const superAdminModel = require("../models/superAdmin");
const adminModel = require("../models/admin");
const dentistModel = require("../models/dentist");
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");
const roleModel = require("../models/role");
const userProvideServiceModel = require('../models/userProvideService');
const trainingModel = require('../models/training');
const trainingDocumentModel = require('../models/trainingDocument');
const userBalanceRecordModel = require('../models/userBalanceRecord');
const easifiAccountBalanceModel = require('../models/easifiAccountBalance');
const favoriteModel = require('../models/favorite');
const caseModel = require('../models/case');
const caseMemberModel = require('../models/caseMember');
const customerPayableAmountModel = require('../models/customerPayableAmount');
const serviceModel = require("../models/service");
const notificationModel = require("../models/notification");
const registrationValidation = require("../middlewares/requestData/registration");
const profileUpdateValidation = require("../middlewares/requestData/updateUserProfile");
const adminRegistrationValidation = require("../middlewares/requestData/adminRegistrationValidation");
const userNameChecker = require("../middlewares/requestData/userNameCheck");
const npiVerifierRequestChecker = require("../middlewares/requestData/npiVerifierRequestChecker");
const passwordChangeChecker = require("../middlewares/requestData/passwordChangeChecker");
const verifyToken = require("../middlewares/jwt_verify/verifyToken");
const verifyRegistrationRequestToken = require("../middlewares/jwt_verify/verifyRegistrationRequestToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");

const loginTrackModel = require("../models/loginTrack");
const commonObject = require("../common/common");
const emailCommonObject = require("../common/email");
const fileUploaderCommonObject = require("../common/fileUploader");
const npiCheckForThirdPartyApiObject = require("../common/npiCheckForThirdPartyApi");

const crypto = require("crypto");
const moment = require("moment");

require("dotenv").config();

router.get("/check-user-name", userNameChecker, async (req, res) => {
    // Get User data from user table.
    let userDataList = await userModel.getUserByUserName(req.body.user_name);

    if (isEmpty(userDataList)) {
        return res.status(200).send({
            status: 200,
            success: true,
            message: "You can use this user name.",
            data: {
                "user-name": req.body.user_name,
            },
        });
    } else {
        return res.status(200).send({
            status: 200,
            success: false,
            message: "User name already use",
            data: {
                "user-name": req.body.user_name,
            },
        });
    }
});

router.post(
    "/password-change",
    [verifyToken, passwordChangeChecker],
    async (req, res) => {
        // Get User data from user table.
        let old_password = req.body.old_password;
        let new_password = req.body.new_password;

        let userData = await userModel.getUserById(req.decoded.userInfo.id);

        if (isEmpty(userData)) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Unauthorize Request. User not found, please login again.",
            });
        }

        if (bcrypt.compareSync(old_password, userData[0].password)) {
            new_password = bcrypt.hashSync(new_password, 10); // hashing Password
            let result = await userModel.updateUserPasswordByUserId(
                req.decoded.userInfo.id,
                new_password
            );

            if (!isEmpty(result) && result.affectedRows == 0) {
                return res.status(500).send({
                    success: false,
                    status: 500,
                    message: "Password change fail! Try again",
                });
            } else {

                // send email

                let receiverMail = userData[0].email;

                // let emailBody = `
                //     <p>Your Easifi Password has been updated</p>
                //     `;

                let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
                    receiverMail,
                    "Easifi User Password Change",
                    "Your Easifi Password has been updated",
                    "Go to easifi",
                    `${process.env.frontend_url}`
                );

                return res.status(200).send({
                    status: 200,
                    success: true,
                    message: "Password change successfully done",
                });
            }
        } else {
            return res.status(401).send({
                success: false,
                status: 402,
                message: "Old password not match.",
            });
        }
    }
);

router.get("/logging-device-info", verifyToken, async (req, res) => {

    let nowDateTimeGMT = await commonObject.getGMT();
    let nowDateTimeMin1DayGMT = await commonObject.getCustomDateTime(nowDateTimeGMT, -1);
    ;

    let result = await loginTrackModel.getLoggingTrackerByUserId(
        req.decoded.userInfo.id, nowDateTimeMin1DayGMT
    );

    for (let index = 0; index < result.length; index++) {
        result[index].user_device_info = JSON.parse(result[index].user_device_info);

        if (result[index].uuid === req.decoded.uuid) {
            result[index].isCurrentLogging = true;
        } else {
            result[index].isCurrentLogging = false;
        }
    }

    return res.status(200).send({
        success: true,
        status: 200,
        data: result,
    });
});

router.post("/logout-from-login-device", verifyToken, async (req, res) => {
    let id = req.body.id;

    let validateId = await commonObject.checkItsNumber(id);

    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Give a valid id.",
        });
    } else {
        req.body.id = validateId.data;
        id = validateId.data;

        let result = await loginTrackModel.getLoggingTrackerByUserIdANDId(
            req.decoded.userInfo.id,
            id
        );

        if (isEmpty(result)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }

        let deleteResult = await loginTrackModel.deleteLoggingTrackerDataByUUID(
            result[0].uuid
        );

        if (
            deleteResult.affectedRows == undefined ||
            deleteResult.affectedRows < 1
        ) {
            return res.status(500).send({
                success: true,
                status: 500,
                message: "Something Wrong in system. Please try again.",
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Device access remove.",
        });
    }
});

//****** User Registration New Code */

router.post("/registrationRequest", async (req, res) => {
    let reqUserData = {
        userType: req.body.user_type,
        email: req.body.email,
    };

    // role check
    if (isEmpty(reqUserData.userType)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Please provide user type.",
        });
    }

    let validateUserType = await commonObject.checkItsNumber(
        reqUserData.userType
    );

    if (validateUserType.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "User Type Value should be integer.",
        });
    } else {
        req.body.user_type = validateUserType.data;
        reqUserData.userType = validateUserType.data;
    }

    let roleTypeData = await roleModel.getRoleByIdentityId(reqUserData.userType);

    if (isEmpty(roleTypeData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No Role found",
        });
    }

    if (roleTypeData[0].identity_id === 1 || roleTypeData[0].identity_id === 2) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "User should be Dentist/ Consultant/ Lab/ Tech Company",
        });
    }

    // email validation
    if (isEmpty(reqUserData.email)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Email should not empty.",
        });
    }

    let validateEmail = await commonObject.isValidEmail(reqUserData.email);

    if (validateEmail == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Email is not valid.",
        });
    }

    // Email already in use check
    let existingUserByEmail = await userModel.getUserByEmail(reqUserData.email);

    if (!isEmpty(existingUserByEmail)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Email already in Use.",
        });
    }

    let payloadData = {};
    payloadData.email = reqUserData.email;
    payloadData.userType = reqUserData.userType;
    payloadData.timePeriod = await commonObject.addTwentyFourHourToGMT();

    //  "Generate Token"
    let token = jwt.sign(payloadData, global.config.secretKey, {
        algorithm: global.config.algorithm,
        expiresIn: global.config.expiresIn, // one day
    });

    // send email

    let receiverMail = reqUserData.email;

    // let emailBody = `
    //     <p>We have received your request</p>
    //     <h5>click in this <a href="${process.env.frontend_url}/account-verify/${token}">link</a> to confirm your email</h5>
    //     `;

    let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
        receiverMail,
        "We have received your registration request",
        `We have received your registration request`,
        "Go to easifi",
        `${process.env.frontend_url}/account-verify/${token}`
    );

    return res.status(201).send({
        success: true,
        status: 201,
        message: "An email has been sent to your email.",
    });
});

// verify Registration Request Token

router.post(
    "/verifyRegistrationToken",
    verifyRegistrationRequestToken,
    async (req, res) => {
        let email = req.body.decoded.email;
        let userType = req.body.decoded.userType;
        let token = req.body.token;

        //console.log(typeof req.body.decoded.userType);

        // Email already in use check
        let existingUserByEmail = await userModel.getUserByEmail(email);

        if (!isEmpty(existingUserByEmail)) {
            return res.status(401).send({
                success: false,
                status: 401,
                message: "Link expired as email already in Use.",
            });
        }

        let data = { email, role_id: userType, token };

        return res.status(200).send({
            success: true,
            status: 200,
            data: data,
        });
    }
);

// NPI verification

router.post("/npiVerification", npiVerifierRequestChecker, async (req, res) => {
    let npi = req.body.npi;
    let userType = req.body.userType;

    if (userType === 3) {
        let existingUserByNpi = await dentistModel.getDentistByNpi(npi);

        if (!isEmpty(existingUserByNpi)) {
            return res.status(400).send({
                success: false,
                status: 422,
                message: "NPI already in use.",
            });
        }
    } else if (userType === 4) {
        let existingUserByNpi = await consultantModel.getConsultantByNpi(npi);

        if (!isEmpty(existingUserByNpi)) {
            return res.status(400).send({
                success: false,
                status: 422,
                message: "NPI already in use.",
            });
        }
    }

    let validateNPI = await npiCheckForThirdPartyApiObject.npiCheck(npi);

    if (validateNPI == false) {
        return res.status(400).send({
            success: false,
            status: 404,
            message: "NPI number is not valid.",
        });
    } else {
        return res.status(200).send({
            success: true,
            status: 200,
            data: validateNPI.data,
        });
    }
});

///***** */

//******
router.post(
    "/registration",
    [verifyRegistrationRequestToken, registrationValidation],
    async (req, res) => {
        let reqData = req.registrationData;
        let errorMessage = "";
        let isError = 0;

        let userInfo = {};
        let profileInfo = {};

        let dateTimeNowGMT = await commonObject.getGMT();

        // Email already in use check
        let existingUserByEmail = await userModel.getUserByEmail(reqData.email);

        if (!isEmpty(existingUserByEmail)) {
            // direct redirect from here

            return res.status(401).send({
                success: false,
                status: 401,
                message: "Link expired as email already in Use.",
            });
        }

        // Mobile number already in use check
        let existingUserByPhone = await userModel.getUserByPhone(
            reqData.phoneNumber
        );

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

        // data formatting
        userInfo = {
            // according to the DB Column name
            phone: reqData.phoneNumber,
            email: reqData.email,
            user_name: reqData.userName,
            role_id: reqData.userType,
            password: reqData.password,
            status: 1,
        };


        // for dentist and consultant registration
        if (reqData.userType === 3 || reqData.userType === 4) {
            // npi and license duplicate check
            if (reqData.userType === 3) {
                let existingUserByNpi = await dentistModel.getDentistByNpi(reqData.npi);

                if (!isEmpty(existingUserByNpi)) {
                    isError = 1;
                    errorMessage += " NPI already in Use.";
                }

                let existingUserByLicense = await dentistModel.getDentistByLicense(
                    reqData.licenseNumber
                );

                if (!isEmpty(existingUserByLicense)) {
                    isError = 1;
                    errorMessage += " License already in Use.";
                }
            } else if (reqData.userType === 4) {
                let existingUserByNpi = await consultantModel.getConsultantByNpi(
                    reqData.npi
                );

                if (!isEmpty(existingUserByNpi)) {
                    isError = 1;
                    errorMessage += " NPI already in Use.";
                }

                let existingUserByLicense =
                    await consultantModel.getConsultantByLicense(reqData.licenseNumber);

                if (!isEmpty(existingUserByLicense)) {
                    isError = 1;
                    errorMessage += " License already in Use.";
                }
            }

            // NPI verification check
            let validateNPI = await npiCheckForThirdPartyApiObject.npiCheck(
                reqData.npi
            );

            if (validateNPI == false) {
                isError = 1;
                errorMessage += " NPI number is not valid.";
            }

            profileInfo = {
                // according to the DB Column name
                first_name: reqData.firstName,
                last_name: reqData.lastName,
                phone: reqData.phoneNumber,
                email: reqData.email,
                fax: reqData.fax,
                npi_number: reqData.npi,
                license: reqData.licenseNumber,
                address: reqData.address,
                user_name: reqData.userName,
                zip_id: reqData.zipId,
                status: 1,
            };
        } else if (reqData.userType === 5 || reqData.userType === 6) {
            profileInfo = {
                // according to the DB Column name
                name: reqData.name,
                phone: reqData.phoneNumber,
                email: reqData.email,
                fax: reqData.fax,
                address: reqData.address,
                user_name: reqData.userName,
                zip_id: reqData.zipId,
                status: 1,
            };
        }

        if (isError == 1) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: errorMessage,
            });
        }

        let result = await userModel.addNewUser(userInfo, profileInfo);

        if (result.affectedRows == undefined || result.affectedRows < 1) {
            return res.status(500).send({
                success: true,
                status: 500,
                result: result,
                message: "Something Wrong in system database.",
            });
        }


        // notification
        let notificationOne = {
            "sender_id": 0,
            "receiver_id": 0,
            "is_receive_all": 1,
            "receiver_type": 1, // super Admin
            "title": "A new user has been added",
            "url": `${process.env.frontend_url}/user/userDetails/${result.insertId}`,
            "created_by": result.insertId,
            "updated_by": result.insertId,
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
            "sender_id": 0,
            "receiver_id": 0,
            "is_receive_all": 1,
            "receiver_type": 2, // Admin
            "title": "A new user has been added",
            "url": `${process.env.frontend_url}/user/userDetails/${result.insertId}`,
            "created_by": result.insertId,
            "updated_by": result.insertId,
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
            success: true,
            status: 201,
            message: "User Registered Successfully.",
        });
    }
);

router.get("/me", verifyToken, async (req, res) => {

    let profileInfo = {};
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

    if (req.decoded.role.id == 1) {
        profileInfo = await superAdminModel.getSuperAdminById(
            req.decoded.profileInfo.id
        );
    } else if (req.decoded.role.id == 2) {
        profileInfo = await adminModel.getAdminById(req.decoded.profileInfo.id);
        imageFolderPath = `${process.env.backend_url}${process.env.admin_image_path_name}`;
    } else if (req.decoded.role.id == 3) {
        profileInfo = await dentistModel.getDentistById(req.decoded.profileInfo.id);
    } else if (req.decoded.role.id == 4) {
        profileInfo = await consultantModel.getConsultantById(
            req.decoded.profileInfo.id
        );
    } else if (req.decoded.role.id == 5) {
        profileInfo = await labModel.getLabById(req.decoded.profileInfo.id);
    } else if (req.decoded.role.id == 6) {
        profileInfo = await techCompanyModel.getTechCompanyById(
            req.decoded.profileInfo.id
        );
    } else {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Unauthorize Request. User not found, please login again.",
        });
    }

    if (isEmpty(profileInfo)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown user.",
        });
    } else {
        let zipInfo = {
            zip_id: 0,
            zip_code: 0,
            city_id: 0,
            city_name: "",
            state_id: 0,
            state_name: 0,
        };

        if (req.decoded.role.id >= 3 || req.decoded.role.id <= 6) {
            zipInfoDetails = await zipModel.getZipDetailsById(profileInfo[0].zip_id);

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

            profileInfo[0] = { ...profileInfo[0], ...zipInfo };
        }

        profileInfo[0].role = {
            role_id: req.decoded.role.identity_id,
            role_name: req.decoded.role.title,
        };

        profileInfo[0].imageFolderPath = imageFolderPath;
        profileInfo[0].user_name = req.decoded.userInfo.user_name;
        profileInfo[0].user_id = req.decoded.userInfo.id;

        return res.status(200).send({
            success: true,
            status: 200,
            data: profileInfo[0],
        });
    }
});

/// Reset Password
router.post("/forgetPasswordRequest", async (req, res) => {
    let reqData = {
        email: req.body.email,
    };

    let errorMessage = "";
    let isError = 0;

    // Check Email
    if (reqData.email === undefined || isEmpty(reqData.email)) {
        isError = 1;
        errorMessage += "Email should not empty.";
    } else {
        let validateEmail = await commonObject.isValidEmail(reqData.email);

        if (validateEmail == false) {
            isError = 1;
            errorMessage += "Email is not valid.";
        }
    }

    if (isError == 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: errorMessage,
        });
    }

    // Get User data from user table.
    let existingData = await userModel.getUserByEmail(reqData.email);

    if (isEmpty(existingData)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "No User Found",
        });
    }

    if (existingData[0].status !== 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "User is deactivated",
        });
    }

    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            //console.log(err);
        }
        const link = buffer.toString("hex");

        let requestData = {
            user_id: existingData[0].id,
            reset_token: link,
            created_at: await commonObject.getGMT(),
            expired_time: await commonObject.addFiveMinuteToGMT(),
        };

        let receiverMail = reqData.email;

        let requestForgetPassword = await forgetPasswordModel.insertForgetPassword(
            requestData
        );

        if (
            requestForgetPassword.affectedRows == undefined ||
            requestForgetPassword.affectedRows < 1
        ) {
            return res.status(500).send({
                success: true,
                status: 500,
                message: "Something Wrong in system database.",
            });
        }

        // let emailBody = `
        //     <p>We have received your request on forget password</p>
        //     <h5>click in this <a href="${process.env.frontend_url}/recover/${link}">link</a> to set new password</h5>
        //     `;

        let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
            receiverMail,
            "Forget Password",
            "We have received your request on forget password",
            "Go to easifi",
            `${process.env.frontend_url}`
        );

        return res.status(201).send({
            success: true,
            status: 201,
            message: "Check your email for reset password link.",
        });
    });
});

/// Verify Token
router.post("/verifyResetToken", async (req, res) => {
    let reqUserData = {
        resetToken: req.body.resetToken,
    };

    let existingData = await forgetPasswordModel.getUserByToken(
        reqUserData.resetToken
    );

    if (isEmpty(existingData)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "No User Found",
        });
    } else if (existingData[0].status !== 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Link Expired",
        });
    }

    if (
        moment(existingData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") <
        (await commonObject.getGMT())
    ) {
        let disableLink = await forgetPasswordModel.disableLinkById(
            existingData[0].id
        );

        if (disableLink.affectedRows == undefined || disableLink.affectedRows < 1) {
            return res.status(500).send({
                success: true,
                status: 500,
                message: "Something Wrong in system database.",
            });
        }

        return res.status(401).send({
            success: false,
            status: 401,
            message: "Link Expired",
        });
    }

    let userData = await userModel.getUserById(existingData[0].user_id);

    if (userData[0].hasOwnProperty("password")) delete userData[0].password;
    if (userData[0].hasOwnProperty("updated_by")) delete userData[0].updated_by;
    if (userData[0].hasOwnProperty("updated_at")) delete userData[0].updated_at;

    let existingProfileInfo = [];

    if (userData[0].role_id === 1) {
        existingProfileInfo = await superAdminModel.getSuperAdminById(
            userData[0].profile_id
        );

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    } else if (userData[0].role_id === 2) {
        existingProfileInfo = await adminModel.getAdminById(userData[0].profile_id);

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    } else if (userData[0].role_id === 3) {
        existingProfileInfo = await dentistModel.getDentistById(
            userData[0].profile_id
        );

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    } else if (userData[0].role_id === 4) {
        existingProfileInfo = await consultantModel.getConsultantById(
            userData[0].profile_id
        );

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    } else if (userData[0].role_id === 5) {
        existingProfileInfo = await labModel.getLabById(userData[0].profile_id);

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    } else if (userData[0].role_id === 6) {
        existingProfileInfo = await techCompanyModel.getTechCompanyById(
            userData[0].profile_id
        );

        if (isEmpty(existingProfileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }
    }

    if (
        userData[0].role_id === 1 ||
        userData[0].role_id === 2 ||
        userData[0].role_id === 3 ||
        userData[0].role_id === 4
    ) {
        userData[0].name =
            existingProfileInfo[0].first_name +
            " " +
            existingProfileInfo[0].last_name;
    } else if (userData[0].role_id === 5 || userData[0].role_id === 6) {
        userData[0].name = existingProfileInfo[0].name;
    }

    return res.status(200).send({
        status: 200,
        success: true,
        message: "User found",
        data: userData[0],
    });
});

router.post("/resetPasswordByToken", async (req, res) => {
    let reqUserData = {
        new_password: req.body.new_password,
        confirm_password: req.body.confirm_password,
        resetToken: req.body.resetToken,
    };

    let existingData = await forgetPasswordModel.getUserByToken(
        reqUserData.resetToken
    );

    if (isEmpty(existingData)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "No User Found",
        });
    } else if (existingData[0].status !== 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Link Expired",
        });
    }

    let userData = await userModel.getUserById(existingData[0].user_id);

    if (isEmpty(userData)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "No User Found",
        });
    }

    if (
        moment(existingData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") <
        (await commonObject.getGMT())
    ) {
        let disableLink = await forgetPasswordModel.disableLinkById(
            existingData[0].id
        );

        if (disableLink.affectedRows == undefined || disableLink.affectedRows < 1) {
            return res.status(500).send({
                success: true,
                status: 500,
                message: "Something Wrong in system database.",
            });
        }

        return res.status(401).send({
            success: false,
            status: 401,
            message: "Link Expired",
        });
    }

    let errorMessage = "";
    let isError = 0;

    // password check
    let validatePassword = await commonObject.characterLimitCheck(
        reqUserData.new_password,
        "Password"
    );

    if (validatePassword.success == false) {
        isError = 1;
        errorMessage += validatePassword.message;
    }

    reqUserData.new_password = validatePassword.data;

    if (reqUserData.new_password !== reqUserData.confirm_password) {
        isError = 1;
        errorMessage += "New Password and Confirm password should be same.";
    }

    if (isError == 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: errorMessage,
        });
    }

    reqUserData.new_password = bcrypt.hashSync(reqUserData.new_password, 10); // hashing Password

    let result = await userModel.updateUserPasswordUsingForgetPassword(
        userData[0].id,
        reqUserData.new_password,
        existingData[0].id
    );

    if (!isEmpty(result) && result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Password change fail! Try again",
        });
    } else {
        return res.status(200).send({
            status: 200,
            success: true,
            message: "Password change successfully done",
        });
    }
});

/// All Users List
router.get(
    "/allUserList",
    [verifyToken, routeAccessChecker("allUserList")],
    async (req, res) => {
        let limit = 10;
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

        let dentistList = await dentistModel.getAllDentistList(limit);
        let consultantList = await consultantModel.getAllConsultantList(limit);
        let labList = await labModel.getAllLabList(limit);
        let techList = await techCompanyModel.getAllTechList(limit);

        // total actual data
        let allDentist = await dentistModel.getAllDentistList(-1);
        let allConsultant = await consultantModel.getAllConsultantList(-1);
        let allLab = await labModel.getAllLabList(-1);
        let allTech = await techCompanyModel.getAllTechList(-1);


        for (let index = 0; index < dentistList.length; index++) {
            const element = dentistList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
        }

        let dentistResponse = {
            role_name: "Dentist",
            role_id: 3,
            total_count: dentistList.length,
            limit: limit,
            end_id:
                dentistList.length > 0 ? dentistList[dentistList.length - 1].id : 0,
            has_next: dentistList.length >= limit ? true : false,
            total_pages: Math.ceil(allDentist.length / limit),
            imageFolderPath: imageFolderPath,
            data: dentistList,
        };


        for (let index = 0; index < consultantList.length; index++) {
            const element = consultantList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
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


        for (let index = 0; index < labList.length; index++) {
            const element = labList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
        }

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


        for (let index = 0; index < techList.length; index++) {
            const element = techList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
        }

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
        response.push(dentistResponse);
        response.push(consultantResponse);
        response.push(labResponse);
        response.push(techResponse);

        return res.status(200).send({
            success: true,
            status: 200,
            message: "All User List",
            data: response,
        });
    }
);

// all user with next id
router.get(
    "/nextUserList/:role_id/:start_id",
    [verifyToken, routeAccessChecker("nextUserList")],
    async (req, res) => {
        let limit = 2;
        //let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
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

        if (
            roleTypeData[0].identity_id === 1 ||
            roleTypeData[0].identity_id === 2
        ) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User should be Dentist/ Consultant/ Lab/ Tech Company",
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

        if (roleTypeData[0].identity_id === 3) {
            let dentistList = await dentistModel.getNextDentistList(startId, limit);
            let allDentist = await dentistModel.getAllDentistList(-1);

            for (let index = 0; index < dentistList.length; index++) {
                const element = dentistList[index];
                let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
                element.total_case = totalCase.length;
            }

            let dentistResponse = {
                role_name: "Dentist",
                role_id: 3,
                total_count: dentistList.length,
                limit: limit,
                end_id:
                    dentistList.length > 0 ? dentistList[dentistList.length - 1].id : 0,
                //has_next: dentistList.length >= limit ? true : false,
                //total_pages: Math.ceil(allDentist.length / limit),
                //imageFolderPath: imageFolderPath,
                data: dentistList,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "User List",
                data: dentistResponse,
            });
        } else if (roleTypeData[0].identity_id === 4) {
            let consultantList = await consultantModel.getNextConsultantList(startId, limit);
            let allConsultant = await consultantModel.getAllConsultantList(-1);

            for (let index = 0; index < consultantList.length; index++) {
                const element = consultantList[index];
                let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
                element.total_case = totalCase.length;
                element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
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
                // has_next: consultantList.length >= limit ? true : false,
                // total_pages: Math.ceil(allConsultant.length / limit),
                // imageFolderPath: imageFolderPath,
                data: consultantList,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "User List",
                data: consultantResponse,
            });
        } else if (roleTypeData[0].identity_id === 5) {
            let labList = await labModel.getNextLabList(startId, limit);
            let allLab = await labModel.getAllLabList(-1);

            for (let index = 0; index < labList.length; index++) {
                const element = labList[index];
                let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
                element.total_case = totalCase.length;
                element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
            }

            let labResponse = {
                role_name: "Lab",
                role_id: 5,
                total_count: labList.length,
                limit: limit,
                end_id: labList.length > 0 ? labList[labList.length - 1].id : 0,
                // has_next: labList.length >= limit ? true : false,
                // total_pages: Math.ceil(allLab.length / limit),
                // imageFolderPath: imageFolderPath,
                data: labList,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "User List",
                data: labResponse,
            });
        } else if (roleTypeData[0].identity_id === 6) {
            let techList = await techCompanyModel.getNextTechList(startId, limit);

            let allTech = await techCompanyModel.getAllTechList(-1);

            for (let index = 0; index < techList.length; index++) {
                const element = techList[index];
                let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
                element.total_case = totalCase.length;
                element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
            }

            let techResponse = {
                role_name: "Tech",
                role_id: 6,
                total_count: techList.length,
                limit: limit,
                end_id: techList.length > 0 ? techList[techList.length - 1].id : 0,
                // has_next: techList.length >= limit ? true : false,
                // total_pages: Math.ceil(allTech.length / limit),
                // imageFolderPath: imageFolderPath,
                data: techList,
            };

            return res.status(200).send({
                success: true,
                status: 200,
                message: "User List",
                data: techResponse,
            });
        }
    }
);

router.get("/allUserListWithoutLimit", [verifyToken, routeAccessChecker("allUserListWithoutLimit")],
    async (req, res) => {

        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

        // all users data
        let dentistList = await dentistModel.getAllDentistList(-1);
        let consultantList = await consultantModel.getAllConsultantList(-1);
        let labList = await labModel.getAllLabList(-1);
        let techList = await techCompanyModel.getAllTechList(-1);


        for (let index = 0; index < dentistList.length; index++) {
            const element = dentistList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;

        }

        let dentistResponse = {
            role_name: "Dentist",
            role_id: 3,
            total_count: dentistList.length,
            imageFolderPath: imageFolderPath,
            data: dentistList,
        };


        for (let index = 0; index < consultantList.length; index++) {
            const element = consultantList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
        }

        let consultantResponse = {
            role_name: "Consultant",
            role_id: 4,
            total_count: consultantList.length,
            imageFolderPath: imageFolderPath,
            data: consultantList,
        };


        for (let index = 0; index < labList.length; index++) {
            const element = labList[index];
            //console.log(element)
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
        }

        let labResponse = {
            role_name: "Lab",
            role_id: 5,
            total_count: labList.length,
            imageFolderPath: imageFolderPath,
            data: labList,
        };


        for (let index = 0; index < techList.length; index++) {
            const element = techList[index];
            let totalCase = await caseMemberModel.getMyCaseList(element.user_id);
            element.total_case = totalCase.length;
            element.service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(element.user_id, element.role_id);
        }

        let techResponse = {
            role_name: "Tech",
            role_id: 6,
            total_count: techList.length,
            imageFolderPath: imageFolderPath,
            data: techList,
        };

        let response = [];
        response.push(dentistResponse);
        response.push(consultantResponse);
        response.push(labResponse);
        response.push(techResponse);

        return res.status(200).send({
            success: true,
            status: 200,
            message: "All User List",
            data: response,
        });
    }
);

///user details
router.get(
    "/userDetails/:user_id",
    [verifyToken, routeAccessChecker("userDetails")],
    async (req, res) => {
        let userId = req.params.user_id;
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

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

        let existingUserInfo = await userModel.getUserDetailsById(userId);

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

        if (
            existingUserInfo[0].role_id === 1 ||
            existingUserInfo[0].role_id === 2
        ) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User should be Dentist/ Consultant/ Lab/ Tech Company",
            });
        }

        let profileInfo = {};

        if (existingUserInfo[0].role_id === 3) {
            profileInfo = await dentistModel.getDentistDataById(
                existingUserInfo[0].profile_id
            );

            let totalCase = await caseMemberModel.getMyCaseList(userId);
            profileInfo[0].total_case = totalCase.length;

            // zip details
            let zipData = await zipModel.getZipDetailsById(profileInfo[0].zip_id);

            if (!isEmpty(zipData)) {
                profileInfo[0].zip_code = zipData[0].code;
                profileInfo[0].city_id = zipData[0].city_id;
                profileInfo[0].city_name = zipData[0].city_name;
                profileInfo[0].state_id = zipData[0].state_id;
                profileInfo[0].state_name = zipData[0].state_name;
            }

            profileInfo[0].user_id = existingUserInfo[0].id;
            profileInfo[0].role_id = existingUserInfo[0].role_id;
            profileInfo[0].image_folder_path = imageFolderPath;
            profileInfo[0].cover_image_folder_path = imageFolderPath;

            return res.status(200).send({
                success: true,
                status: 200,
                data: profileInfo[0],
            });
        } else if (existingUserInfo[0].role_id === 4) {
            profileInfo = await consultantModel.getConsultantDataById(
                existingUserInfo[0].profile_id
            );

            let totalCase = await caseMemberModel.getMyCaseList(userId);
            profileInfo[0].total_case = totalCase.length;

            // zip details
            let zipData = await zipModel.getZipDetailsById(profileInfo[0].zip_id);

            if (!isEmpty(zipData)) {
                profileInfo[0].zip_code = zipData[0].code;
                profileInfo[0].city_id = zipData[0].city_id;
                profileInfo[0].city_name = zipData[0].city_name;
                profileInfo[0].state_id = zipData[0].state_id;
                profileInfo[0].state_name = zipData[0].state_name;
            }



            profileInfo[0].user_id = existingUserInfo[0].id;
            profileInfo[0].role_id = existingUserInfo[0].role_id;
            profileInfo[0].image_folder_path = imageFolderPath;

            // user provide services
            profileInfo[0].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(profileInfo[0].user_id, profileInfo[0].role_id);

            return res.status(200).send({
                success: true,
                status: 200,
                data: profileInfo[0],
            });
        } else if (existingUserInfo[0].role_id === 5) {
            profileInfo = await labModel.getLabDataById(
                existingUserInfo[0].profile_id
            );

            let totalCase = await caseMemberModel.getMyCaseList(userId);
            profileInfo[0].total_case = totalCase.length;

            // zip details
            let zipData = await zipModel.getZipDetailsById(profileInfo[0].zip_id);

            if (!isEmpty(zipData)) {
                profileInfo[0].zip_code = zipData[0].code;
                profileInfo[0].city_id = zipData[0].city_id;
                profileInfo[0].city_name = zipData[0].city_name;
                profileInfo[0].state_id = zipData[0].state_id;
                profileInfo[0].state_name = zipData[0].state_name;
            }



            profileInfo[0].user_id = existingUserInfo[0].id;
            profileInfo[0].role_id = existingUserInfo[0].role_id;
            profileInfo[0].image_folder_path = imageFolderPath;
            profileInfo[0].cover_image_folder_path = imageFolderPath;

            // user provide services
            profileInfo[0].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(profileInfo[0].user_id, profileInfo[0].role_id);

            profileInfo[0].training = await trainingModel.getTrainingListByUserId(profileInfo[0].user_id);


            for (let i = 0; i < profileInfo[0].training.length; i++) {
                profileInfo[0].training[i].document = await trainingDocumentModel.getDocumentListByTrainingId(profileInfo[0].training[i].id);
            }

            return res.status(200).send({
                success: true,
                status: 200,
                data: profileInfo[0],
            });
        } else if (existingUserInfo[0].role_id === 6) {
            profileInfo = await techCompanyModel.getTechCompanyDataById(
                existingUserInfo[0].profile_id
            );

            let totalCase = await caseMemberModel.getMyCaseList(userId);
            profileInfo[0].total_case = totalCase.length;

            // zip details
            let zipData = await zipModel.getZipDetailsById(profileInfo[0].zip_id);

            if (!isEmpty(zipData)) {
                profileInfo[0].zip_code = zipData[0].code;
                profileInfo[0].city_id = zipData[0].city_id;
                profileInfo[0].city_name = zipData[0].city_name;
                profileInfo[0].state_id = zipData[0].state_id;
                profileInfo[0].state_name = zipData[0].state_name;
            }

            profileInfo[0].user_id = existingUserInfo[0].id;
            profileInfo[0].role_id = existingUserInfo[0].role_id;
            profileInfo[0].image_folder_path = imageFolderPath;
            profileInfo[0].cover_image_folder_path = imageFolderPath;

            // user provide services
            profileInfo[0].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(profileInfo[0].user_id, profileInfo[0].role_id);

            profileInfo[0].training = await trainingModel.getTrainingListByUserId(profileInfo[0].user_id);


            for (let i = 0; i < profileInfo[0].training.length; i++) {
                profileInfo[0].training[i].document = await trainingDocumentModel.getDocumentListByTrainingId(profileInfo[0].training[i].id);
            }

            return res.status(200).send({
                success: true,
                status: 200,
                data: profileInfo[0],
            });
        }

        if (isEmpty(profileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User not exist.",
            });
        }
    }
);

///user details ( only dentist / consultant / lab / tech company  can see)
router.get("/profileDetails/:user_id", [verifyToken, routeAccessChecker("profileDetailsForRegularUser")], async (req, res) => {

    let userId = req.params.user_id;
    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    let documentFolderPath = `${process.env.backend_url}${process.env.training_file_path_name}`;

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

    if (existingUserInfo[0].role_id == 1 || existingUserInfo[0].role_id == 2) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "User should be  Dentist / Consultant/ Lab/ Tech Company",
        });
    }

    let profileInfo = {};

    if (existingUserInfo[0].role_id === 3) {
        profileInfo = await dentistModel.getDentistDataById(existingUserInfo[0].profile_id);

        let totalCase = await caseMemberModel.getMyCaseList(userId);
        profileInfo[0].total_case = totalCase.length;

        profileInfo[0].user_id = existingUserInfo[0].id;
        profileInfo[0].role_id = existingUserInfo[0].role_id;
        profileInfo[0].image_folder_path = imageFolderPath;
        profileInfo[0].cover_image_folder_path = imageFolderPath;


    } else if (existingUserInfo[0].role_id === 4) {
        profileInfo = await consultantModel.getConsultantById(existingUserInfo[0].profile_id);

        let totalCase = await caseMemberModel.getMyCaseList(userId);
        profileInfo[0].total_case = totalCase.length;

        profileInfo[0].user_id = existingUserInfo[0].id;
        profileInfo[0].role_id = existingUserInfo[0].role_id;
        profileInfo[0].image_folder_path = imageFolderPath;
        profileInfo[0].cover_image_folder_path = imageFolderPath;


    } else if (existingUserInfo[0].role_id === 5) {
        profileInfo = await labModel.getLabById(existingUserInfo[0].profile_id);

        let totalCase = await caseMemberModel.getMyCaseList(userId);
        profileInfo[0].total_case = totalCase.length;

        profileInfo[0].user_id = existingUserInfo[0].id;
        profileInfo[0].role_id = existingUserInfo[0].role_id;
        profileInfo[0].image_folder_path = imageFolderPath;
        profileInfo[0].cover_image_folder_path = imageFolderPath;
        profileInfo[0].document_folder_path = documentFolderPath;


    } else if (existingUserInfo[0].role_id === 6) {
        profileInfo = await techCompanyModel.getTechCompanyById(existingUserInfo[0].profile_id);

        let totalCase = await caseMemberModel.getMyCaseList(userId);
        profileInfo[0].total_case = totalCase.length;

        profileInfo[0].user_id = existingUserInfo[0].id;
        profileInfo[0].role_id = existingUserInfo[0].role_id;
        profileInfo[0].image_folder_path = imageFolderPath;
        profileInfo[0].cover_image_folder_path = imageFolderPath;
        profileInfo[0].document_folder_path = documentFolderPath;


    }

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
    if (profileInfo[0].hasOwnProperty("fax"))
        delete profileInfo[0].fax;
    if (profileInfo[0].hasOwnProperty("address"))
        delete profileInfo[0].address;
    if (profileInfo[0].hasOwnProperty("zip_id"))
        delete profileInfo[0].zip_id;
    if (profileInfo[0].hasOwnProperty("license"))
        delete profileInfo[0].license;
    if (profileInfo[0].hasOwnProperty("npi_number"))
        delete profileInfo[0].npi_number;

    // check on favorite
    let isFavorite = false;

    let favoriteData = await favoriteModel.getExistInFavoriteList(req.decoded.userInfo.id, profileInfo[0].user_id, profileInfo[0].role_id);

    if (favoriteData.length > 0) {
        isFavorite = true;
        profileInfo[0].is_favorite = isFavorite;
    } else {
        profileInfo[0].is_favorite = isFavorite;
    }

    // user provide services
    if (profileInfo[0].role_id !== 3) {
        profileInfo[0].service = await userProvideServiceModel.getMyUsedServiceListByUserIdAndRoleId(profileInfo[0].user_id, profileInfo[0].role_id);
    }

    // user provide trainings
    if (profileInfo[0].role_id === 5 || profileInfo[0].role_id === 6) {


        profileInfo[0].training = await trainingModel.getTrainingListByUserId(profileInfo[0].user_id);


        for (let i = 0; i < profileInfo[0].training.length; i++) {
            profileInfo[0].training[i].document = await trainingDocumentModel.getDocumentListByTrainingId(profileInfo[0].training[i].id);
        }
    }

    return res.status(200).send({
        success: true,
        status: 200,
        data: profileInfo[0],
    });


}
);

// user enable disable
router.post(
    "/changeUserStatus",
    [verifyToken, routeAccessChecker("changeUserStatus")],
    async (req, res) => {
        let reqData = {
            id: req.body.id,
        };

        reqData.updated_by = req.decoded.userInfo.id;
        reqData.updated_at = await commonObject.getGMT();

        let validateId = await commonObject.checkItsNumber(reqData.id);

        if (validateId.success == false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Value should be integer.",
            });
        } else {
            req.body.id = validateId.data;
            reqData.id = validateId.data;
        }

        let existingUserInfo = await userModel.getUserDetailsById(reqData.id);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }

        if (
            existingUserInfo[0].role_id === 1 ||
            existingUserInfo[0].role_id === 2
        ) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User should be Dentist / Consultant / Lab / Tech Company.",
            });
        }

        let existingProfileInfo = [];

        // dentist change status
        if (existingUserInfo[0].role_id === 3) {
            existingProfileInfo = await dentistModel.getDentistDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 4) {
            existingProfileInfo = await consultantModel.getConsultantDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 5) {
            existingProfileInfo = await labModel.getLabDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 6) {
            existingProfileInfo = await techCompanyModel.getTechCompanyDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        }

        if (
            existingUserInfo[0].status === 1 &&
            existingProfileInfo[0].status === 1
        ) {
            let result = await userModel.disableUserById(
                reqData.updated_by,
                reqData.updated_at,
                existingUserInfo[0].id,
                existingProfileInfo[0].id,
                existingUserInfo[0].role_id
            );

            if (result.affectedRows == undefined || result.affectedRows == 0) {
                return res.status(500).send({
                    success: false,
                    status: 500,
                    message: "Something Wrong in system database.",
                });
            }

            // send mail
            let receiverMail = existingUserInfo[0].email;

            // let emailBody = `
            //     <p>You have been made disable in Easifi Platform. Please Contact with admin for any queries</p>
            //     `;

            let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
                receiverMail,
                "Easifi User Status Change",
                "You have been made disable in Easifi Platform. Please Contact with admin for any queries",
                "Go to easifi",
                `${process.env.frontend_url}`
            );
        } else if (
            existingUserInfo[0].status === 2 &&
            existingProfileInfo[0].status === 2
        ) {
            let result = await userModel.enableUserById(
                reqData.updated_by,
                reqData.updated_at,
                existingUserInfo[0].id,
                existingProfileInfo[0].id,
                existingUserInfo[0].role_id
            );

            if (result.affectedRows == undefined || result.affectedRows == 0) {
                return res.status(500).send({
                    success: false,
                    status: 500,
                    message: "Something Wrong in system database.",
                });
            }

            // send mail
            let receiverMail = existingUserInfo[0].email;

            let emailBody = `
                <p>You have been made enable in Easifi Platform. Please Contact with admin for any queries</p>
                `;

            let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
                receiverMail,
                "Easifi User Status Change",
                "You have been made enable in Easifi Platform. Please Contact with admin for any queries",
                "Go to easifi",
                `${process.env.frontend_url}`
            );
        } else {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User is already deleted.",
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "User Status Changed.",
        });
    }
);

// user delete
router.post(
    "/deleteOtherUser",
    [verifyToken, routeAccessChecker("deleteOtherUser")],
    async (req, res) => {
        let reqData = {
            id: req.body.id,
        };

        reqData.updated_by = req.decoded.userInfo.id;
        reqData.updated_at = await commonObject.getGMT();

        let validateId = await commonObject.checkItsNumber(reqData.id);

        if (validateId.success == false) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Value should be integer.",
            });
        } else {
            req.body.id = validateId.data;
            reqData.id = validateId.data;
        }

        let existingUserInfo = await userModel.getUserDetailsById(reqData.id);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        }

        if (
            existingUserInfo[0].role_id === 1 ||
            existingUserInfo[0].role_id === 2
        ) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User should be Dentist / Consultant / Lab / Tech Company.",
            });
        }

        let existingProfileInfo = [];

        // dentist change status
        if (existingUserInfo[0].role_id === 3) {
            existingProfileInfo = await dentistModel.getDentistDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 4) {
            existingProfileInfo = await consultantModel.getConsultantDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 5) {
            existingProfileInfo = await labModel.getLabDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 6) {
            existingProfileInfo = await techCompanyModel.getTechCompanyDataById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        }

        if (
            existingUserInfo[0].status !== 0 &&
            existingProfileInfo[0].status !== 0
        ) {
            let result = await userModel.deleteUserById(
                reqData.updated_by,
                reqData.updated_at,
                existingUserInfo[0].id,
                existingProfileInfo[0].id,
                existingUserInfo[0].role_id
            );

            if (result.affectedRows == undefined || result.affectedRows == 0) {
                return res.status(500).send({
                    success: false,
                    status: 500,
                    message: "Something Wrong in system database.",
                });
            }
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "User deleted successfully.",
        });
    }
);

/// profile update
router.put(
    "/profile/update",
    [
        verifyToken,
        routeAccessChecker("userProfileUpdate"),
        profileUpdateValidation,
    ],
    async (req, res) => {
        let updateRequestData = req.data;



        if (typeof updateRequestData.zip_id === "string") {
            updateRequestData.zip_id = parseInt(updateRequestData.zip_id);
        }

        if (typeof updateRequestData.city_id === "string") {
            updateRequestData.city_id = parseInt(updateRequestData.city_id);
        }

        if (typeof updateRequestData.state_id === "string") {
            updateRequestData.state_id = parseInt(updateRequestData.state_id);
        }

        // user data validate
        let existingUserInfo = await userModel.getUserById(req.decoded.userInfo.id);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        } else if (existingUserInfo[0].status !== 1) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User Deactivated.",
            });
        }

        // profile details
        let existingProfileInfo = [];
        let previousCoverImage = "";

        // dentist change status
        if (existingUserInfo[0].role_id === 3) {
            existingProfileInfo = await dentistModel.getDentistById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }
        } else if (existingUserInfo[0].role_id === 4) {
            existingProfileInfo = await consultantModel.getConsultantById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }

            previousCoverImage = existingProfileInfo[0].cover_image;
            //console.log("previousCoverImage", previousCoverImage);
        } else if (existingUserInfo[0].role_id === 5) {
            existingProfileInfo = await labModel.getLabById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }

            previousCoverImage = existingProfileInfo[0].cover_image;
        } else if (existingUserInfo[0].role_id === 6) {
            existingProfileInfo = await techCompanyModel.getTechCompanyById(
                existingUserInfo[0].profile_id
            );

            if (isEmpty(existingProfileInfo)) {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found.",
                });
            }

            previousCoverImage = existingProfileInfo[0].cover_image;
        }

        if (existingProfileInfo[0].status !== 1) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User Not Found.",
            });
        }

        let previousProfileImage = existingProfileInfo[0].profile_image;


        let updateData = {};
        let updateUserData = {};

        let errorMessage = "";
        let isError = 0; // 1 = yes, 0 = no
        let willWeUpdate = 0; // 1 = yes , 0 = no;

        if (
            existingUserInfo[0].role_id === 3 ||
            existingUserInfo[0].role_id === 4
        ) {
            // dentist or consultant
            //first name
            if (existingProfileInfo[0].first_name !== updateRequestData.first_name) {
                willWeUpdate = 1;
                updateData.first_name = updateRequestData.first_name;
            }

            //last name
            if (existingProfileInfo[0].last_name !== updateRequestData.last_name) {
                willWeUpdate = 1;
                updateData.last_name = updateRequestData.last_name;
            }

            // license number
            if (existingProfileInfo[0].license !== updateRequestData.license) {
                willWeUpdate = 1;
                updateData.license = updateRequestData.license;
            }
        } else if (
            existingUserInfo[0].role_id === 5 ||
            existingUserInfo[0].role_id === 6
        ) {
            // lab or tech company
            //name
            if (existingProfileInfo[0].name !== updateRequestData.name) {
                willWeUpdate = 1;
                updateData.name = updateRequestData.name;
            }
        }

        //phone
        if (existingProfileInfo[0].phone != updateRequestData.phone) {
            // phone number valid

            let existingUserByPhone = await userModel.getUserByPhone(
                updateRequestData.phone
            );

            if (!isEmpty(existingUserByPhone)) {
                isError = 1;
                errorMessage += " Phone number already in Use.";
            } else {
                willWeUpdate = 1;
                updateData.phone = updateRequestData.phone;
                updateUserData.phone = updateRequestData.phone;
            }
        }


        //fax
        if (existingProfileInfo[0].fax !== updateRequestData.fax) {
            willWeUpdate = 1;
            updateData.fax = updateRequestData.fax;
        }

        //address
        if (existingProfileInfo[0].address !== updateRequestData.address) {
            willWeUpdate = 1;
            updateData.address = updateRequestData.address;
        }

        // zip check
        if (existingProfileInfo[0].zip_id != updateRequestData.zip_id) {
            willWeUpdate = 1;

            updateData.zip_id = updateRequestData.zip_id;
        }

        // description 
        if (existingUserInfo[0].role_id == 4 || existingUserInfo[0].role_id == 5 || existingUserInfo[0].role_id == 6) {
            if (existingProfileInfo[0].description !== updateRequestData.description) {
                willWeUpdate = 1;
                updateData.description = updateRequestData.description;
            }

        }


        //  image code
        if (req.files && Object.keys(req.files).length > 0) {
            let fileUploadCode = {};
            let fileUploadCodeCoverImage = {};

            if (req.files.image) {
                if (existingUserInfo[0].role_id === 3) {
                    fileUploadCode = await fileUploaderCommonObject.uploadFile(
                        req,
                        "dentistImage",
                        "image"
                    );
                } else if (existingUserInfo[0].role_id === 4) {
                    fileUploadCode = await fileUploaderCommonObject.uploadFile(
                        req,
                        "consultantImage",
                        "image"
                    );
                } else if (existingUserInfo[0].role_id === 5) {
                    fileUploadCode = await fileUploaderCommonObject.uploadFile(
                        req,
                        "labImage",
                        "image"
                    );
                } else if (existingUserInfo[0].role_id === 6) {
                    fileUploadCode = await fileUploaderCommonObject.uploadFile(
                        req,
                        "techImage",
                        "image"
                    );
                }

                if (fileUploadCode.success == false) {
                    return res.status(200).send({
                        success: false,
                        status: 400,
                        message1: fileUploadCode.message,
                    });
                }

                willWeUpdate = 1;
                updateRequestData.profile_image = fileUploadCode.fileName;
                updateData.profile_image = updateRequestData.profile_image;
            }

            if (req.files.cover_image) {
                if (existingUserInfo[0].role_id === 5) {
                    fileUploadCodeCoverImage = await fileUploaderCommonObject.uploadFile(
                        req,
                        "labCoverImage",
                        "cover_image"
                    );
                } else if (existingUserInfo[0].role_id === 6) {
                    fileUploadCodeCoverImage = await fileUploaderCommonObject.uploadFile(
                        req,
                        "techCoverImage",
                        "cover_image"
                    );
                } else if (existingUserInfo[0].role_id === 4) {
                    fileUploadCodeCoverImage = await fileUploaderCommonObject.uploadFile(
                        req,
                        "consultantCoverImage",
                        "cover_image"
                    );
                }

                if (fileUploadCodeCoverImage.success == false) {
                    return res.status(200).send({
                        success: false,
                        status: 400,
                        message2: fileUploadCodeCoverImage.message,
                    });
                }

                if (fileUploadCodeCoverImage.success == true) {
                    willWeUpdate = 1;
                    updateRequestData.cover_image = fileUploadCodeCoverImage.fileName;
                    updateData.cover_image = updateRequestData.cover_image;
                }
            }
        }

        if (isError == 1) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: errorMessage,
            });
        }

        if (willWeUpdate == 1) {

            updateData.updated_by = req.decoded.userInfo.id;
            updateData.updated_at = await commonObject.getGMT();

            if (!isEmpty(updateUserData)) {
                updateUserData.id = req.decoded.userInfo.id;
                updateUserData.updated_by = req.decoded.userInfo.id;
                updateUserData.updated_at = await commonObject.getGMT();
            }

            let result = await userModel.updateUserProfileById(
                updateRequestData.id,
                req.decoded.userInfo.id,
                updateData,
                updateUserData,
                existingUserInfo[0].role_id
            );

            if (result.affectedRows == undefined || result.affectedRows < 1) {
                return res.status(500).send({
                    success: true,
                    status: 500,
                    message: "Something Wrong in system database.",
                });
            }

            if (req.files && Object.keys(req.files).length > 0) {
                // profile image delete

                if (req.files.image) {
                    if (previousProfileImage != updateData.profile_image) {
                        if (previousProfileImage != "default_profile_image.png") {
                            let fileDelete = {};
                            if (existingUserInfo[0].role_id === 3) {
                                fileDelete = await fileUploaderCommonObject.fileRemove(
                                    previousProfileImage,
                                    "dentistImage"
                                );
                            } else if (existingUserInfo[0].role_id === 4) {
                                fileDelete = await fileUploaderCommonObject.fileRemove(
                                    previousProfileImage,
                                    "consultantImage"
                                );
                            } else if (existingUserInfo[0].role_id === 5) {
                                fileDelete = await fileUploaderCommonObject.fileRemove(
                                    previousProfileImage,
                                    "labImage"
                                );
                            } else if (existingUserInfo[0].role_id === 6) {
                                fileDelete = await fileUploaderCommonObject.fileRemove(
                                    previousProfileImage,
                                    "techImage"
                                );
                            }
                        }
                    }
                }

                /// cover image delete
                if (req.files.cover_image) {
                    if (previousCoverImage != updateData.cover_image) {
                        if (previousCoverImage != "default_cover_image.png") {
                            let fileDelete2 = {};
                            if (existingUserInfo[0].role_id === 5) {
                                fileDelete2 = await fileUploaderCommonObject.fileRemove(
                                    previousCoverImage,
                                    "labCoverImage"
                                );
                            } else if (existingUserInfo[0].role_id === 6) {
                                fileDelete2 = await fileUploaderCommonObject.fileRemove(
                                    previousCoverImage,
                                    "techCoverImage"
                                );
                            } else if (existingUserInfo[0].role_id === 4) {
                                fileDelete2 = await fileUploaderCommonObject.fileRemove(
                                    previousCoverImage,
                                    "consultantCoverImage"
                                );
                            }
                        }
                    }
                }
            }

            return res.status(200).send({
                success: true,
                status: 200,
                message: "Profile successfully updated.",
            });
        } else {
            return res.status(200).send({
                success: true,
                status: 200,
                message: "Nothing to update.",
            });
        }
    }
);

/// Email Change request
router.post(
    "/emailChangeRequest",
    [verifyToken, routeAccessChecker("emailChangeRequest")],
    async (req, res) => {
        let reqData = {
            id: req.decoded.userInfo.id,
            current_email: req.body.current_email,
            new_email: req.body.new_email,
            password: req.body.password,
        };

        // user data validate
        let existingUserInfo = await userModel.getUserById(req.decoded.userInfo.id);

        if (isEmpty(existingUserInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Data not found.",
            });
        } else if (existingUserInfo[0].status !== 1) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User Deactivated.",
            });
        }

        let errorMessage = "";
        let isError = 0;

        // Check current Email
        if (reqData.current_email === undefined || isEmpty(reqData.current_email)) {
            isError = 1;
            errorMessage += "Current Email should not empty.";
        } else {
            let validateEmail = await commonObject.isValidEmail(
                reqData.current_email
            );

            if (validateEmail == false) {
                isError = 1;
                errorMessage += "Current Email is not valid.";
            }

            if (existingUserInfo[0].email != reqData.current_email) {
                isError = 1;
                errorMessage += "Current Email is not matched.";
            }
        }

        // Check new Email
        if (reqData.new_email === undefined || isEmpty(reqData.new_email)) {
            isError = 1;
            errorMessage += "New Email should not empty.";
        } else {
            let validateEmail = await commonObject.isValidEmail(reqData.new_email);

            if (validateEmail == false) {
                isError = 1;
                errorMessage += "New Email is not valid.";
            }

            // Email already in use check
            let existingUserByEmail = await userModel.getUserByEmail(
                reqData.new_email
            );

            if (!isEmpty(existingUserByEmail)) {
                isError = 1;
                errorMessage += "New Email already in use.";
            }
        }

        // Check password

        let matchPassword = bcrypt.compareSync(
            reqData.password,
            existingUserInfo[0].password
        );

        if (matchPassword == false) {
            isError = 1;
            errorMessage += "Password is not matched.";
        }

        if (isError == 1) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: errorMessage,
            });
        }

        // otp generate
        let otp = await commonObject.generateOTP();
        let counter = 3;

        let description = {};

        description.old_email = existingUserInfo[0].email;
        description.new_email = reqData.new_email;

        let insertData = {
            user_id: req.decoded.userInfo.id,
            type: "emailChange",
            otp: otp,
            description: JSON.stringify(description),
            counter: counter,
            expired_time: await commonObject.addFiveMinuteToGMT(),
            created_at: await commonObject.getGMT(),
        };

        // check user has already request for email change
        // if true then update the status with 0

        let existingEmailChangeRequest =
            await otpModel.getEmailChangeRequestByUserId(
                req.decoded.userInfo.id,
                "emailChange"
            );

        if (existingEmailChangeRequest.length > 0) {
            for (let i = 0; i < existingEmailChangeRequest.length; i++) {
                if (existingEmailChangeRequest[i].status == 1) {
                    await otpModel.updateEmailChangeRequest(
                        existingEmailChangeRequest[i].id
                    );
                }
            }
        }

        // SEND MAIL WITH OTP

        let receiverMail = reqData.new_email;

        let requestMailChange = await otpModel.addRequestMailChange(insertData);

        if (
            requestMailChange.affectedRows == undefined ||
            requestMailChange.affectedRows < 1
        ) {
            return res.status(500).send({
                success: true,
                status: 500,
                message: "Something Wrong in system database.",
            });
        }

        // let emailBody = `
        //     <p>We have received your request for changing email</p>
        //     <h5>Your OTP is ${otp}</h5>
        //     `;

        let sendEmail = await emailCommonObject.sentEmailByHtmlFormate(
            receiverMail,
            "Change Email",
            "We have received your request for changing email",
            "Your OTP is ${otp}",
            "#"
        );

        return res.status(201).send({
            success: true,
            status: 201,
            message: "Check on new email to get the OTP.",
        });
    }
);

router.post(
    "/emailChangeSubmit",
    [verifyToken, routeAccessChecker("emailChangeSubmit")],
    async (req, res) => {
        let reqData = {
            otp: req.body.otp,
        };

        let userActiveRequest = await otpModel.getActiveRequestByIdAndType(
            req.decoded.userInfo.id,
            "emailChange"
        );

        let requestOtpData = await otpModel.getRequestByOTP(
            req.decoded.userInfo.id,
            "emailChange",
            reqData.otp
        );

        if (
            isEmpty(requestOtpData) ||
            (requestOtpData.length == 1 && requestOtpData[0].status == 0)
        ) {
            if (userActiveRequest.length == 1) {
                let newCounter;
                let currentCounter = userActiveRequest[0].counter;
                newCounter = currentCounter - 1;

                if (newCounter > 0) {
                    await otpModel.updateCounter(userActiveRequest[0].id, newCounter);

                    return res.status(404).send({
                        success: false,
                        status: 404,
                        message: `OTP not matched and you have ${newCounter} attempt left.`,
                    });
                } else if (newCounter == 0) {
                    await otpModel.updateEmailChangeRequest(userActiveRequest[0].id);

                    await otpModel.updateCounter(userActiveRequest[0].id, newCounter);

                    return res.status(404).send({
                        success: false,
                        status: 404,
                        message: `OTP not matched and you have ${newCounter} attempt left so request again.`,
                    });
                }
            } else {
                return res.status(404).send({
                    success: false,
                    status: 404,
                    message:
                        "OTP not matched and you have 0 attempt left so request again.",
                });
            }
        } else if (requestOtpData.length == 1 && requestOtpData[0].status == 1) {
            // expired time check
            if (
                moment(requestOtpData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") <
                (await commonObject.getGMT())
            ) {
                let disableOTP = await otpModel.updateEmailChangeRequest(
                    requestOtpData[0].id
                );

                if (
                    disableOTP.affectedRows == undefined ||
                    disableOTP.affectedRows < 1
                ) {
                    return res.status(500).send({
                        success: true,
                        status: 500,
                        message: "Something Wrong in system database.",
                    });
                }

                return res.status(401).send({
                    success: false,
                    status: 401,
                    message: "OTP is Expired. Make a new request",
                });
            }

            // counter check
            if (requestOtpData[0].counter == 0) {
                return res.status(401).send({
                    success: false,
                    status: 401,
                    message: "OTP attempt expired",
                });
            }

            // update the status with 0 and Insert new email to user and Other Table

            // fetch the new email
            let description = JSON.parse(requestOtpData[0].description);

            let new_email = description.new_email;

            let validateEmail = await commonObject.isValidEmail(new_email);

            if (validateEmail == false) {
                return res.status(401).send({
                    success: false,
                    status: 401,
                    message: "New Email is not valid",
                });
            }

            // Email already in use check
            let existingUserByEmail = await userModel.getUserByEmail(new_email);

            if (!isEmpty(existingUserByEmail)) {
                return res.status(401).send({
                    success: false,
                    status: 401,
                    message: "New Email already in use",
                });
            }

            let requestData = {
                user_id: req.decoded.userInfo.id,
                profile_id: req.decoded.profileInfo.id,
                email: new_email,
                otp: reqData.otp,
                otp_id: requestOtpData[0].id,
                type: "emailChange",
                updated_at: await commonObject.getGMT(),
                updated_by: req.decoded.userInfo.id,
            };

            let roleId = req.decoded.userInfo.role_id;

            let result = await userModel.updateUserEmail(requestData, roleId);

            if (result.affectedRows == undefined || result.affectedRows < 1) {
                return res.status(500).send({
                    success: true,
                    status: 500,
                    result: result,
                    message: "Something Wrong in system database.",
                });
            }

            return res.status(200).send({
                success: true,
                status: 200,
                message: "Email changed successfully",
            });
        } else if (requestOtpData.length > 1) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Unexpected Request.",
            });
        }
    }
);


router.get("/user-transaction-history", [verifyToken], async (req, res) => {

    let transactionRecords = await userBalanceRecordModel.getAllBalanceRecordsByUserID(req.decoded.userInfo.id);
    return res.status(200).send({
        success: true,
        status: 200,
        total_data: transactionRecords.length,
        data: transactionRecords,
        message: "",
    });


});

router.get("/payment-short-summary", [verifyToken], async (req, res) => {

    let easifiAccountBalanceResult = await easifiAccountBalanceModel.getBalanceByID(1);
    let easifiBalance = isEmpty(easifiAccountBalanceModel) ? 0 : easifiAccountBalanceResult[0].balance;

    let easifiAccountINBalanceResult = await userBalanceRecordModel.getTotalInBalanceByUserId(0);
    let easifiAccountINBalance = isEmpty(easifiAccountINBalanceResult) ? 0 : easifiAccountINBalanceResult[0].total_in_balance;


    let easifiAccountOutBalanceResult = await userBalanceRecordModel.getTotalOutBalanceByUserId(0);
    let easifiAccountOutBalance = isEmpty(easifiAccountOutBalanceResult) ? 0 : easifiAccountOutBalanceResult[0].total_out_balance;


    easifiAccountBalanceModel.updateBalanceById(1);

    return res.status(200).send({
        success: true,
        status: 200,
        easifi_balance: easifiBalance,
        total_in_balance: easifiAccountINBalance,
        total_out_balance: easifiAccountOutBalance,
        message: ""
    });


});

router.get("/invoiceList", [verifyToken, routeAccessChecker("invoiceList")], async (req, res) => {

    let invoiceList = await customerPayableAmountModel.getInvoicesByUserId(req.decoded.userInfo.id);

    for (let i = 0; i < invoiceList.length; i++) {

        if (invoiceList[i].table_name == "mtae_case_members") {
            let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(invoiceList[i].table_id);
            invoiceList[i].case_member_details = caseMemberDetails[0];

            let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
            if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
            if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
            if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
            invoiceList[i].case_details = caseDetails[0];

            let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
            invoiceList[i].service = serviceDetails[0];
            invoiceList[i].service_name = serviceDetails[0].name;

            let profileDetailsOfSender = await commonObject.getUserInfoByUserId(invoiceList[i].payment_sender_id);
            invoiceList[i].sender_name = profileDetailsOfSender.data[0].full_name;
            invoiceList[i].sender_role_id = profileDetailsOfSender.data[0].role_id;

            let profileDetailsOfReceiver = await commonObject.getUserInfoByUserId(invoiceList[i].payment_receiver_id);
            invoiceList[i].receiver_name = profileDetailsOfReceiver.data[0].full_name;
            invoiceList[i].receiver_role_id = profileDetailsOfReceiver.data[0].role_id;
        }

    }
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Invoice List",
        total_data: invoiceList.length,
        data: invoiceList,
    });


});

// invoice details
router.get("/invoiceDetails/:id", [verifyToken, routeAccessChecker("invoiceDetails")], async (req, res) => {

    let invoiceId = req.params.id;

    let validateId = await commonObject.checkItsNumber(invoiceId);

    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    } else {
        req.params.id = validateId.data;
        invoiceId = validateId.data;
    }

    let invoiceDetails = await customerPayableAmountModel.getInvoiceDetailsById(invoiceId);

    if (isEmpty(invoiceDetails)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Invoice not found.",
        });
    }

    if (invoiceDetails[0].payment_sender_id !== req.decoded.userInfo.id && invoiceDetails[0].payment_receiver_id !== req.decoded.userInfo.id) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "You are not eligible to see this invoice.",
        });
    }

    if (invoiceDetails[0].table_name == "mtae_case_members") {
        let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(invoiceDetails[0].table_id);
        invoiceDetails[0].case_member_details = caseMemberDetails[0];

        let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
        if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
        if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
        if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
        invoiceDetails[0].case_details = caseDetails[0];

        let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
        invoiceDetails[0].service = serviceDetails[0];
        invoiceDetails[0].service_name = serviceDetails[0].name;

        let profileDetailsOfSender = await commonObject.getUserInfoByUserId(invoiceDetails[0].payment_sender_id);
        invoiceDetails[0].sender_name = profileDetailsOfSender.data[0].full_name;
        invoiceDetails[0].sender_role_id = profileDetailsOfSender.data[0].role_id;

        let profileDetailsOfReceiver = await commonObject.getUserInfoByUserId(invoiceDetails[0].payment_receiver_id);
        invoiceDetails[0].receiver_name = profileDetailsOfReceiver.data[0].full_name;
        invoiceDetails[0].receiver_role_id = profileDetailsOfReceiver.data[0].role_id;
    }

    return res.status(200).send({
        success: true,
        status: 200,
        data: invoiceDetails
    });
}
);

router.get("/invoiceListForAdmins", [verifyToken, routeAccessChecker("invoiceListForAdmins")], async (req, res) => {

    let invoiceList = await customerPayableAmountModel.getAllInvoicesList();

    for (let i = 0; i < invoiceList.length; i++) {

        if (invoiceList[i].table_name == "mtae_case_members") {
            let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(invoiceList[i].table_id);
            invoiceList[i].case_member_details = caseMemberDetails[0];

            let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
            if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
            if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
            if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
            invoiceList[i].case_details = caseDetails[0];

            let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
            invoiceList[i].service = serviceDetails[0];
            invoiceList[i].service_name = serviceDetails[0].name;

            let profileDetailsOfSender = await commonObject.getUserInfoByUserId(invoiceList[i].payment_sender_id);
            invoiceList[i].sender_name = profileDetailsOfSender.data[0].full_name;
            invoiceList[i].sender_role_id = profileDetailsOfSender.data[0].role_id;

            let profileDetailsOfReceiver = await commonObject.getUserInfoByUserId(invoiceList[i].payment_receiver_id);
            invoiceList[i].receiver_name = profileDetailsOfReceiver.data[0].full_name;
            invoiceList[i].receiver_role_id = profileDetailsOfReceiver.data[0].role_id;
        }

    }
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Invoice List",
        total_data: invoiceList.length,
        data: invoiceList,
    });


});


// invoice details for admin
router.get("/invoiceDetailsForAdmin/:id", [verifyToken, routeAccessChecker("invoiceDetailsForAdmin")], async (req, res) => {

    let invoiceId = req.params.id;

    let validateId = await commonObject.checkItsNumber(invoiceId);

    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    } else {
        req.params.id = validateId.data;
        invoiceId = validateId.data;
    }

    let invoiceDetails = await customerPayableAmountModel.getInvoiceDetailsById(invoiceId);

    if (isEmpty(invoiceDetails)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Invoice not found.",
        });
    }

    if (invoiceDetails[0].table_name == "mtae_case_members") {
        let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(invoiceDetails[0].table_id);
        invoiceDetails[0].case_member_details = caseMemberDetails[0];

        let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
        if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
        if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
        if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
        invoiceDetails[0].case_details = caseDetails[0];

        let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
        invoiceDetails[0].service = serviceDetails[0];
        invoiceDetails[0].service_name = serviceDetails[0].name;

        let profileDetailsOfSender = await commonObject.getUserInfoByUserId(invoiceDetails[0].payment_sender_id);
        invoiceDetails[0].sender_name = profileDetailsOfSender.data[0].full_name;
        invoiceDetails[0].sender_role_id = profileDetailsOfSender.data[0].role_id;

        let profileDetailsOfReceiver = await commonObject.getUserInfoByUserId(invoiceDetails[0].payment_receiver_id);
        invoiceDetails[0].receiver_name = profileDetailsOfReceiver.data[0].full_name;
        invoiceDetails[0].receiver_role_id = profileDetailsOfReceiver.data[0].role_id;
    }

    return res.status(200).send({
        success: true,
        status: 200,
        data: invoiceDetails
    });
}
);

router.get("/completedCaseList/:id", [verifyToken, routeAccessChecker("completedCaseList")], async (req, res) => {


    let userId = req.params.id;

    let validateId = await commonObject.checkItsNumber(userId);

    if (validateId.success == false) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Value should be integer.",
        });
    } else {
        req.params.id = validateId.data;
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

    let completedCaseList = await customerPayableAmountModel.getCompletedCaseListByUserId(userId);

    for (let i = 0; i < completedCaseList.length; i++) {

        if (completedCaseList[i].table_name == "mtae_case_members") {
            let caseMemberDetails = await caseMemberModel.getCaseMemberDetailsById(completedCaseList[i].table_id);
            //completedCaseList[i].case_member_details = caseMemberDetails[0];

            let caseDetails = await caseModel.getCaseAllDetailsById(caseMemberDetails[0].case_id);
            if (caseDetails[0].hasOwnProperty("patient_name")) delete caseDetails[0].patient_name;
            if (caseDetails[0].hasOwnProperty("patient_age")) delete caseDetails[0].patient_age;
            if (caseDetails[0].hasOwnProperty("patient_address")) delete caseDetails[0].patient_address;
            //completedCaseList[i].case_details = caseDetails[0];

            let serviceDetails = await serviceModel.getServiceById(caseMemberDetails[0].service_id);
            //completedCaseList[i].service = serviceDetails[0];
            completedCaseList[i].service_name = serviceDetails[0].name;

            let profileDetailsOfSender = await commonObject.getUserInfoByUserId(completedCaseList[i].payment_sender_id);
            completedCaseList[i].sender_name = profileDetailsOfSender.data[0].full_name;
            completedCaseList[i].sender_role_id = profileDetailsOfSender.data[0].role_id;

            let profileDetailsOfReceiver = await commonObject.getUserInfoByUserId(completedCaseList[i].payment_receiver_id);
            completedCaseList[i].receiver_name = profileDetailsOfReceiver.data[0].full_name;
            completedCaseList[i].receiver_role_id = profileDetailsOfReceiver.data[0].role_id;
        }

    }
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Completed Cases",
        total_data: completedCaseList.length,
        data: completedCaseList,
    });


});

router.get("/*", (req, res) => {
    return res.status(404).send({
        status: 404,
        message: "unknown route",
        success: false,
    });
});

router.post("/*", (req, res) => {
    return res.status(404).send({
        status: 404,
        message: "unknown route",
        success: false,
    });
});

module.exports = router;
