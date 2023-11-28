var fs = require("fs");
const isEmpty = require("is-empty");
const moment = require("moment");

const crypto = require("crypto");
const deviceDetector = new (require("node-device-detector"))();
const loginTrackModel = require("../models/loginTrack");
const userModel = require("../models/user");
const superAdminModel = require("../models/superAdmin");
const adminModel = require("../models/admin");
const caseModel = require('../models/case');
const caseMemberModel = require('../models/caseMember');
const dentistModel = require("../models/dentist");
const consultantModel = require("../models/consultant");
const labModel = require("../models/lab");
const techCompanyModel = require("../models/techCompany");
const roleModel = require("../models/role");


let hashingUsingCrypto = async (text = "") => {
  const key = Buffer.from(
    "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
    "base64"
  );

  if (typeof (text) !== "string") text = text.toString();


  const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
  const algorithm = "aes-256-cbc";

  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

let decodingUsingCrypto = async (text = "") => {
  const key = Buffer.from(
    "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
    "base64"
  );
  const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
  const algorithm = "aes-256-cbc";

  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

let characterLimitCheck = async (value = "", modelField = "") => {

  let originalValue = value;
  // remove extra space
  value = value.replace(/\s+/g, " ");
  if (typeof (value) === "string") value = value.trim();

  // unknown space special character remove
  value = value.replace("ㅤ", " ");

  if (isEmpty(value) || value == null || value == undefined) {
    return {
      success: false,
      message: `${modelField} is empty. `,
      data: value,
    };
  }

  let data = [
    {
      modelField: "Service Name",
      maxLength: 40,
      minLength: 2,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Gateway Name",
      maxLength: 40,
      minLength: 2,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "User Name",
      maxLength: 20,
      minLength: 6,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: false,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Password",
      maxLength: 20,
      minLength: 10,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: false,
      isMustUserSpecialCharacter: true,
      isMustUserUpperCharacter: true,
      isMustUserLowerCharacter: true,
      isMustUserNumberCharacter: true,
      minimumNumberCharacter: 2,
    },

    {
      modelField: "First Name",
      maxLength: 50,
      minLength: 3,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Last Name",
      maxLength: 50,
      minLength: 3,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Name",
      maxLength: 50,
      minLength: 3,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Address",
      maxLength: 255,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Provide service description",
      maxLength: -1,
      minLength: 20,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "CasePatientName",
      maxLength: 100,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "CasePatientAddress",
      maxLength: -1,
      minLength: 2,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Training Title",
      maxLength: 50,
      minLength: 2,
      isAllowStartWithNumeric: false,
      isAllowStartWithSpecialCharacter: false,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },

    {
      modelField: "Training Description",
      maxLength: -1,
      minLength: 20,
      isAllowStartWithNumeric: true,
      isAllowStartWithSpecialCharacter: true,
      willItUpperCase: false,
      isAllowSpace: true,
      isMustUserSpecialCharacter: false,
      isMustUserUpperCharacter: false,
      isMustUserLowerCharacter: false,
      isMustUserNumberCharacter: false,
      minimumNumberCharacter: 0
    },
  ];

  let index = await data.find(
    (element) => element.modelField.toUpperCase() == modelField.toUpperCase()
  );

  if (index === undefined) {
    return {
      success: false,
      message: `${modelField} is unknown model field. `,
      data: value,
    };
  } else {
    data = index;
  }

  if (data.isAllowSpace === false) {
    if (originalValue.indexOf(" ") > -1) {
      return {
        success: false,
        message: `Space is not allowed in ${data.modelField}. `,
        data: originalValue,
      };
    }
  }

  if (
    value.length < data.minLength ||
    (value.length > data.maxLength && data.maxLength != -1)
  ) {
    return {
      success: false,
      message: data.maxLength == -1 ? `${data.modelField} Length should be at least ${data.minLength} ` : `${data.modelField} Length should be between ${data.minLength} and ${data.maxLength}. `,
      data: data,
    };
  }

  if (data.isAllowStartWithSpecialCharacter == false) {
    if (
      (value.charCodeAt(0) >= 32 && value.charCodeAt(0) <= 47) ||
      (value.charCodeAt(0) >= 58 && value.charCodeAt(0) <= 64) ||
      (value.charCodeAt(0) >= 91 && value.charCodeAt(0) <= 96) ||
      (value.charCodeAt(0) >= 123 && value.charCodeAt(0) <= 126)
    )
      return {
        success: false,
        message: `${data.modelField} never start with special character. `,
        data: data,
      };
  }

  if (data.isAllowStartWithNumeric == false) {
    if (value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57) {
      return {
        success: false,
        message: `${data.modelField} never start with number. `,
        data: data,
      };
    }
  }

  if (data.willItUpperCase == true) {
    let tempData = "";

    for (let j = 0; j < value.length; j++) {
      if (
        (value.charCodeAt(j) >= 65 && value.charCodeAt(j) <= 90) ||
        (value.charCodeAt(j) >= 97 && value.charCodeAt(j) <= 122)
      )
        tempData += value[j].toUpperCase();
      else tempData += value[j];
    }

    value = tempData;
  }


  // minimum character type check
  let totalUpperCharacter = 0,
    totalLowerCharacter = 0,
    totalNumberCharacter = 0,
    totalSpecialCharacter = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "A" && value[i] <= "Z") totalUpperCharacter++;
    else if (value[i] >= "a" && value[i] <= "z") totalLowerCharacter++;
    else if (value[i] >= "0" && value[i] <= "9") totalNumberCharacter++;
    else totalSpecialCharacter++;
  }


  if (data.isMustUserSpecialCharacter === true && totalSpecialCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have special character. `,
      data: data,
    };
  }


  if (data.isMustUserUpperCharacter === true && totalUpperCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have upper character. `,
      data: data,
    };
  }


  if (data.isMustUserLowerCharacter === true && totalLowerCharacter == 0) {
    return {
      success: false,
      message: `${data.modelField} must have lower character. `,
      data: data,
    };
  }


  if (data.isMustUserNumberCharacter === true && totalNumberCharacter < data.minimumNumberCharacter) {
    return {
      success: false,
      message: `${data.modelField} must have use ${data.minimumNumberCharacter} number character. `,
      data: data,
    };
  }


  return {
    success: true,
    message: "",
    data: value,
  };
};



