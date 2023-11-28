const express = require("express");
const isEmpty = require("is-empty");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const commonObject = require("../common/common");
const userModel = require("../models/user");
const superAdminModel = require("../models/superAdmin");
const adminModel = require("../models/admin");
const dentistModel = require("../models/dentist");
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");
const loginTrackModel = require("../models/loginTrack");
const roleModel = require("../models/role");
const verifyToken = require("../middlewares/jwt_verify/verifyToken");

router.post("/login", async (req, res) => {
    let loginData = {
        password: req.body.password,
        userName: req.body.user_name, // or email
    };

    let errorMessage = "";
    let isError = 0;

    // Check userName validation
    if (loginData.userName === undefined || isEmpty(loginData.userName)) {
        isError = 1;
        errorMessage += "Give valid userName or email.";
    }

    // Check Password Validation
    if (loginData.password == undefined || loginData.password.length < 6) {
        isError = 1;
        errorMessage += "Give valid password.";
    } else if (typeof loginData.password === "number") {
        loginData.password = loginData.password.toString();
    }

    if (isError == 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: errorMessage,
        });
    }

    // Get User data from user table.
    let userData = await userModel.getUserByUserNameOrEmail(loginData.userName);

    if (
        isEmpty(userData) ||
        !(
            userData[0].user_name == loginData.userName ||
            userData[0].email == loginData.userName
        )
    ) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No user found.",
        });
    }

    // Check Password
    if (bcrypt.compareSync(loginData.password, userData[0].password)) {
        let profileData = {};

        //Check Role
        let roleData = await roleModel.getRoleByIdentityId(userData[0].role_id);
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

        if (isEmpty(roleData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: " Unknown User role.",
            });
        }

        if (userData[0].role_id == 1) {
            profileInfo = await superAdminModel.getSuperAdminById(
                userData[0].profile_id
            );
        } else if (userData[0].role_id == 2) {
            profileInfo = await adminModel.getAdminById(userData[0].profile_id);
            imageFolderPath = `${process.env.backend_url}${process.env.admin_image_path_name}`;
        } else if (userData[0].role_id == 3) {
            profileInfo = await dentistModel.getDentistById(userData[0].profile_id);
        } else if (userData[0].role_id == 4) {
            profileInfo = await consultantModel.getConsultantById(
                userData[0].profile_id
            );
        } else if (userData[0].role_id == 5) {
            profileInfo = await labModel.getLabById(userData[0].profile_id);
        } else if (userData[0].role_id == 6) {
            profileInfo = await techCompanyModel.getTechCompanyById(
                userData[0].profile_id
            );
        } else {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "No user found.",
            });
        }

        if (isEmpty(profileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Unknown User.",
            });
        }

        // get device info
        let deviceInfo = await commonObject.getUserDeviceInfo(req);
        let uuid = uuidv4();
        delete profileInfo[0].id;

        // Generate profile data
        hashId = await commonObject.hashingUsingCrypto(userData[0].id.toString());
        profileData.api_token = hashId;

        profileData.user_name = userData[0].user_name;
        profileData.email = userData[0].email;
        profileData.phone = userData[0].phone;
        profileData.role = {
            role_id: roleData[0].identity_id,
            role_name: roleData[0].title,
        };

        profileData.profile = profileInfo[0];
        profileData.time_period = Date.now() + 3600000;
        profileData.identity_id = uuid;

        //  "Generate Token"
        let token = jwt.sign(profileData, global.config.secretKey, {
            algorithm: global.config.algorithm,
            expiresIn: global.config.expiresIn, // one day
        });

        delete profileData.api_token;
        delete profileData.time_period;
        delete profileData.identity_id;
        profileData.token = token;

        // Save user identity in login-tracker

        let loginTrackerData = {
            user_id: userData[0].id,
            jwt_token: token,
            login_device_info: JSON.stringify(deviceInfo),
            uuid: uuid,
            created_at: await commonObject.getGMT(),
            updated_at: await commonObject.getGMT(),
            created_by: userData[0].id,
            updated_by: userData[0].id,
        };

        profileData.id =  userData[0].id; //  frontend requested, we send user id in response.
        profileData.imageFolderPath =  imageFolderPath;


        loginTrackModel.addNewLoggingTracker(loginTrackerData);

        return res.status(200).send({
            success: true,
            message: "Welcome to the system.",
            data: profileData,
        });
    } else {
        return res.status(401).send({
            status: 401,
            success: false,
            message: "Wrong Password",
        });
    }
});

router.get("/logout", verifyToken, async (req, res) => {
    let result = await loginTrackModel.deleteLoggingTrackerDataByUUID(
        req.decoded.uuid
    );

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            success: true,
            status: 500,
            message: "Something Wrong in system. Please try again.",
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Logout successfully done. Thank you for using Easifi.",
    });
});


module.exports = router;
