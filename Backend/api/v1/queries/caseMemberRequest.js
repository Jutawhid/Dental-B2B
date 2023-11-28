let table_name = "mtae_case_member_requests";
let table_case_name = "mtae_cases";
let table_service_name = "mtae_services";

// let getCaseMemberRequestListByCaseId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and case_id = ? order by id desc`;
// }

// let getCaseMemberRequestListByServiceIdAndCaseId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and service_id = ? and case_id = ? order by id desc`;
// }

// let getCaseMemberRequestListByRequestUserId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and user_id = ? order by id desc`;
// }

let getCaseMemberRequestById = () => {
    return `SELECT * FROM ${table_name} where id = ? order by id desc`;
}

// let getCaseMemberRequestByRequestTypeCaseId = () => {
//     return `SELECT * FROM ${table_name} where id = ? order by id desc`;
// }

let getSentCaseMemberRequestListByCaseIdServiceIdAndUserId = () => {
    return `SELECT * FROM ${table_name} where case_id = ? and service_id = ? and service_provider_id = ? and status = 1 and expired_at > ? and service_provider_response = 3 and  request_status In (1,3) order by id desc`;
}

let getSentCaseMemberRecommendListByCaseIdServiceIdAndUserId = () => {
    return `SELECT * FROM ${table_name} where case_id = ? and service_id = ? and service_provider_id = ? and status = 1 and expired_at > ? and service_provider_response = 3 and  request_status In (1) order by id desc`;
}

let getSentCaseMemberRecommendListByCaseIdAndServiceId = () => {
    return `SELECT * FROM ${table_name} where case_id = ? and service_id = ? and status = 1 and expired_at > ? and service_provider_response = 3 and  request_status In (3) order by id desc`;
}

let getSentCaseMemberRequestListByCaseIdAndUserId = () => {
    return `SELECT * FROM ${table_name} where case_id = ? and service_provider_id = ? and status = 1 and expired_at > ? and service_provider_response = 3 and  request_status In (1,3) order by id desc`;
}


let getSentCaseMemberRequestListByCaseIdServiceId = () => {
    return `SELECT * FROM ${table_name} where case_id = ? and service_id = ? and status = 1 and expired_at > ? and service_provider_response = 3 and  request_status = 1 order by id desc`;
}

// let getMyRequestListOld = () => {
//     return `SELECT id,created_by, case_id, service_id, service_provider_response, expired_at, amount
//      FROM ${table_name} where  service_provider_id = ? and status = 1 and request_status = 1 order by id desc`;
// }


let getMyRequestList = () => {
    return `SELECT ${table_name}.id, ${table_service_name}.name as service_name ,  ${table_case_name}.case_id as case_identification_number, ${table_name}.created_by, ${table_name}.case_id, ${table_name}.service_id, ${table_name}.service_provider_response, ${table_name}.expired_at, ${table_name}.amount
    FROM mtae_case_member_requests join mtae_services on ${table_service_name}.id = ${table_name}.service_id 
    join mtae_cases on  ${table_name}.case_id = ${table_case_name}.id
    where  ${table_name}.service_provider_id = ? and ${table_name}.status = 1 and ${table_name}.request_status = 1 order by ${table_name}.id desc`;
}

