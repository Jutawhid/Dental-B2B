const isEmpty = require("is-empty");
let table_name = "mtae_notifications";


let addNewNotification = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getNotificationByUserIdAndRoleId = () => {
    return `SELECT * FROM ${table_name} where status = 1 and ( (receiver_id = ? and is_receive_all = 0 ) or 
    ( is_receive_all = 1 and receiver_type = ?) ) ORDER By id DESC`;
}

let getNotificationByIDUserIdAndRoleId = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 and ( (receiver_id = ? and is_receive_all = 0 ) or 
    ( is_receive_all = 1 and receiver_type = ?) )`;
}

let updateNotificationSeenById = () => {
    return `UPDATE ${table_name} set is_seen = 1, updated_by= ? , updated_at = ? where id = ? and status = 1`;
}


module.exports = {
    addNewNotification,
    getNotificationByUserIdAndRoleId,
    getNotificationByIDUserIdAndRoleId,
    updateNotificationSeenById
}