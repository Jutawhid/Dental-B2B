require('dotenv').config();
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');


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
const trashModel = require('../models/trash');
const caseFileModel = require('../models/caseFile');
const caseModel = require('../models/case');
const caseMemberModel = require('../models/caseMember');
const caseMemberRequestModel = require('../models/caseMemberRequest');
const userProvideServiceModel = require('../models/userProvideService');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');
const verifyRegistrationRequestToken = require('../middlewares/jwt_verify/verifyRegistrationRequestToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const fileUploaderCommonObject = require('../common/fileUploader');

const commonObject = require('../common/common');
const crypto = require('crypto');
const moment = require("moment");


router.get("/trashList", [verifyToken, routeAccessChecker("trashList")],async (req, res) => {

    let response = [];
   
    let documentFolderPath = `${process.env.backend_url}${process.env.case_file_path_name}`;
    let nowDateTimeGMT = await commonObject.getGMT();

    let trashFileList = await trashModel.getTrashFileListByUserId(req.decoded.userInfo.id,'case_file','mtae_case_files',nowDateTimeGMT);
    
    for(let i = 0; i < trashFileList.length; i++){

        let caseFileDetails = await caseFileModel.getDeletedCaseFileDataById(trashFileList[i].table_id);
        
        trashFileList[i].file_name = caseFileDetails[0].file_original_name;

        let profileDetailsOfCreator = await commonObject.getUserInfoByUserId(caseFileDetails[0].created_by);
        trashFileList[i].uploaded_by = caseFileDetails[0].created_by;
        trashFileList[i].uploaded_by_name = profileDetailsOfCreator.data[0].full_name;

        let profileDetailsOfDeletor = await commonObject.getUserInfoByUserId(caseFileDetails[0].updated_by);
        trashFileList[i].deleted_by = caseFileDetails[0].updated_by;
        trashFileList[i].deleted_by_name = profileDetailsOfDeletor.data[0].full_name;

       
        let caseDetails = await caseModel.getCaseFullDetailsById(caseFileDetails[0].case_id);
        
        trashFileList[i].case_id = caseDetails[0].case_id;

        if(req.decoded.userInfo.role_id == 3){
            trashFileList[i].patient_name = caseDetails[0].patient_name;
            trashFileList[i].patient_name = await commonObject.decodingUsingCrypto(trashFileList[i].patient_name);
        }
    }

    let trashFileResponse = {
        type: "Case File",
        total_count: trashFileList.length,
        folder: documentFolderPath,
        data: trashFileList
    };

    response.push(trashFileResponse);

    if(req.decoded.userInfo.role_id == 3){
        let trashCaseList = await trashModel.getTrashCaseListByUserId(req.decoded.userInfo.id,'case','mtae_cases',nowDateTimeGMT);
        
        for(let i = 0; i < trashCaseList.length; i++){
           
            let caseDetails = await caseModel.getDeletedCaseDetailsById(trashCaseList[i].table_id);
            console.log(caseDetails);
            trashCaseList[i].case_id = caseDetails[0].case_id;
            trashCaseList[i].patient_name = caseDetails[0].patient_name;
            trashCaseList[i].patient_name = await commonObject.decodingUsingCrypto(trashCaseList[i].patient_name);
            
        }

        let trashCaseResponse = {
            type: "Case",
            total_count: trashCaseList.length,
            data: trashCaseList
        };

        response.push(trashCaseResponse);
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Trash List",
        data: response
    });
    
  }
);

router.get("/adminTrashList", [verifyToken, routeAccessChecker("adminTrashList")],async (req, res) => {

    let documentFolderPath = `${process.env.backend_url}${process.env.case_file_path_name}`;
    let nowDateTimeGMT = await commonObject.getGMT();

    let trashFileList = await trashModel.getAllTrashFile('case_file','mtae_case_files',nowDateTimeGMT);
    for(let i = 0; i < trashFileList.length; i++){
        
        let caseFileDetails = await caseFileModel.getDeletedCaseFileDataById(trashFileList[i].table_id);
        trashFileList[i].file_name = caseFileDetails[0].file_original_name;

        let caseDetails = await caseModel.getCaseAllDetailsById(caseFileDetails[0].case_id);
        trashFileList[i].case_id = caseDetails[0].case_id;
        

        let profileDetails = await commonObject.getUserInfoByUserId(trashFileList[i].user_id);
        trashFileList[i].deleted_by = profileDetails.data[0].full_name;
        trashFileList[i].role = profileDetails.data[0].role;
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Training List.",
      count: trashFileList.length,
      folder: documentFolderPath,
      data: trashFileList
    });
  }
);

