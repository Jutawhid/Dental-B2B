const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require("../common/common");
const serviceModel = require("../models/service");
const serviceAccessRolesModel = require("../models/serviceAccessRoles");
const roleModel = require("../models/role");
const verifyToken = require("../middlewares/jwt_verify/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");

router.get(
  "/list",
  [verifyToken, routeAccessChecker("serviceList")],
  async (req, res) => {
    let result = await serviceModel.getServiceList();


    for (let i = 0; i < result.length; i++) {
      let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
        result[i].id
      );

      // if (isEmpty(accessList)) {
      //   return res.status(400).send({
      //     success: false,
      //     status: 400,
      //     message: "No access list found for this service",
      //   });
      // }

      let roleData = [];
      for (let j = 0; j < accessList.length; j++) {
        let roleDetails = await roleModel.getRoleByIdentityId(
          accessList[j].role_id
        );

        if (isEmpty(roleDetails)) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "No Role found ",
          });
        }

        roleData.push({ id: roleDetails[0].id, title: roleDetails[0].title });
      }

      result[i].roleType = roleData;
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Service List.",
      count: result.length,
      data: result,
    });
  }
);


router.get("/details/:id",
  [verifyToken, routeAccessChecker("serviceDetails")],
  async (req, res) => {

    let id = req.params.id;

    let validateId = await commonObject.checkItsNumber(id);


    if (validateId.success == false) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Value should be integer."
      });
    } else {
      id = validateId.data;
    }

    let result = await serviceModel.getServiceById(id);

    for (let i = 0; i < result.length; i++) { // it's run only one time
      let accessList = await serviceAccessRolesModel.getAccessListByServiceId(
        result[i].id
      );

      let roleData = [];
      for (let j = 0; j < accessList.length; j++) {
        let roleDetails = await roleModel.getRoleByIdentityId(
          accessList[j].role_id
        );

        if (isEmpty(roleDetails)) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "No Role found ",
          });
        }

        roleData.push({ id: roleDetails[0].id, title: roleDetails[0].title });
      }

      result[i].roleType = roleData;
    }

    if (isEmpty(result)) {

      return res.status(404).send({
        success: false,
        status: 404,
        message: "No service data found",
      });

    } else {

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Service Details.",
        data: result[0],
      });
      
    }

  }
);

