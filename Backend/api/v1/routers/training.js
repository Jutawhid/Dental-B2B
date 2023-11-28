require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const zipModel = require('../models/zip');
const userModel = require('../models/user');
const superAdminModel = require('../models/superAdmin');
const adminModel = require('../models/admin');
const dentistModel = require('../models/dentist');
const consultantModel = require('../models/consultant');
const labModel = require('../models/lab');
const techCompanyModel = require('../models/techCompany');
const roleModel = require('../models/role');
const favoriteModel = require('../models/favorite');
const trainingModel = require('../models/training');
const trainingDocumentModel = require('../models/trainingDocument');
const userProvideServiceModel = require('../models/userProvideService');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const fileUploaderCommonObject = require('../common/fileUploader');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");


router.get("/list", [verifyToken, routeAccessChecker("trainingList")],

  async (req, res) => {

    let documentFolderPath = `${process.env.backend_url}${process.env.training_file_path_name}`;

    let result = await trainingModel.getTrainingListByUserId(req.decoded.userInfo.id);

    for (let i = 0; i < result.length; i++) {

      result[i].document = await trainingDocumentModel.getDocumentListByTrainingId(result[i].id);

    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Training List.",
      count: result.length,
      folder: documentFolderPath,
      data: result,
    });
  }
);



router.post('/add', [verifyToken, routeAccessChecker("trainingAdd")], async (req, res) => {


  if (req.decoded.userInfo.role_id !== 5 && req.decoded.userInfo.role_id !== 6) {
    return res.status(200).send({
      "success": false,
      "status": 200,
      "message": "Only Lab and Tech Company can add training.",
      "data": {}
    });
  }

  let reqData = {
    "title": req.body.title,
    "description": req.body.description,
  }

  reqData.created_by = req.decoded.userInfo.id;
  reqData.updated_by = req.decoded.userInfo.id;
  reqData.created_at = await commonObject.getGMT();
  reqData.updated_at = await commonObject.getGMT();
  reqData.user_id = req.decoded.userInfo.id;

  let errorMessage = "";
  let isError = 0;


  // title validate
  let validateTrainingTitle = await commonObject.characterLimitCheck(reqData.title, "Training Title");

  if (validateTrainingTitle.success == false) {
    isError = 1;
    errorMessage += validateTrainingTitle.message;
  } else {
    reqData.title = validateTrainingTitle.data;
  }


  // description validate
  let validateTrainingDescription = await commonObject.characterLimitCheck(reqData.description, "Training Description");

  if (validateTrainingDescription.success == false) {
    isError = 1;
    errorMessage += validateTrainingDescription.message;
  } else {
    reqData.description = validateTrainingDescription.data;
  }

  let existingData = await trainingModel.getTrainingByName(req.decoded.userInfo.id, reqData.title);

  if (!isEmpty(existingData)) {
    isError = 1;
    errorMessage += "This training already exists";

  }

  if (isError == 1) {
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message": errorMessage
    });
  }

  // image code
  if (req.files && Object.keys(req.files).length > 0) {

    if (req.files.document) {

      let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "TrainingDocument", "document");
      if (fileUploadCode.success == false) {
        return res.status(200).send({
          "success": false,
          "status": 400,
          "message": fileUploadCode.message,
        });
      }

      console.log(fileUploadCode)

      reqData.file_original_name = req.files.document.name;
      reqData.document = fileUploadCode.fileName;
    }

  }

  let result = await trainingModel.addNewTraining(reqData);

  if (result.affectedRows == undefined || result.affectedRows < 1) {
    return res.status(500).send({
      "success": false,
      "status": 500,
      "message": "Something Wrong in system database."
    });
  }

  return res.status(201).send({
    "success": true,
    "status": 201,
    "message": "Training Added Successfully."
  });

});