let getSendRequestListByUserId = () => {

    //     return `SELECT
    //     mtae_case_member_requests.id,
    //     mtae_case_member_requests.expired_at,
    //     mtae_case_member_requests.service_provider_id,
    //     mtae_case_member_requests.service_provider_response,
    //     mtae_case_member_requests.service_id,
    //     ${table_service_name}.name AS service_name,
    //     mtae_case_member_requests.case_id,
    //     mtae_cases.case_id AS case_no
    // FROM
    //     mtae_case_member_requests
    // JOIN mtae_cases ON mtae_cases.id = mtae_case_member_requests.case_id
    // JOIN mtae_services ON ${table_service_name}.id = mtae_case_member_requests.service_id
    // WHERE
    //     mtae_case_member_requests.status = 1 AND mtae_case_member_requests.case_id IN(
    //     SELECT
    //         id FROM mtae_cases WHERE STATUS  = 1 ) AND((mtae_case_member_requests.request_type = 1 AND mtae_case_member_requests.request_user_id= ?)
    //          OR(mtae_case_member_requests.request_type = 2 AND
    // mtae_case_member_requests.request_status = 1 AND mtae_case_member_requests.request_user_id = ?))
    // ORDER BY
    //     mtae_case_member_requests.id
    // DESC`;


    return `SELECT ${table_name}.id,${table_name}.expired_at, ${table_name}.service_provider_id, ${table_name}.amount, ${table_name}.service_provider_response, 
        ${table_name}.service_id,  ${table_service_name}.name as service_name, 
        ${table_name}.case_id, ${table_case_name}.case_id as case_no FROM ${table_name} 
    join ${table_case_name} on ${table_case_name}.id = ${table_name}.case_id 
    join ${table_service_name} on ${table_service_name}.id = ${table_name}.service_id 
    where ${table_name}.status = 1 and 
    ${table_name}.case_id IN (SELECT id FROM ${table_case_name} where status = 1) and 
    ((${table_name}.request_type = 1 and ${table_name}.request_user_id = ? ) or (${table_name}.request_type = 2 and
         ${table_name}.request_status = 1  AND ${table_name}.request_user_id = ? )) 
    order by ${table_name}.id desc`;

}

let getRecommendListByUserId = () => {
    return `SELECT ${table_name}.id,${table_name}.created_by,${table_name}.expired_at, ${table_name}.service_provider_id, ${table_name}.amount, ${table_name}.service_provider_response, ${table_name}.request_status,
        ${table_name}.service_id,  ${table_service_name}.name as service_name, 
        ${table_name}.case_id, ${table_case_name}.case_id as case_no FROM ${table_name} 
    join ${table_case_name} on ${table_case_name}.id = ${table_name}.case_id 
    join ${table_service_name} on ${table_service_name}.id = ${table_name}.service_id 
    where ${table_name}.status = 1 and 
    ${table_name}.case_id IN (SELECT id FROM ${table_case_name} where status = 1 and created_by = ?) and ${table_name}.request_type = 2 and ${table_name}.request_status = 3 
    order by ${table_name}.id desc`;
}

let getPendingSentRecommendListByIdAndUserId = () => { // userId = request_user_id
    return `SELECT ${table_name}.id, ${table_name}.service_provider_id, ${table_name}.service_provider_response, ${table_name}.amount, ${table_name}.request_status,
        ${table_name}.service_id,  ${table_service_name}.name as service_name, 
        ${table_name}.case_id, ${table_case_name}.case_id as case_no FROM ${table_name} 
    join ${table_case_name} on ${table_case_name}.id = ${table_name}.case_id 
    join ${table_service_name} on ${table_service_name}.id = ${table_name}.service_id 
    where ${table_name}.status = 1 and ${table_name}.id = ? and  ${table_name}.request_user_id = ? and
    ${table_name}.case_id IN (SELECT id FROM ${table_case_name} where status = 1 ) and ${table_name}.request_type = 2 and ${table_name}.request_status = 3 
    order by ${table_name}.id desc`;
}

let getSendRecommendListByUserId = () => {
    return `SELECT ${table_name}.id,${table_name}.created_by, ${table_name}.service_provider_id, ${table_name}.amount, ${table_name}.service_provider_response, ${table_name}.request_status,
    ${table_name}.expired_at,${table_name}.service_id,  ${table_service_name}.name as service_name, 
        ${table_name}.case_id, ${table_case_name}.case_id as case_no FROM ${table_name} 
    join ${table_case_name} on ${table_case_name}.id = ${table_name}.case_id 
    join ${table_service_name} on ${table_service_name}.id = ${table_name}.service_id 
    where ${table_name}.status = 1 and 
    ${table_name}.case_id IN (SELECT id FROM ${table_case_name} where status = 1 ) and ${table_name}.request_type = 2  and ${table_name}.request_user_id = ?
    order by ${table_name}.id desc`;
}