router.post(
  "/add",
  [verifyToken, routeAccessChecker("serviceAdd")],
  async (req, res) => {
    let reqData = {
      name: req.body.name,
      priority: req.body.priority,
      roleId: req.body.role_id,
    };

    let errorMessage = "";
    let isError = 0;

    let validateServiceName = await commonObject.characterLimitCheck(
      reqData.name,
      "Service Name"
    );

    if (validateServiceName.success == false) {
      isError = 1;
      errorMessage += validateServiceName.message;
    }

    reqData.name = validateServiceName.data;

    // validate Priority
    let validatePriority = await commonObject.checkItsNumber(
      reqData.priority
    );

    if (validatePriority.success == false) {
      isError = 1;
      errorMessage += "Priority value should be integer.";
    }

    reqData.priority = validatePriority.data;

    // validate Role Id
    if (reqData.roleId == undefined) {
      isError = 1;
      errorMessage += "Role type not found. ";
    } else {

      // check role type is array
      if (Array.isArray(reqData.roleId) && reqData.roleId.length > 0) {
        // check duplicate element in array
        let duplicate = reqData.roleId.some((element, index) => {
          return reqData.roleId.indexOf(element) !== index;
        });

        if (duplicate) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Role type contains duplicate value.",
          });
        }

        // check role type, is all role active ?

        for (let i = 0; i < reqData.roleId.length; i++) {
          // check role type is integer

          let validateRoleId = await commonObject.checkItsNumber(
            reqData.roleId[i]
          );


          if (validateRoleId.success == false) {
            isError = 1;
            errorMessage += `Role ${reqData.roleId[i]} value should be integer.`;

            return res.status(400).send({
              success: false,
              status: 400,
              message: errorMessage,
            });

          }

          reqData.roleId[i] = validateRoleId.data;

          let roleData = await roleModel.getRoleByIdentityId(reqData.roleId[i]);

          if (isEmpty(roleData) || roleData[0].status == 0) {
            isError = 1;
            errorMessage += `${reqData.roleId[i]} Role not exist. `;
          }

          // console.log(errorMessage);
        }
      } else {
        isError = 1;
        errorMessage += "Must Select a Role Type. ";
      }
    }

    if (isError == 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: errorMessage,
      });
    }

    let duplicateNameCheck = await serviceModel.getServiceByName(reqData.name);

    if (
      !isEmpty(duplicateNameCheck) &&
      duplicateNameCheck[0].id != reqData.id &&
      duplicateNameCheck[0].status != 0
    ) {
      return res.status(422).send({
        success: false,
        status: 422,
        message:
          duplicateNameCheck[0].active_status == 0
            ? "Service name exist but deactivate."
            : "Service name already exist.",
      });
    }

    let duplicatePriorityCheck = await serviceModel.getServiceByPriority(reqData.priority);

    if (
      !isEmpty(duplicatePriorityCheck) &&
      duplicatePriorityCheck[0].id != reqData.id &&
      duplicatePriorityCheck[0].status != 0
    ) {
      return res.status(422).send({
        success: false,
        status: 422,
        message:
          duplicatePriorityCheck[0].active_status == 0
            ? "Service Priority exist but deactivate."
            : "Service Priority already exist.",
      });
    }

    // let existingData = await serviceModel.getServiceByNameAndPriority(
    //   reqData.name,
    //   reqData.priority
    // );

    // if (!isEmpty(existingData)) {
    //   return res.status(422).send({
    //     success: false,
    //     status: 422,
    //     message:
    //       existingData[0].status === 1
    //         ? "Service Name or Priority already in use."
    //         : "Service Exist but Deactivate.",
    //   });
    // }

    let serviceData = {
      name: reqData.name,
      priority: reqData.priority,
      created_by: req.decoded.userInfo.id,
      updated_by: req.decoded.userInfo.id,
      created_at: await commonObject.getGMT(),
      updated_at: await commonObject.getGMT(),
    };

    let result = await serviceModel.addNewService(serviceData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    let serviceId = result.insertId;

    let serviceAccessRoles = {
      service_id: serviceId,
      role_id: reqData.roleId,
      created_by: req.decoded.userInfo.id,
      updated_by: req.decoded.userInfo.id,
      created_at: await commonObject.getGMT(),
      updated_at: await commonObject.getGMT(),
    };

    for (let i = 0; i < reqData.roleId.length; i++) {
      serviceAccessRoles.role_id = reqData.roleId[i];
      let finalResult = await serviceAccessRolesModel.addNewServiceAccessRoles(
        serviceAccessRoles
      );

      if (
        finalResult.affectedRows == undefined ||
        finalResult.affectedRows < 1
      ) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }
    }

    return res.status(201).send({
      success: true,
      status: 201,
      message: "Service Added Successfully.",
    });
  }
);

