let adminPermission = [
    "test", "test2",
    "adminList", "allUserList", "nextUserList", "userDetails", "allUserListWithoutLimit","adminProfileDetails",
    "adminProfileUpdate",
    "serviceDetails", "serviceList", "gatewayDetails",
    "featureUserList", "featureUserAdd", "changeFeatureUserStatus", "featureUserDelete", "changeFeatureUserSerial",
    "emailChangeRequest", "emailChangeSubmit",
    "case-list-for-admin", "case-list-for-admin-with-limit", "nextCaseListForAdmin", "caseDetails", "caseDetailsViewForAdministration",
    "caseTypeList","caseFileDownload",
    "invoiceListForAdmins","invoiceDetailsForAdmin",
    "trashList","trashFileDownload","restoreCaseFile","adminTrashList","trashFileDownloadByAdmins","restoreTrashByAdmins",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "canceled-case-member-list", "payment-short-summary"
    
];

let superAdminPermission = [
    "serviceList", "serviceAdd", "serviceUpdate", "serviceDelete", "changeServiceStatus", "serviceDetails",
    "gatewayList", "gatewayAdd", "gatewayUpdate", "gatewayDelete", "changeGatewayStatus", "gatewayDetails",
    "adminRegistration", "adminResetPassword", "changeAdminStatus", "adminList","adminProfileDetails",
    "allUserList", "nextUserList", "allUserListWithoutLimit", "userDetails", "changeUserStatus", "deleteOtherUser",
    "featureUserList", "featureUserAdd", "changeFeatureUserStatus", "featureUserDelete", "changeFeatureUserSerial",
    "emailChangeRequest", "emailChangeSubmit",
    "case-list-for-admin", "case-list-for-admin-with-limit", "nextCaseListForAdmin", "caseDetails", "caseDetailsViewForAdministration",
    "caseTypeList","caseFileDownload",
    "trashList","trashFileDownload","restoreCaseFile","adminTrashList","trashFileDownloadByAdmins","restoreTrashByAdmins",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "canceled-case-member-list", "payment-short-summary"
];

let dentistPermission = [
    "serviceList","userProfileUpdate", "emailChangeRequest", "emailChangeSubmit", "profileDetailsForRegularUser","adminProfileDetails",
    "addToFavorite", "removeFromFavorite", "favoriteList", "nextFavList", "allFavoriteList",
    "caseList", "caseListWithLimit", "nextCaseListWithLimit", "caseAdd", "caseUpdate", "caseDetails", "caseFileUpload", "caseFileDownload",
    "changeCaseStatus", "caseFileDelete", "caseDelete", "cancelMySendRequest","caseTypeList",
    "sendRequest", "sendRequestForConsultant", "sendRequestForLab", "sendRequestForTech", "mySendRequestList",
    "responseForRecommend", "recommendListForCase",
    "userListForAddService",
    "homeExploreList", "homeExploreListWithoutLimit",
    "addCardRecord","updateCardRecord","cardList","defaultCard","addMoneyToWallet","deleteCard","currentWalletBalance","withdrawMoney",
    "trashList","trashFileDownload","restoreCaseFile", "restoreCase",
    "casePayablePaymentList", "paymentPayToServiceHolder","completeList","casePaymentHistory",
    "invoiceList","invoiceDetails","completedCaseList",
    "featureUserList",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "addStripeRecord", "updateMyStripeAccountStatus","addMoneyToWalletByStripe","stripeAccountStatus",
];