let getGMT = async (dateTime = undefined) => {
  let currentGMT = "";
  if (dateTime === undefined) {
    currentGMT = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  }
  else {
    currentGMT = moment(dateTime, "YYYY-MM-DD HH:mm:ss").utc().format("YYYY-MM-DD HH:mm:ss");
  }
  return currentGMT;
};

let addFiveMinuteToGMT = async () => {
  let fiveMinuteToGMT = moment()
    .utc()
    .add(5, "minutes")
    .format("YYYY-MM-DD HH:mm:ss");

  return fiveMinuteToGMT;
};



let getCustomDateTime = async (
  date = "20/12/2012",
  extraDay = 0,
  extraMonth = 0,
  extraYear = 0,
  extraMinutes = 0
) => {
  try {

    let customDate = new Date(date);
    customDate.setMinutes(customDate.getMinutes() + extraMinutes);
    customDate.setDate(customDate.getDate() + extraDay);
    customDate.setMonth(customDate.getMonth() + extraMonth);
    customDate.setFullYear(customDate.getFullYear() + extraYear);

    date = customDate.getFullYear() +
      "-" +
      ("00" + (customDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + customDate.getDate()).slice(-2) +
      (" " + customDate.getHours()) +
      (":" + customDate.getMinutes()) +
      (":" + customDate.getSeconds());

    return date;
  } catch (error) {
    console.log("sssssssssss")
    return await getTodayDate();
  }
};



let addTwentyFourHourToGMT = async () => {
  let twentyFourHourToGMT = moment()
    .utc()
    .add(1440, "minutes")
    .format("YYYY-MM-DD HH:mm:ss");

  return twentyFourHourToGMT;
};

let getTodayDate = async () => {
  let date = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    })
  );

  let toDayDate =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2);

  return toDayDate;
};