router.put(
  "/update",
  [verifyToken, routeAccessChecker("serviceUpdate")],
  async (req, res) => {
    let reqData = {
      id: req.body.id,
      name: req.body.name,
      priority: req.body.priority,
      roleId: req.body.role_id,
    };
    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let errorMessage = "";
    let isError = 0;

    let validateId = await commonObject.checkItsNumber(reqData.id);
    if (validateId.success == false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "ID should be integer.",
      });
    }

    reqData.id = validateId.data;

    let existingDataById = await serviceModel.getServiceById(reqData.id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    if (reqData.name == undefined || reqData.name == "") {
      reqData.name = existingDataById[0].name;
    }

    let validateServiceName = await commonObject.characterLimitCheck(
      reqData.name,
      "Service Name"
    );

    if (validateServiceName.success == false) {
      isError = 1;
      errorMessage += validateServiceName.message;
    }

    reqData.name = validateServiceName.data;

    // validate Priority

    if (reqData.priority === undefined) {
      reqData.priority = existingDataById[0].priority;
    } else {
      let validatePriority = await commonObject.checkItsNumber(
        reqData.priority
      );

      reqData.priority = validatePriority.data;

      if (validatePriority === false) {
        isError = 1;
        errorMessage += "Value should be integer.";
      }

      if (reqData.priority < 1) {
        isError = 1;
        errorMessage += "Priority should be greater than 0.";
      }
    }


    // validate Role Id

    if (reqData.roleId == undefined) {
      isError = 1;
      errorMessage += "Role type not found. ";
    } else {
      // check role type is array
      if (Array.isArray(reqData.roleId) && reqData.roleId.length > 0) {
        // check duplicate element in array
        let duplicate = reqData.roleId.some((element, index) => {
          return reqData.roleId.indexOf(element) !== index;
        });

        if (duplicate) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Role type contains duplicate value.",
          });
        }

        // check role type, is all role active ?

        for (let i = 0; i < reqData.roleId.length; i++) {
          // check role type is integer

          let validateRoleId = await commonObject.checkItsNumber(
            reqData.roleId[i]
          );

          if (validateRoleId.success == false) {
            isError = 1;
            errorMessage += `${reqData.roleId[i]} Value should be integer.`;

            return res.status(400).send({
              success: false,
              status: 400,
              message: errorMessage,
            });

          }

          reqData.roleId[i] = validateRoleId.data;

          let roleData = await roleModel.getRoleByIdentityId(reqData.roleId[i]);

          if (isEmpty(roleData) || roleData[0].status == 0) {
            isError = 1;
            errorMessage += `${reqData.roleId[i]} Role not exist. `;
          }
          console.log(errorMessage);
        }
      } else {
        isError = 1;
        errorMessage += "Must Select a Role Type. ";
      }
    }

    if (isError == 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: errorMessage,
      });
    }

    let duplicateNameCheck = await serviceModel.getServiceByName(reqData.name);

    if (
      !isEmpty(duplicateNameCheck) &&
      duplicateNameCheck[0].id != reqData.id &&
      duplicateNameCheck[0].status != 0
    ) {
      return res.status(422).send({
        success: false,
        status: 422,
        message:
          duplicateNameCheck[0].active_status == 0
            ? "Service name exist but deactivate."
            : "Service name already exist.",
      });
    }

    let duplicatePriorityCheck = await serviceModel.getServiceByPriority(reqData.priority);

    if (
      !isEmpty(duplicatePriorityCheck) && duplicatePriorityCheck[0].id != reqData.id && duplicatePriorityCheck[0].status != 0
    ) {
      return res.status(422).send({
        success: false,
        status: 422,
        message:
          duplicatePriorityCheck[0].active_status == 0
            ? "Service Priority exist but deactivate."
            : "Service Priority already exist.",
      });
    }

    let result = await serviceModel.updateServiceByID(
      reqData.name,
      reqData.priority,
      reqData.updated_by,
      reqData.updated_at,
      reqData.id
    );

    if (result.affectedRows == undefined || result.affectedRows == 0) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    // service access new add or update

    let existingServiceAccessRoles =
      await serviceAccessRolesModel.getAccessListByServiceId(
        reqData.id
      );

    for (let i = 0; i < existingServiceAccessRoles.length; i++) {
      let needDelete = 0; /// 0 =  delete, 1 = no delete
      for (let j = 0; j < reqData.roleId.length; j++) {
        if (
          existingServiceAccessRoles[i].role_id == reqData.roleId[j] &&
          existingServiceAccessRoles[i].service_id == reqData.id
        ) {
          reqData.roleId.splice(j, 1);
          needDelete = 1;

          break;
        } else if (
          existingServiceAccessRoles[i].role_id == reqData.roleId[j] &&
          existingServiceAccessRoles[i].service_id != reqData.id
        ) {
          reqData.roleId.splice(j, 1);
          needDelete = 1;

          //let update service id
          let updateServiceId = await serviceAccessRolesModel.updateServiceId(
            existingServiceAccessRoles[i].id,
            reqData.id
          );

          break;
        }
      }

      if (needDelete == 0) {
        // let update service id
        //let updateServiceId = await serviceAccessRolesModel.updateServiceId( existingServiceAccessRoles[i].id,reqData.priority);

        let makeDelete = await serviceAccessRolesModel.deleteServiceAccessId(
          existingServiceAccessRoles[i].id,
          reqData.updated_by,
          reqData.updated_at
        );
        if (
          makeDelete.affectedRows == undefined ||
          makeDelete.affectedRows < 1
        ) {
          return res.status(500).send({
            success: true,
            status: 500,
            message: "Something Wrong in system database.",
          });
        }
      }
    }

    let newServiceAccessRoles = {
      service_id: reqData.id,
      role_id: reqData.roleId,
      created_by: req.decoded.userInfo.id,
      updated_by: req.decoded.userInfo.id,
      created_at: await commonObject.getGMT(),
      updated_at: await commonObject.getGMT(),
    };
    for (let i = 0; i < reqData.roleId.length; i++) {
      newServiceAccessRoles.role_id = reqData.roleId[i];
      let finalResult = await serviceAccessRolesModel.addNewServiceAccessRoles(
        newServiceAccessRoles
      );

      if (
        finalResult.affectedRows == undefined ||
        finalResult.affectedRows < 1
      ) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Service Updated Successfully.",
    });
  }
);

