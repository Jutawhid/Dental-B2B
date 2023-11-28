const fs = require('fs');
const fileUpload = require('express-fileupload');
const encrypt = require('node-file-encrypt');
const isEmpty = require("is-empty");
var path = require("path");
require('dotenv').config();

// 1 KB  = 1024 BYTE 

let uploadFileFormate = [
    {
        fileType: "image",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "gatewayImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.gateway_image_path,
        willEncrypt: false
    },
    {
        fileType: "adminImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.admin_image_path,
        willEncrypt: false
    },
    {
        fileType: "dentistImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "consultantImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "labImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "techImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "labCoverImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "techCoverImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "consultantCoverImage",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png"],
        fileSavePath: process.env.user_profile_image_path,
        willEncrypt: false
    },
    {
        fileType: "file",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["pdf"],
        fileSavePath: process.env.document_file_path,
        willEncrypt: false
    },
    {
        fileType: "caseFile",
        maxSize: 20 * 1024,  //  MB TO KB
        mimetype: ["stl"],
        fileSavePath: process.env.case_file_path,
        willEncrypt: true
    },
    {
        fileType: "TrainingDocument",
        maxSize: 5 * 1024,  //  MB TO KB
        mimetype: ["jpg", "jpeg", "png", "pdf"],
        fileSavePath: process.env.training_file_path,
        willEncrypt: false
    }
]

let uploadFile = async (req, fileTypeObjectName = "image", inputFieldName = "unknown") => {

    return new Promise((resolve, reject) => {

        try {

            // check file is exits or not
            if (isEmpty(req.files) || Object.keys(req.files).length < 1) {
                return resolve({
                    success: false,
                    message: "No files were uploaded."
                });
            }


            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }

            // check input field name in exit or not 
            // if (!req.files.hasOwnProperty(inputFieldName)) {

            if (Object.keys(req.files).indexOf(inputFieldName) == -1) {
                return resolve({
                    success: false,
                    message: "Unknown request field name"
                });
            }



            // upload file location check, mime type and size
            let directory = __dirname.split("Backend");
            let tempMimetype = req.files[inputFieldName].mimetype.split("/");
            tempMimetype = tempMimetype[tempMimetype.length - 1];

            if (tempFileFormate.mimetype.indexOf(tempMimetype) < 0) {
                return resolve({
                    success: false,
                    message: "Invalid file type"
                });

            } else if (tempFileFormate.maxSize < (req.files[inputFieldName].size / 1024)) {
                return resolve({
                    success: false,
                    message: "File size is too large. Max limit is " + (tempFileFormate.maxSize / 1024) + " MB"
                });
            }


            sampleFile = req.files[inputFieldName];
            let newFileName = Date.now() + '-' + sampleFile.name;
            uploadPath = directory[0] + '/Backend/' + tempFileFormate.fileSavePath + newFileName;




            // check folder is exits or not, if not create new folder
            let tempFolderArray = ("Backend/" + tempFileFormate.fileSavePath).split("/");
            let tempDirectoryPath = directory[0] + "/";

            for (let index = 0; index < tempFolderArray.length; index++) {
                tempDirectoryPath += tempFolderArray[index] + "/";

                if (!fs.existsSync(tempDirectoryPath)) {
                    fs.mkdirSync(tempDirectoryPath);
                }
            }

            // move file to upload folder
            sampleFile.mv(uploadPath, async function (err) {
                if (err) {
                    return resolve({
                        success: false,
                        message: err
                    });

                } else {

                    if (tempFileFormate.willEncrypt == true) {

                        let f = new encrypt.FileEncrypt(uploadPath);
                        f.openSourceFile();
                        f.encrypt('111111');


                        encryptPath = f.encryptFilePath;


                        // encryptPath = encryptPath.split("\\");
                        // encryptPath = encryptPath[encryptPath.length - 1];

                        encryptPath = path.basename(encryptPath);



                        // remove uploaded original file
                        await fileRemove(newFileName, fileTypeObjectName);

                        return resolve({
                            success: true,
                            message: "file uploaded successfully",
                            fileName: encryptPath
                        });

                    } else {
                        return resolve({
                            success: true,
                            message: "file uploaded successfully",
                            fileName: newFileName
                        });
                    }
                }
            });

        } catch (error) {
            console.log(error)
            return resolve({
                success: false,
                message: "Catch file not uploaded",
                error: error
            });
        }
    });
}



let fileRemove = async (fileName = "", fileTypeObjectName = "image") => {


    return new Promise((resolve, reject) => {

        try {

            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }


            // upload file location check, mime type and size
            let directory = __dirname.split("Backend");
            let uploadPath = directory[0] + '/Backend/' + tempFileFormate.fileSavePath + fileName;

            // console.log(uploadPath)
            // console.log(fileName)

            fs.chmodSync(directory[0] + '/Backend/' + tempFileFormate.fileSavePath, '0444');
            fs.unlinkSync(uploadPath);

            return resolve({
                success: true,
                message: "file remove successfully done",
                fileName: fileName
            });

        } catch (error) {
            return resolve({
                success: false,
                message: "Catch file not remove.",
                error: error
            });
        }

    });
}



let fileDecrypt = async (fileName = "", fileTypeObjectName = "image") => {

    return new Promise((resolve, reject) => {

        try {

            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }


            // upload file location check, mime type and size
            let directory = __dirname.split("Backend");
            let encryptPath = directory[0] + '/Backend/' + tempFileFormate.fileSavePath + fileName;

            let filePath = directory[0] + '/Backend/' + tempFileFormate.fileSavePath;

            fs.unlink(filePath, function () { });
            f = new encrypt.FileEncrypt(encryptPath);
            f.openSourceFile();
            f.decrypt('111111');

            let decryptFilePath = f.decryptFilePath;
            // let decryptFileName = decryptFilePath.split("\\");
            // decryptFileName = decryptFileName[decryptFileName.length - 1];

            decryptFileName = path.basename(decryptFilePath);

            // console.log(f.decryptFilePath);
            // console.log(f);
            // console.log(decryptFileName);

            // res.download(file)

            return resolve({
                success: true,
                message: "Decrypt successfully done",
                data: {
                    "encrypt_file_name": fileName,
                    "decrypt_file_name": decryptFileName,
                    "decrypt_file_with_image_path": decryptFilePath,
                }
            });

        } catch (error) {
            console.log(error)
            return resolve({
                success: false,
                message: "Catch file not uploaded",
                error: error
            });
        }

    });
}



module.exports = {
    uploadFile,
    fileRemove,
    fileDecrypt
}