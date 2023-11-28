
const isEmpty = require("is-empty");
let table_name = "mtae_user_provide_services";
let service_table_name = "mtae_services";
let service_access_role_table_name = "mtae_service_role_access";


let getUnusedServiceListByUserIdAndRoleId = () => { // use identity id a id
    return `SELECT id, name,  status, active_status FROM  ${service_table_name} WHERE  ${service_table_name}.active_status = 1 and id IN (
        SELECT service_id FROM ${service_access_role_table_name} WHERE role_id = ? AND  STATUS = 1 AND active_status = 1) 
        AND id NOT IN( SELECT service_id FROM ${table_name} WHERE role_id = ? AND STATUS = 1 and user_id = ? )`;
}

let getMyUsedServiceListByUserIdAndRoleId = () => { // use service_id a id, user for dentist, tech, lab
    return `SELECT 
                ${table_name}.id as id, ${service_table_name}.name, ${service_table_name}.id as service_id, ${table_name}.description, ${table_name}.price 
                FROM ${service_table_name} JOIN ${table_name} 
                where ${service_table_name}.id IN (SELECT service_id FROM ${service_access_role_table_name} where role_id = ? and status = 1 and active_status = 1)
                    and  ${table_name}.role_id = ? and ${table_name}.status = 1 and ${table_name}.user_id = ? and
                    ${table_name}.service_id = ${service_table_name}.id AND ${service_table_name}.active_status = 1`;
}


let getUserProvideServiceById = () => {
    return `SELECT id, service_id, user_id, role_id, description, price, status FROM ${table_name} where  id = ? and status = 1`;
}

let getUserProvideServiceByUserIdAndServiceId = () => {
    return `SELECT id, service_id, user_id, role_id, description, price, status FROM ${table_name} where user_id = ? and service_id = ? and status = 1`;
}

let addNewUserProvideService = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateUserProvideServiceByID = (data) => {
    let keys = Object.keys(data);
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;

    return query;
}

let deleteUserProvideServiceById = () => {
    return `UPDATE ${table_name} set status = 0, updated_by= ? , updated_at = ? where id = ?  `;
}



module.exports = {
    // getUserProvideServiceList,
    addNewUserProvideService,
    getUserProvideServiceById,
    // getUserProvideServiceById,
    updateUserProvideServiceByID,
    deleteUserProvideServiceById,
    getUnusedServiceListByUserIdAndRoleId,
    getMyUsedServiceListByUserIdAndRoleId,
    getUserProvideServiceByUserIdAndServiceId
}