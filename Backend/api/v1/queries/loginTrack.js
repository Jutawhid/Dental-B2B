let table_name = "mtae_login_tracks";

let getLoggingTrackerById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;
}

let getLoggingTrackerByUserId = () => {
    return `SELECT id, login_device_info as user_device_info, uuid FROM ${table_name} where  user_id = ?  and status = 1 and created_at >= ? order by id DESC`;
}

let getLoggingTrackerByUserIdANDId = () => {
    return `SELECT id, login_device_info as user_device_info, uuid FROM ${table_name} where  user_id = ? and id = ?  and status = 1 `;
}

let getLoggingTrackerByUUID = () => {
    return `SELECT * FROM ${table_name} where  uuid = ?  and status = 1 `;
}


let addNewLoggingTracker = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let deleteLoggingTrackerDataByUUID = () => {
    return `UPDATE ${table_name} SET status = 0  where  uuid = ? `;
}

let deleteAllPreviousLoggingTrackerData = () => {
    return `UPDATE ${table_name} SET status = 0  where  uuid = ? `;
}

module.exports = {
    getLoggingTrackerById,
    addNewLoggingTracker,
    getLoggingTrackerByUUID,
    getLoggingTrackerByUserId,
    deleteLoggingTrackerDataByUUID,
    deleteAllPreviousLoggingTrackerData,
    getLoggingTrackerByUserIdANDId
}