router.delete(
  "/delete",
  [verifyToken, routeAccessChecker("serviceDelete")],
  async (req, res) => {
    let reqData = {
      id: req.body.id,
    };

    reqData.updated_by = req.decoded.userInfo.id;
    reqData.updated_at = await commonObject.getGMT();

    let validateId = await commonObject.checkItsNumber(reqData.id);

    if (validateId.success === false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Value should be integer.",
      });
    }

    reqData.id = validateId.data;

    let existingDataById = await serviceModel.getServiceById(reqData.id);

    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    reqData.id = existingDataById[0].id;  // they request by Priority; and we have to get id from existing data and set it to reqData.id


    let result = await serviceModel.deleteServiceById(
      reqData.updated_by,
      reqData.updated_at,
      reqData.id
    );

    if (result.affectedRows == undefined || result.affectedRows == 0) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    // service access disable

    let existingServiceAccessRoles =
      await serviceAccessRolesModel.getAccessListByServiceId(
        reqData.id
      );

    for (let i = 0; i < existingServiceAccessRoles.length; i++) {
      let makeDisable = await serviceAccessRolesModel.deleteServiceAccessId(
        existingServiceAccessRoles[i].id,
        reqData.updated_by,
        reqData.updated_at
      );
      if (
        makeDisable.affectedRows == undefined ||
        makeDisable.affectedRows < 1
      ) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Service Deleted Successfully.",
    });
  }
);

router.put(
  "/changeServiceStatus",
  [verifyToken, routeAccessChecker("changeServiceStatus")],
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
    }

    reqData.id = validateId.data;

    let existingDataById = await serviceModel.getServiceById(reqData.id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    reqData.id = existingDataById[0].id;

    if (
      existingDataById[0].status === 1 &&
      existingDataById[0].active_status === 1
    ) {
      let result = await serviceModel.disableServiceById(
        reqData.updated_by,
        reqData.updated_at,
        reqData.id
      );

      if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
          success: false,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }

      // service access disable

      let existingServiceAccessRoles =
        await serviceAccessRolesModel.getAccessListByServiceId(reqData.id);

      for (let i = 0; i < existingServiceAccessRoles.length; i++) {
        if (
          existingServiceAccessRoles[i].status == 1 &&
          existingServiceAccessRoles[i].active_status == 1
        ) {
          let makeDisable =
            await serviceAccessRolesModel.disableServiceAccessId(
              existingServiceAccessRoles[i].id,
              reqData.updated_by,
              reqData.updated_at
            );
          if (
            makeDisable.affectedRows == undefined ||
            makeDisable.affectedRows < 1
          ) {
            return res.status(500).send({
              success: true,
              status: 500,
              message: "Something Wrong in system database.",
            });
          }
        }
      }
    } else if (
      existingDataById[0].status === 1 &&
      existingDataById[0].active_status === 0
    ) {
      let result = await serviceModel.enableServiceById(
        reqData.updated_by,
        reqData.updated_at,
        reqData.id
      );

      if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
          success: false,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }

      // service access enable

      let existingServiceAccessRoles =
        await serviceAccessRolesModel.getAccessListByServiceId(reqData.id);

      for (let i = 0; i < existingServiceAccessRoles.length; i++) {
        if (
          existingServiceAccessRoles[i].status == 1 &&
          existingServiceAccessRoles[i].active_status == 0
        ) {
          let makeEnable = await serviceAccessRolesModel.enableServiceAccessId(
            existingServiceAccessRoles[i].id,
            reqData.updated_by,
            reqData.updated_at
          );
          if (
            makeEnable.affectedRows == undefined ||
            makeEnable.affectedRows < 1
          ) {
            return res.status(500).send({
              success: true,
              status: 500,
              message: "Something Wrong in system database.",
            });
          }
        }
      }
    } else {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Service is already disable.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Service Status Changed.",
    });
  }
);

router.get("/*", (req, res) => {
  return res.send({
    status: 400,
    message: "unknown route",
    success: false,
  });
});

router.post("/*", (req, res) => {
  return res.send({
    status: 400,
    message: "unknown route",
    success: false,
  });
});

module.exports = router;