let getCustomDate = async (
  date = "20/12/2012",
  extraDay = 0,
  extraMonth = 0,
  extraYear = 0
) => {
  try {
    let customDate = new Date(date);
    customDate.setDate(customDate.getDate() + extraDay);
    customDate.setMonth(customDate.getMonth() + extraMonth);
    customDate.setFullYear(customDate.getFullYear() + extraYear);

    date =
      customDate.getFullYear() +
      "-" +
      ("00" + (customDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + customDate.getDate()).slice(-2);
    return date;
  } catch (error) {
    return await getTodayDate();
  }
};

let getMonthLastDate = async (date = "2012-12-12") => {
  // give a date and generate last date of this month
  try {
    let customDate = new Date(date);
    customDate.setDate(1);
    customDate.setMonth(customDate.getMonth() + 1);
    customDate.setDate(customDate.getDate() - 1);

    date =
      customDate.getFullYear() +
      "-" +
      ("00" + (customDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + customDate.getDate()).slice(-2);

    return date;
  } catch (error) {
    return await getTodayDate();
  }
};

let compareTwoDate = async (
  date1 = "2012-12-12",
  date2 = "2012-12-1",
  want_true_false = true
) => {
  // give if true if last day is getter then or equal 2

  try {
  

    const fast_date = moment(date1); // format the data and convert ISO Format
    const last_date = moment(date2);
    const duration = moment.duration(fast_date.diff(last_date));

    const days = {
      "days" : duration.asDays(),
      "hours": duration.asHours()
    };
   
    
    if (want_true_false === true) {
      return days > -1 ? true : false;
    } else {
      return days;
    }
  } catch (error) {
    return 0;
  }
};

let checkItsNumber = async (value) => {
  let result = {
    success: false,
    data: value,
  };

  try {
    if (typeof value === "string") {
      result.data = parseInt(value);
    }

    if (
      !isNaN(value) ||
      (value !== "" && value !== null && value !== undefined)
    ) {
      if (
        (typeof value === "number" && value >= 0) ||
        (typeof value === "string" && value == parseInt(value))
      ) {
        result.success = true;
      }
    }
  } catch (error) { }

  //console.log(result);
  return result;
};

// image file validate
let imageFileValidate = async (photo) => {
  $result = false;
  try {
    if (
      file.split(".").pop() == "jpg" ||
      file.split(".").pop() == "jpeg" ||
      file.split(".").pop() == "png" ||
      file.split(".").pop() == "JPG" ||
      file.split(".").pop() == "JPEG" ||
      file.split(".").pop() == "PNG"
    ) {
      if (
        photo.mimetype === "image/jpg" ||
        photo.mimetype === "image/jpeg" ||
        photo.mimetype === "image/png"
      ) {
        $result = true;
      }
    }
  } catch (error) {
    $result = false;
  }

  return $result;
};

// image size validate

let checkImageSize = async (file) => {
  $result = false;
  try {
    // check file size in mega bytes
    if (file.size / 1048576 <= 10) {
      $result = true;
    }
  } catch (error) {
    $result = false;
  }

  return $result;
};

// document file validate
let documentFileValidate = async (file) => {
  $result = false;
  try {
    if (file.split(".").pop() == "pdf" || file.split(".").pop() == "PDF") {
      if (file.mimetype === "application/pdf") {
        $result = true;
      }
    }
  } catch (error) {
    $result = false;
  }

  return $result;
};

// document size validate

let checkDocumentSize = async (file) => {
  $result = false;
  try {
    // check file size in mega bytes
    if (file.size / 1048576000 <= 100) {
      $result = true;
    }
  } catch (error) {
    $result = false;
  }

  return $result;
};

// US phone number validation
let isValidPhoneNumberOfUS = async (phoneNumber) => {
  //   Valid formats:

  // (123) 456-7890
  // (123)456-7890
  // 123-456-7890
  // 123.456.7890
  // 1234567890
  // +31636363634
  // 075-63546725

  var phoneNumberPattern =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  //console.log(phoneNumberPattern.test(phoneNumber));
  return phoneNumberPattern.test(phoneNumber);
};

// NPI validation
let isValidNPI = (value = 125) => {
  if (typeof value !== "string") {
    value = value.toString();
  }

  //  Valid Numbers:
  // 1467586115
  // 1134296023
  // 1245319599
  // 1346336807

  //  our doctor
  // 1346572336  1346572336
  // 1992348650
  // 1003312901

  let result = false;
  var checksum80840 = 24; // 80 indicates health applications and 840 indicates the United States
  var checksum = checksum80840;

  try {
    let tempValue = parseInt(value);
    tempValue = tempValue.toString();

    if (tempValue.length != value.length) return false;
  } catch {
    return false;
  }

  var digits = value.toString().split("");
  console.log(digits);
  var digit;
  var checksum_roundup;

  if (digits.length != 10) result = false;

  for (
    let digit_position = 0;
    digit_position < digits.length - 1;
    digit_position++
  ) {
    digit = parseInt(digits[digit_position]);

    if (digit_position % 2 === 0)
      (digit * 2)
        .toString()
        .split("")
        .forEach(function (element, index, array) {
          checksum += parseInt(element);
        });
    else checksum += digit;
  }

  checksum_roundup = parseInt(checksum / 10);

  if (checksum % 10 > 0) checksum_roundup += 1;
  checksum_roundup *= 10;

  if (checksum_roundup - checksum === parseInt(digits[9])) result = true;
  else result = false;

  return result;
};

let duplicateCheckInArray = async (arrayData = []) => {
  let duplicate = arrayData.some((element, index) => {
    return arrayData.indexOf(element) !== index;
  });

  if (duplicate) {
    return {
      result: true,
      message: "Duplicate value found.",
    };
  } else
    return {
      result: false,
      message: "Duplicate value not found.",
    };
};

// US fax validation
let isValidFaxOfUS = async (fax) => {
  //   Valid formats:

  //+12345678910

  var numberPattern = /\+1[2-9][0-9]{9}/;

  return numberPattern.test(fax);
};

// email validation
let isValidEmail = async (email) => {
  var pattern = /\S+@\S+\.\S+/;

  return pattern.test(email);
};

let getUserDeviceInfo = async (req) => {
  // header info get device info
  try {
    const useragent = req.headers["user-agent"];
    let userDeviceInfo = deviceDetector.detect(useragent);

    let deviceInfo = {
      useragent: useragent,
      "os-name": userDeviceInfo.os.hasOwnProperty("name")
        ? userDeviceInfo.os.name
        : "",
      "os-short-name": userDeviceInfo.os.hasOwnProperty("short_name")
        ? userDeviceInfo.os.short_name
        : "",
      "os-family": userDeviceInfo.os.hasOwnProperty("family")
        ? userDeviceInfo.os.family
        : "",
      "client-type": userDeviceInfo.client.hasOwnProperty("type")
        ? userDeviceInfo.client.type
        : "",
      "client-name": userDeviceInfo.client.hasOwnProperty("name")
        ? userDeviceInfo.client.name
        : "",
      "client-short-name": userDeviceInfo.client.hasOwnProperty("short_name")
        ? userDeviceInfo.client.short_name
        : "",
      "client-version": userDeviceInfo.client.hasOwnProperty("version")
        ? userDeviceInfo.client.version
        : "",
      "device-id": userDeviceInfo.device.hasOwnProperty("id")
        ? userDeviceInfo.device.id
        : "",
      "device-type": userDeviceInfo.device.hasOwnProperty("type")
        ? userDeviceInfo.device.type
        : "",
      "device-brand": userDeviceInfo.device.hasOwnProperty("brand")
        ? userDeviceInfo.device.brand
        : "",
      "device-model": userDeviceInfo.device.hasOwnProperty("model")
        ? userDeviceInfo.device.model
        : "",
    };

    return deviceInfo;
  } catch (error) {
    return {};
  }
};

let compareDeviceInfo = async (req = {}, uuid = "") => {
  // header info get device info
  try {
    // first we get user device info, using  uuid get logged in user device info from db for ,
    // then match data, and catch

    let requestDeviceInfo = await getUserDeviceInfo(req);
    let loginDeviceInfo = await loginTrackModel.getLoggingTrackerByUUID(uuid);

    if (isEmpty(loginDeviceInfo)) {
      return false;
    } else {
      let loginDevice = JSON.parse(loginDeviceInfo[0].login_device_info);
      let objectKeys = Object.keys(requestDeviceInfo);

      for (let index = 0; index < objectKeys.length; index++) {
        if (
          requestDeviceInfo[objectKeys[index]] != loginDevice[objectKeys[index]]
        ) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

// OTP generate code
let generateOTP = async () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


let checkUserAccessInThisCase = async (userId = 0, caseId = 0,) => {

  let accessResult = await caseMemberModel.getCaseMemberInfoByCaseIdAndUserId(caseId, userId);

  if (isEmpty(accessResult)) {
    return { "success": false, "message": "", "data": {} };
  } else {
    return { "success": true, "message": "", "data": accessResult };
  }

};

let getPermissionListForSendRequestOrRecommend = async (roleList = []) => {
  // if you give role list, then you get what type of permission need to send request to this role type user
  // get which type of permission need this user (login) for send service request by role user

  
  let userAddingPermission = [];

  if (roleList.indexOf(4) != -1) {
    userAddingPermission.push("sendRequestForConsultant");
  } 

   if (roleList.indexOf(5) != -1) {
    userAddingPermission.push("sendRequestForLab");
  } 

   if (roleList.indexOf(6) != -1) {
    userAddingPermission.push("sendRequestForTech");
  }
  return userAddingPermission;
}


let getPermissionListForSendRequestDirectly = async (roleList = []) => {
 // roleList = 
  // if you give role list, then you get what type of permission need to send request directly to this role type user

  let userAddingPermission = "can't-sent-request";
  console.log(roleList.indexOf(6));
  if (roleList.indexOf(6) != -1) {
    userAddingPermission = "sendRequestForTechDirect";
  }

  return userAddingPermission;

}

let getUserInfoByUserId = async (userId = 0) => {

  let userDetails = await userModel.getUserById(userId);

  if (isEmpty(userDetails)) {
    return { "success": false, "message": "No Data found", "data": {} };
  }

  let profileInfo = [];
  let role;

  if (userDetails[0].role_id === 1) {
    
    profileInfo = await superAdminModel.getSuperAdminById(userDetails[0].profile_id);
    profileInfo[0].role = "Super Admin";
    profileInfo[0].role_id = 1;

  } else if (userDetails[0].role_id === 2) {
    profileInfo = await adminModel.getAdminById(userDetails[0].profile_id);
    profileInfo[0].role = "Admin";
    profileInfo[0].role_id = 2;

  } else if (userDetails[0].role_id === 3) {
    profileInfo = await dentistModel.getDentistById(userDetails[0].profile_id);
    profileInfo[0].role = "Dentist";
    profileInfo[0].role_id = 3;

  } else if (userDetails[0].role_id === 4) {
    profileInfo = await consultantModel.getConsultantById(userDetails[0].profile_id);
    profileInfo[0].role = "Consultant";
    profileInfo[0].role_id = 4;

  } else if (userDetails[0].role_id === 5) {
    profileInfo = await labModel.getLabById(userDetails[0].profile_id);
    profileInfo[0].role = "Lab";
    profileInfo[0].role_id = 5;


  } else if (userDetails[0].role_id === 6) {
    profileInfo = await techCompanyModel.getTechCompanyById(userDetails[0].profile_id);
    profileInfo[0].role = "Tech Company";
    profileInfo[0].role_id = 6;


  }

  if (isEmpty(profileInfo)) {
    return { "success": false, "message": "", "data": {} };
  } else {
    if (userDetails[0].role_id === 1 || userDetails[0].role_id === 2 || userDetails[0].role_id === 3 || userDetails[0].role_id === 4) {

      profileInfo[0].full_name = profileInfo[0].first_name + " " + profileInfo[0].last_name;

    } else if (userDetails[0].role_id === 5 || userDetails[0].role_id === 6) {

      profileInfo[0].full_name = profileInfo[0].name;
    }
    return { "success": true, "message": "Data Found", "data": profileInfo};
  }
};


let accessPermissionChecker = async (req, permissionName = "") => {

  if (req.decoded.permissions.indexOf(permissionName) !== -1)
    return true;
  else
    return false;
}

let getCaseMembersUserIds = async (caseId = 0) => {

   let caseDetails = await caseModel.getCaseById(caseId);

  if (isEmpty(caseDetails)) {
    return { "success": false, "message": "No case found", "data": []};
  }

  let caseCreatorDetails = await getUserInfoByUserId(caseDetails[0].created_by);

  let members = [];
    members.push({
      "user_id": caseDetails[0].created_by,
      "role_id": caseCreatorDetails.data[0].role_id,
    })

  let caseMembers = await caseMemberModel.getRunningCaseMemberListByCaseId(caseId);

  for(let i = 0; i < caseMembers.length; i++){
    let memberDetails = await getUserInfoByUserId(caseMembers[i].user_id);
    members.push({
      "user_id": caseMembers[i].user_id,
      "role_id": memberDetails.data[0].role_id,
    })
  }

  if(isEmpty(members)){
    return { "success": true, "message": "No Member in this case", "data": members};
  }

    return { "success": true, "message": "Data Found", "data": members};
  
};

module.exports = {
  hashingUsingCrypto,
  decodingUsingCrypto,
  characterLimitCheck,
  getTodayDate,
  getCustomDate,
  getCustomDateTime,
  getMonthLastDate,
  compareTwoDate,
  checkItsNumber,
  imageFileValidate,
  checkImageSize,
  documentFileValidate,
  checkDocumentSize,
  isValidPhoneNumberOfUS,
  isValidNPI,
  getGMT,
  addFiveMinuteToGMT,
  addTwentyFourHourToGMT,
  isValidFaxOfUS,
  isValidEmail,
  getUserDeviceInfo,
  compareDeviceInfo,
  duplicateCheckInArray,
  generateOTP,
  checkUserAccessInThisCase,
  getPermissionListForSendRequestDirectly,
  getPermissionListForSendRequestOrRecommend,
  getUserInfoByUserId,
  accessPermissionChecker,
  getCaseMembersUserIds
};
