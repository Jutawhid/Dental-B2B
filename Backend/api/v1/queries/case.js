let table_name = "mtae_cases";

let getCaseList = () => {
    return `SELECT id, case_id,case_type_id, patient_name, patient_age, patient_address, case_progress_status, status FROM ${table_name}  where status = 1 order by id desc`;
}

let getCaseListByUserId = () => {
    return `SELECT id, case_id,case_type_id, patient_name, patient_age, patient_address, case_progress_status, status FROM ${table_name}  where status = 1 and created_by = ? order by id desc`;
}

// let getCaseByName = () => {
//     return `SELECT id, case_id, patient_name, patient_age, patient_address, status, case_progress_status FROM ${table_name} where  name = ? and status = 1 order by id desc`;
// }

let getCaseById = () => {
    return `SELECT id,case_id,case_type_id, patient_name, patient_age, patient_address, status, case_progress_status, created_by FROM ${table_name} where  id = ? and status = 1 order by id desc`;
}

let getCaseFullDetailsById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  order by id desc`;
}

let getCaseAllDetailsById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 order by id desc`;
}

let getDeletedCaseDetailsById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 0 order by id desc`;
}

let getCaseByIdAndUserId = () => {
    return `SELECT id, case_id,case_type_id, patient_name, patient_age, patient_address, status, case_progress_status FROM ${table_name} where  id = ? and status = 1 and created_by = ? order by id desc`;
}

let getTotalCaseByUserId = () => {
    return `SELECT count(id) as total_case FROM ${table_name} WHERE created_by = ?`;
}


let addNewCase = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateCaseIdById = () => {
    return `UPDATE ${table_name} set case_id = ? where id = ? and status = 1 `;
}

let updateCaseByID = (keys) => {
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}

let deleteCaseById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ? `;
}

// let enableCaseById = () => {
//     return `UPDATE ${table_name} set active_status = 1 , updated_by= ? , updated_at = ? where id = ? and status = 1 `;
// }

// let disableCaseById = () => {
//     return `UPDATE ${table_name} set active_status = 0 , updated_by= ? , updated_at = ? where id = ? and status = 1 `;
// }

let restoreCaseFromTrash = () => {
    return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
  };



module.exports = {
    getCaseList,
    getCaseListByUserId,
    getCaseById,
    getCaseAllDetailsById,
    // getCaseByName,
    addNewCase,
    updateCaseByID,
    updateCaseIdById,
    deleteCaseById,
    getTotalCaseByUserId,
    getCaseByIdAndUserId,
    getDeletedCaseDetailsById,
    restoreCaseFromTrash,
    getCaseFullDetailsById
    // enableCaseById,
    // disableCaseById
}