router.put('/update', [verifyToken, routeAccessChecker("trainingUpdate")], async (req, res) => {


  if (req.decoded.userInfo.role_id !== 5 && req.decoded.userInfo.role_id !== 6) {
    return res.status(200).send({
      "success": false,
      "status": 200,
      "message": "Only Lab and Tech Company can add training."
    });
  }

  let updateRequestData = {
    "id": req.body.id,
    "title": req.body.title,
    "description": req.body.description,
  }

  let validateId = await commonObject.checkItsNumber(updateRequestData.id);

  if (validateId.success === false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Value should be integer.",
    });
  }

  updateRequestData.id = validateId.data;

  let existingDataById = await trainingModel.getTrainingById(updateRequestData.id);

  if (isEmpty(existingDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "No data found",
    });
  }

  if (existingDataById[0].user_id !== req.decoded.userInfo.id) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "This is not your training.",
    });
  }

  // check this training has any document or not
  let existingDocuments = await trainingDocumentModel.getDocumentListByTrainingId(updateRequestData.id);

  let totalDocument = 0;
  if (!isEmpty(existingDocuments)) {

    totalDocument = existingDocuments.length;
  }

  // remove previous documents
  let previousFiles = [];
  if (totalDocument > 0) {
    for (let i = 0; i < totalDocument; i++) {
      previousFiles[i] = existingDocuments[i].file_temp_name;
    }
  }


  updateRequestData.id = existingDataById[0].id;


  let updateData = {};
  let updateDocumentData = {};

  let errorMessage = "";
  let isError = 0; // 1 = yes, 0 = no
  let willWeUpdate = 0; // 1 = yes , 0 = no;

  // title validate
  let validateTrainingTitle = await commonObject.characterLimitCheck(updateRequestData.title, "Training Title");

  if (validateTrainingTitle.success == false) {
    isError = 1;
    errorMessage += validateTrainingTitle.message;
  } else {
    updateRequestData.title = validateTrainingTitle.data;
  }


  // description validate
  let validateTrainingDescription = await commonObject.characterLimitCheck(updateRequestData.description, "Training Description");

  if (validateTrainingDescription.success == false) {
    isError = 1;
    errorMessage += validateTrainingDescription.message;
  } else {
    updateRequestData.description = validateTrainingDescription.data;
  }

  // check already exist or not by title
  let existingData = await trainingModel.getTrainingByName(req.decoded.userInfo.id, updateRequestData.title);

  if (!isEmpty(existingData) && existingData[0].id !== updateRequestData.id) {
    isError = 1;
    errorMessage += "This training already exists";

  }

  if (existingDataById[0].title !== updateRequestData.title) {
    willWeUpdate = 1;
    updateData.title = updateRequestData.title;
  }

  if (existingDataById[0].description !== updateRequestData.description) {
    willWeUpdate = 1;
    updateData.description = updateRequestData.description;
  }



  // image code
  if (req.files && Object.keys(req.files).length > 0) {

    if (req.files.document) {

      //if(existingDataById[0].file_original_name !== req.files.document.name){
      let fileUploadCode = await fileUploaderCommonObject.uploadFile(req, "TrainingDocument", "document");
      if (fileUploadCode.success == false) {
        return res.status(200).send({
          "success": false,
          "status": 400,
          "message": fileUploadCode.message,
        });
      }

      willWeUpdate = 1;
      updateRequestData.file_original_name = req.files.document.name;
      updateRequestData.document = fileUploadCode.fileName;

      updateDocumentData.file_original_name = updateRequestData.file_original_name;
      updateDocumentData.file_temp_name = updateRequestData.document;
      //}
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

    if (!isEmpty(updateDocumentData)) {
      updateDocumentData.updated_by = req.decoded.userInfo.id;
      updateDocumentData.updated_at = await commonObject.getGMT();
    }

    let result = await trainingModel.updateTraining(updateRequestData.id, updateData, updateDocumentData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        "success": false,
        "status": 500,
        "message": "Something Wrong in system database."
      });
    }


    // remove previous documents
    if (req.files && Object.keys(req.files).length > 0) {
      if (req.files.document) {
        if (previousFiles.length > 0) {
          for (let i = 0; i < previousFiles.length; i++) {
            fileDelete = await fileUploaderCommonObject.fileRemove(previousFiles[i], "TrainingDocument");
          }
        }
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Training successfully updated.",
    });
  } else {
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Nothing to update.",
    });
  }


});

router.delete("/delete", [verifyToken, routeAccessChecker("trainingDelete")], async (req, res) => {

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

  let existingDataById = await trainingModel.getTrainingById(reqData.id);

  if (isEmpty(existingDataById)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "No data found",
    });
  }

  if (existingDataById[0].user_id !== req.decoded.userInfo.id) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "This is not your training.",
    });
  }

  // check this training has any document or not
  let existingDocuments = await trainingDocumentModel.getDocumentListByTrainingId(reqData.id);

  let totalDocument = 0;
  if (!isEmpty(existingDocuments)) {

    totalDocument = existingDocuments.length;
  }

  reqData.id = existingDataById[0].id;

  let result = await trainingModel.deleteTrainingById(reqData.updated_by, reqData.updated_at, reqData.id, totalDocument);

  if (result.affectedRows == undefined || result.affectedRows == 0) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Something Wrong in system database.",
    });
  }

  if (totalDocument > 0) {
    for (let i = 0; i < totalDocument; i++) {
      fileDelete = await fileUploaderCommonObject.fileRemove(existingDocuments[i].file_temp_name, "TrainingDocument");
    }
  }

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Service Deleted Successfully.",
  });
}
);




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