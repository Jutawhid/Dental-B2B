const isEmpty = require("is-empty");
let table_name = "mtae_payment_gateways";

let getGatewayList = () => {
    return `SELECT id, name, status, image, active_status FROM ${table_name}  where status = 1`;
}

let getGatewayByName = () => {
    return `SELECT id, name, status, image, active_status FROM ${table_name} where  name = ? and status = 1`;
}

let getGatewayById = () => {
    return `SELECT id, name, status, image, active_status FROM ${table_name} where  id = ? and status = 1`;
}

let addNewGateway = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateGatewayByID = () => {
    return `UPDATE ${table_name} set name = ? , image = ? , updated_by= ? , updated_at = ? where id = ? and status = 1`;
}

let deleteGatewayById = () => {
    return `UPDATE ${table_name} set status = 0 , active_status = 0 , updated_by= ? , updated_at = ? where id = ? and status = 1 `;
}

let enableGatewayById = () => {
    return `UPDATE ${table_name} set active_status = 1 , updated_by= ? , updated_at = ? where id = ? and status = 1 `;
}

let disableGatewayById = () => {
    return `UPDATE ${table_name} set active_status = 0 , updated_by= ? , updated_at = ? where id = ? and status = 1 `;
}



module.exports = {
    getGatewayList,
    getGatewayById,
    getGatewayByName,
    addNewGateway,
    updateGatewayByID,
    deleteGatewayById,
    enableGatewayById,
    disableGatewayById
}