const isEmpty = require("is-empty");
let table_name = "mtae_service_role_access";
let table_user_provide_services = "mtae_user_provide_services";



let addNewServiceAccessRoles = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getAccessListByServiceId = () => {
    return `SELECT id, service_id, role_id, status, active_status FROM ${table_name} where  service_id = ?  and status = 1 `;
}

let getUserListByServiceId = () => {
    return `SELECT user_id, role_id, price FROM ${table_user_provide_services} WHERE role_id in (SELECT role_id FROM ${table_name} where service_id = ? and status = 1 
        and active_status = 1) and status = 1 and service_id = ?
    `;
}

let updateServiceId = () => {
    return `UPDATE ${table_name} set service_id = ?  where  id = ?  `;
}


let deleteServiceAccessId = () => {
    return `UPDATE ${table_name} set  status = 0 ,  active_status = 0, updated_by= ? , updated_at = ? where  id = ?  `;
}


let enableServiceAccessId = () => {
    return `UPDATE ${table_name} set  active_status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let disableServiceAccessId = () => {
    return `UPDATE ${table_name} set active_status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}





module.exports = {
    addNewServiceAccessRoles,
    getAccessListByServiceId,
    getUserListByServiceId,
    disableServiceAccessId,
    enableServiceAccessId,
    deleteServiceAccessId,
    updateServiceId
}