router.get('/trashFileDownload/:id', [verifyToken, routeAccessChecker("trashFileDownload")], async (req, res) => {

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

  let trashData = await trashModel.getTrashFileById(id);

  if (isEmpty(trashData)) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "Trash File Not Found."
        });
  }

  if(trashData[0].user_id != req.decoded.userInfo.id){
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "You can't access this"
        });
  }

  if (moment(trashData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") < (await commonObject.getGMT())) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This file is expired."
        });
  }

  let deletedCaseFileData = await caseFileModel.getDeletedCaseFileDataById(trashData[0].table_id);

  if (isEmpty(deletedCaseFileData)) {
      return res.status(404)
          .send({
              "success": false,
              "status": 404,
              "message": "Case File Not Found."
          });
  }

//   if(deletedCaseFileData[0].created_by != req.decoded.userInfo.id){
//     return res.status(404)
//         .send({
//             "success": false,
//             "status": 404,
//             "message": "You can't access this."
//         });
//   }

 

//   let caseData = await caseModel.getCaseAllDetailsById(deletedCaseFileData[0].case_id);

//   if (isEmpty(caseData)) {
//       return res.status(404)
//           .send({
//               "success": false,
//               "status": 404,
//               "message": "Case Not Found."
//           });
//   }

  

  let fileUploadCode = await fileUploaderCommonObject.fileDecrypt(deletedCaseFileData[0].file_temp_name, "caseFile");
  console.log(fileUploadCode);

  if (fileUploadCode.success == false) {
      return res.status(200).send({
          "success": false,
          "status": 400,
          "message": fileUploadCode.message,
      });
  } else {

      res.status(200)
          .download(fileUploadCode.data.decrypt_file_with_image_path, fileUploadCode.data.decrypt_file_name, (err) => {

              fs.unlink(fileUploadCode.data.decrypt_file_with_image_path, function (err) {
                  if (err) {
                      console.error(err.toString());
                  } else {
                      console.warn(fileUploadCode.data.decrypt_file_with_image_path + ' deleted');
                  }
              });

          })
  }

});

router.get('/trashFileDownloadByAdmins/:id', [verifyToken, routeAccessChecker("trashFileDownloadByAdmins")], async (req, res) => {

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
  
    let trashData = await trashModel.getTrashFileById(id);
  
    if (isEmpty(trashData)) {
      return res.status(404)
          .send({
              "success": false,
              "status": 404,
              "message": "Trash File Not Found."
          });
    }
  
    if (moment(trashData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") < (await commonObject.getGMT())) {
      return res.status(404)
          .send({
              "success": false,
              "status": 404,
              "message": "This file is expired."
          });
    }
  
    let deletedCaseFileData = await caseFileModel.getDeletedCaseFileDataById(trashData[0].table_id);
  
    if (isEmpty(deletedCaseFileData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case File Not Found."
            });
    }
  
  
    let caseData = await caseModel.getCaseAllDetailsById(deletedCaseFileData[0].case_id);
  
    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }
  
    
  
    let fileUploadCode = await fileUploaderCommonObject.fileDecrypt(deletedCaseFileData[0].file_temp_name, "caseFile");
    console.log(fileUploadCode);
  
    if (fileUploadCode.success == false) {
        return res.status(200).send({
            "success": false,
            "status": 400,
            "message": fileUploadCode.message,
        });
    } else {
  
        res.status(200)
            .download(fileUploadCode.data.decrypt_file_with_image_path, fileUploadCode.data.decrypt_file_name, (err) => {
  
                fs.unlink(fileUploadCode.data.decrypt_file_with_image_path, function (err) {
                    if (err) {
                        console.error(err.toString());
                    } else {
                        console.warn(fileUploadCode.data.decrypt_file_with_image_path + ' deleted');
                    }
                });
  
            })
    }
  
  });