let getMyRequestByIdAndServiceProviderId = () => {
    return `SELECT case_id, service_id, service_provider_response, request_user_id, expired_at, amount, created_by
     FROM ${table_name} where id = ? and service_provider_id = ? and status = 1 and request_status = 1 and service_provider_response = 3 order by id desc`;
}

let addNewCaseMemberRequest = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateCaseMemberRequestByID = (keys) => {
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}


let updatedAllDateOverRequest = () => {
    return `UPDATE ${table_name} set service_provider_response = 4 where expired_at < ? and service_provider_response = 3 and  request_status = 1 and status = 1 `;
}

let deleteCaseMemberRequestById = () => {
    return `UPDATE ${table_name} set status = 0 ,  updated_by= ? , updated_at = ? where id = ? and status = 1 `;
}

let rejectMyCaseMemberRequest = () => {
    return `UPDATE ${table_name} set service_provider_response = 2 ,  updated_by = ? , updated_at = ? where id = ? and status = 1 `;
}

let acceptMyCaseMemberRequest = () => {
    return `UPDATE ${table_name} set service_provider_response = 1 ,  updated_by = ? , updated_at = ? where id = ? and status = 1 `;
}

let updateAddExistingRequest = () => {
    return `UPDATE ${table_name} set service_provider_response = 4 ,  updated_by = ? , updated_at = ? where  case_id = ? and service_id = ? and status = 1 and service_provider_response = 3 and request_status = 1 `;
}


let getRecommendDetailsByIdAndCaseCreatorUserId = () => {
    return `SELECT *
    FROM ${table_name}  where status = 1 and id = ? and
    case_id IN (SELECT id FROM ${table_case_name} where status = 1 and created_by = ?) and
         request_type = 2 and request_status = 3 
    order by id desc`;
}

let getSendRequestDetailsByIdAndUserId = () => {
    return `SELECT *
    FROM ${table_name}  where status = 1 and id = ? and (
    case_id IN (SELECT id FROM ${table_case_name} where status = 1 and created_by = ?) or request_user_id = ?)
    order by id desc`;
}

let getCaseMemberRequestListByCaseId = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and  case_id = ? `;
}

let deleteRequestedMembersByCaseId = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where case_id = ? `;
}



module.exports = {
    // getCaseMemberRequestListByCaseId,
    // getCaseMemberRequestListByServiceIdAndCaseId,
    // getCaseMemberRequestListByRequestUserId,
    getCaseMemberRequestById,
    addNewCaseMemberRequest,
    updateCaseMemberRequestByID,
    deleteCaseMemberRequestById,
    getSentCaseMemberRequestListByCaseIdServiceIdAndUserId,
    getSentCaseMemberRequestListByCaseIdServiceId,
    updatedAllDateOverRequest,
    getMyRequestList,
    getMyRequestByIdAndServiceProviderId,
    rejectMyCaseMemberRequest,
    acceptMyCaseMemberRequest,
    updateAddExistingRequest,
    getSendRequestListByUserId,
    getSendRecommendListByUserId,
    getRecommendDetailsByIdAndCaseCreatorUserId,
    getRecommendListByUserId,
    getPendingSentRecommendListByIdAndUserId,
    getSentCaseMemberRequestListByCaseIdAndUserId,
    getCaseMemberRequestListByCaseId,
    deleteRequestedMembersByCaseId,
    getSentCaseMemberRecommendListByCaseIdAndServiceId,
    getSentCaseMemberRecommendListByCaseIdServiceIdAndUserId,
    getSendRequestDetailsByIdAndUserId
}