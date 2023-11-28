let table_name = "mtae_case_members";
let table_case_name = "mtae_cases";
let table_case_member_request_name = "mtae_case_member_requests";

// let getCaseMemberListByCaseId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and case_id = ? order by id desc`;
// }

let getCaseMemberDetailsById = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and  id = ? `;
}

let getCaseMemberListByCaseId = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and  case_id = ? `;
}

let getRunningCaseMemberListByCaseIdServiceId = () => { // get running case member list by case id and service id where status = 1 and service_status 1 or 2
    return `SELECT * FROM ${table_name}  where status = 1 and  case_id = ? and service_id = ? and service_status In (1, 2) order by id desc`;
}

let getRunningCaseMemberListByCaseId = () => { 
    return `SELECT DISTINCT user_id FROM ${table_name}  where status = 1 and  case_id = ?  and service_status In (1, 2) order by id desc`;
}

let getTotalCaseMemberListByCaseIdServiceId = () => { // get running case member list by case id and service id where status = 1 and service_status 1 or 2
    return `SELECT * FROM ${table_name}  where status = 1 and  case_id = ? and service_id = ? and service_status In (1, 2, 3) order by id asc`;
}

// let getCaseMemberListByServiceIdAndCaseId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and service_id = ? and case_id = ? order by id desc`;
// }

// let getCaseMemberListByUserId = () => {
//     return `SELECT * FROM ${table_name}  where status = 1 and user_id = ? order by id desc`;
// }

let getCaseMemberInfoByCaseIdAndUserId = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and  case_id = ? and user_id = ? and service_status In (1,2,3) order by id desc`;
}

let getCaseMemberInfoByIdAndUserId = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and  id = ? and user_id = ? and service_status In (1,2,3) order by id desc`;
}

let getCaseMemberInfoAndCaseInfoById = () => {
    return `SELECT ${table_name}.*, ${table_case_name}.created_by as case_created_by,  ${table_case_name}.case_progress_status as case_progress_status  FROM
    ${table_name} JOIN ${table_case_name} ON  ${table_case_name}.id = ${table_name}.case_id where ${table_name}.status = 1 and  ${table_name}.id = ?
    and ${table_name}.service_status In (1,2,3) order by ${table_name}.id ASC;`;
}

let getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId = () => {
    return `SELECT ${table_name}.*, ${table_case_member_request_name}.request_user_id FROM ${table_name} inner join ${table_case_member_request_name} 
    On ${table_name}.mtae_members_request_id = ${table_case_member_request_name}.id where ${table_name}.status = 1 
    and (${table_name}.user_id = ? or ${table_case_member_request_name}.request_user_id = ?) and ${table_name}.id = ?`;
}

let getMyCaseList = () => {

    return `SELECT * FROM ${table_case_name} WHERE status = 1 and created_by = ? or 
    id IN (SELECT DISTINCT case_id FROM ${table_name} where status = 1 and user_id = ?) order by Id DESC;`;

}

let getMyCaseListWithLimit = () => {

    return `SELECT * FROM ${table_case_name} WHERE created_by = ? or
     id IN (SELECT DISTINCT case_id FROM ${table_name} where status = 1 and user_id = ?) order by Id DESC
     LIMIT ? `;

}

let getMyNextCaseListWithLimit = () => {

    return `SELECT * FROM ${table_case_name} WHERE  (created_by = ? or
     id IN (SELECT DISTINCT case_id FROM ${table_name} where status = 1 and user_id = ?))
     and id < ? order by Id DESC
     LIMIT ? `;


}

let getMyCaseListForAdmin = () => {
    return `SELECT id, created_by, case_id, status, case_progress_status, created_at  
    FROM ${table_case_name} WHERE status = 1 order by Id DESC
    `;
}

let getMyCaseListForAdminWithLimit = () => {
    return `SELECT id, created_by, case_id, status, case_progress_status, created_at  
    FROM ${table_case_name} WHERE status = 1 order by Id DESC
    LIMIT ?`;
}


let getMyNextCaseListForAdminWithLimit = () => {
    return `SELECT id, created_by, case_id, status, case_progress_status, created_at  
    FROM ${table_case_name} WHERE status = 1 and id < ? order by Id DESC
    LIMIT ?`;
}

let getCancelCaseMemberList = () => {
    return `SELECT mtae_case_members.id, mtae_case_members.case_id, mtae_cases.case_id as case_id_no, mtae_case_members.created_by, mtae_case_members.created_at,  mtae_case_members.service_status, mtae_case_members.amount, mtae_case_members.service_id, mtae_services.name as services_name
    FROM mtae_case_members
    join mtae_cases on mtae_case_members.case_id = mtae_cases.id 
    join mtae_services on mtae_case_members.service_id = mtae_services.id 
    where mtae_case_members.status = 0;`;
}


let addNewCaseMember = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateCaseMemberByID = (keys) => {
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}


// let deleteCaseMemberById = () => {
//     return `UPDATE ${table_name} set status = 0 ,  updated_by= ? , updated_at = ? where id = ? and status = 1 `;
// }



module.exports = {
    getRunningCaseMemberListByCaseIdServiceId,
    getTotalCaseMemberListByCaseIdServiceId,
    getCaseMemberInfoByCaseIdAndUserId,
    // getCaseMemberListByCaseId,
    // getCaseMemberListByServiceIdAndCaseId,
    // getCaseMemberListByUserId,
    // getCaseMemberById,
    addNewCaseMember,
    updateCaseMemberByID,
    getCaseMemberInfoByIdAndUserId,
    getMyCaseList,
    getMyCaseListForAdmin,
    getCaseMemberListByCaseId,
    getMyCaseListForAdminWithLimit,
    getMyNextCaseListForAdminWithLimit,
    getMyCaseListWithLimit,
    getMyNextCaseListWithLimit,
    getCaseMemberInfoByIdAndRequestSenderIdOrServiceProviderId,
    getCaseMemberDetailsById,
    getRunningCaseMemberListByCaseId,
    getCancelCaseMemberList,
    getCaseMemberInfoAndCaseInfoById
    // deleteCaseMemberById
}