let consultantPermission = [
    "serviceList","userProfileUpdate", "emailChangeRequest", "emailChangeSubmit", "profileDetailsForRegularUser","adminProfileDetails",
    "myProvideServiceList", "formDataForAddService", "myProvideServiceNewAdd", "myServiceUpdate", "myProvideServiceDelete",
    "addToFavorite", "removeFromFavorite", "favoriteList", "nextFavList", "allFavoriteList",
    "userListForAddService",
    "caseList", "caseListWithLimit", "nextCaseListWithLimit", "caseDetails",
    "sendRequest", "sendRequestForLab", "sendRequestForTech", "myRequestList", "responseForMyRequest", "mySendRecommendList",
    "cancelMySendRecommendList", "changeMyCaseServiceStatus","caseTypeList",
    "homeExploreList", "homeExploreListWithoutLimit", "caseFileUpload", "caseFileDownload", "caseFileDelete", "caseDelete",
    "addCardRecord","updateCardRecord","cardList","defaultCard","deleteCard","currentWalletBalance","withdrawMoney",
    "invoiceList","invoiceDetails","completedCaseList",
    "trashList","trashFileDownload","restoreCaseFile",
    "featureUserList",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "addStripeRecord", "updateMyStripeAccountStatus","addMoneyToWalletByStripe","stripeAccountStatus",

];

let labPermission = [
    "serviceList","userProfileUpdate", "emailChangeRequest", "emailChangeSubmit", "profileDetailsForRegularUser","adminProfileDetails",
    "myProvideServiceList", "formDataForAddService", "myProvideServiceNewAdd", "myServiceUpdate", "myProvideServiceDelete",
    "addToFavorite", "removeFromFavorite", "favoriteList", "nextFavList", "allFavoriteList",
    "trainingAdd", "trainingList", "trainingDelete", "trainingUpdate",
    "caseList", "caseListWithLimit", "nextCaseListWithLimit", "caseDetails",
    "sendRequest", "sendRequestForTech", "sendRequestForTechDirect", "myRequestList", "responseForMyRequest", "mySendRecommendList", "mySendRequestList",
    "cancelMySendRecommendList", "cancelMySendRequest",
    "userListForAddService", "changeMyCaseServiceStatus","caseTypeList",
    "homeExploreList", "homeExploreListWithoutLimit",
    "caseFileUpload", "caseDetails", "caseFileDownload", "caseFileDelete", "caseDelete",
    "addCardRecord","updateCardRecord","cardList","defaultCard","addMoneyToWallet","deleteCard","currentWalletBalance","withdrawMoney",
    "trashList","trashFileDownload","restoreCaseFile",
    "casePayablePaymentList", "paymentPayToServiceHolder","completeList","casePaymentHistory",
    "invoiceList","invoiceDetails","completedCaseList",
    "featureUserList",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "addStripeRecord", "updateMyStripeAccountStatus","addMoneyToWalletByStripe","stripeAccountStatus",

];

let techPermission = [
    "serviceList","userProfileUpdate", "emailChangeRequest", "emailChangeSubmit", "profileDetailsForRegularUser","adminProfileDetails",
    "myProvideServiceList", "formDataForAddService", "myProvideServiceNewAdd", "myServiceUpdate", "myProvideServiceDelete",

    "trainingAdd", "trainingList", "trainingDelete", "trainingUpdate",
    "myRequestList", "responseForMyRequest",
    "homeExploreList", "homeExploreListWithoutLimit", "changeMyCaseServiceStatus",
    "caseFileUpload", "caseDetails", "caseFileDownload", "caseFileDelete", "caseDelete", "caseList", "caseListWithLimit", "nextCaseListWithLimit",
    "addCardRecord","updateCardRecord","cardList","defaultCard","deleteCard","currentWalletBalance","withdrawMoney","caseTypeList",
    "invoiceList","invoiceDetails","completedCaseList",
    "trashList","trashFileDownload","restoreCaseFile",
    "featureUserList",
    "globalSearch","companySearch",
    "messageList","messageDetails","messageSeen",
    "addStripeRecord", "updateMyStripeAccountStatus","addMoneyToWalletByStripe","stripeAccountStatus",


];



let getRouterPermissionList = async (id = 0) => {
    return new Promise((resolve, reject) => {
        if (id === 1) resolve(superAdminPermission);
        else if (id === 2) resolve(adminPermission);
        else if (id === 3) resolve(dentistPermission);
        else if (id === 4) resolve(consultantPermission);
        else if (id === 5) resolve(labPermission);
        else if (id === 6) resolve(techPermission);
    });
}


module.exports = {
    getRouterPermissionList
}
