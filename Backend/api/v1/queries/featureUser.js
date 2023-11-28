let table_name = "mtae_feature_users";

let getFeatureUserList = () => {
    return `SELECT id, role_id, user_id, serial_no, status, active_status FROM ${table_name} where status = 1 `;  // and active_status = 1
}


let getFeatureUserById = () => {
    return `SELECT id, role_id, user_id, serial_no, status, active_status FROM ${table_name} where  id = ? and status = 1`;
}

let getFeatureUserByUserId = () => {
    return `SELECT id, role_id, user_id, serial_no, status FROM ${table_name} where  user_id = ? and status = 1 `;
}

let addNewFeatureUser = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateFeatureUserByID = () => {
    return `UPDATE ${table_name} set role_id = ? , user_id = ? , serial_no = ?, updated_by= ?, updated_at = ? where id = ? `;
}

let updateAllFeatureUser = () => {
    return `UPDATE ${table_name} set serial_no = 0, updated_by= ?, updated_at = ?`;
}

let updateSerialByFeatureUserId = () => {
    return `UPDATE ${table_name} set serial_no = ?, updated_by= ?, updated_at = ? where id = ?`;
}


let deleteFeatureUserById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ? `;
}

let enableFeatureUserById = () => {
    return `UPDATE ${table_name} set active_status = 1, updated_by = ? , updated_at = ? where id = ? `;
}

let disableFeatureUserById = () => {
    return `UPDATE ${table_name} set active_status = 0, updated_by = ? , updated_at = ? where id = ? `;
}



module.exports = {
    getFeatureUserList,
    getFeatureUserById,
    getFeatureUserByUserId,
    addNewFeatureUser,
    updateFeatureUserByID,
    deleteFeatureUserById,
    enableFeatureUserById,
    disableFeatureUserById,
    updateAllFeatureUser,
    updateSerialByFeatureUserId
}