router.post("/restoreTrash", [verifyToken, routeAccessChecker("restoreCaseFile")], async (req, res) => {

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

    // trash file data
    let trashFileData = await trashModel.getTrashFileById(reqData.id);

  if (isEmpty(trashFileData)) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "Trash File Not Found."
        });
  }

  if(trashFileData[0].trash_type != "case_file" && trashFileData[0].table_name != "mtae_case_files"){
    return res.status(404)
    .send({
        "success": false,
        "status": 404,
        "message": "This should be Trash File "
    });
  }

 

  if(trashFileData[0].user_id != req.decoded.userInfo.id){
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "You can't access this"
        });
  }

  if (moment(trashFileData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") < (await commonObject.getGMT())) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This file is expired."
        });
  }

  

  let deletedCaseFileData = await caseFileModel.getDeletedCaseFileDataById(trashFileData[0].table_id);

  if (isEmpty(deletedCaseFileData)) {
      return res.status(404)
          .send({
              "success": false,
              "status": 404,
              "message": "Case File Not Found."
          });
  }

//   if(deletedCaseFileData[0].created_by != req.decoded.userInfo.id){
//     return res.status(404)
//         .send({
//             "success": false,
//             "status": 404,
//             "message": "You can't access this."
//         });
//   }

 

    let caseData = await caseModel.getCaseAllDetailsById(deletedCaseFileData[0].case_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case is already deleted. Please restore it."
            });
    }

    let result = await trashModel.restoreCaseFileById(reqData,deletedCaseFileData[0].id);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something Wrong in system database.",
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case File Restored Successfully.",
    });
}
);

router.post("/restoreTrashByAdmins", [verifyToken, routeAccessChecker("restoreTrashByAdmins")], async (req, res) => {

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

    // trash file data
    let trashFileData = await trashModel.getTrashFileById(reqData.id);

  if (isEmpty(trashFileData)) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "Trash File Not Found."
        });
  }

  if (moment(trashFileData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") < (await commonObject.getGMT())) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This file is expired."
        });
  }

  

  let deletedCaseFileData = await caseFileModel.getDeletedCaseFileDataById(trashFileData[0].table_id);

  if (isEmpty(deletedCaseFileData)) {
      return res.status(404)
          .send({
              "success": false,
              "status": 404,
              "message": "Case File Not Found."
          });
  }

    let caseData = await caseModel.getCaseAllDetailsById(deletedCaseFileData[0].case_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }

 
    let result = await trashModel.restoreCaseFileById(reqData,deletedCaseFileData[0].id);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something Wrong in system database.",
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case File Restored Successfully.",
    });
}
);

router.post("/restoreCase", [verifyToken, routeAccessChecker("restoreCase")], async (req, res) => {

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

    // trash  data
    let trashData = await trashModel.getTrashFileById(reqData.id); // this has used both for case file and case

  if (isEmpty(trashData)) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "Trash  Not Found."
        });
  }

  

  if(trashData[0].trash_type != "case" && trashData[0].table_name != "mtae_cases"){
    return res.status(404)
    .send({
        "success": false,
        "status": 404,
        "message": "This should be Trash Case "
    });
  }

  if(trashData[0].user_id != req.decoded.userInfo.id){
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "You can't access this"
        });
  }

  if (moment(trashData[0].expired_time).format("YYYY-MM-DD HH:mm:ss") < (await commonObject.getGMT())) {
    return res.status(404)
        .send({
            "success": false,
            "status": 404,
            "message": "This file is expired."
        });
  }



    let caseData = await caseModel.getDeletedCaseDetailsById(trashData[0].table_id);

    if (isEmpty(caseData)) {
        return res.status(404)
            .send({
                "success": false,
                "status": 404,
                "message": "Case Not Found."
            });
    }


    let result = await trashModel.restoreCaseById(reqData,trashData[0].table_id);

    if (result.affectedRows == undefined || result.affectedRows == 0) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "Something Wrong in system database.",
        });
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Case Restored Successfully.",
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