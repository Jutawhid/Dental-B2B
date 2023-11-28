const isEmpty = require("is-empty");
let table_name = "mtae_services";

let getServiceList = () => {
  return `SELECT  id , name, priority ,status, active_status FROM ${table_name} where status = 1 order by priority `;
};

let getServiceByNameAndPriority = () => {
  return `SELECT  id , name, priority ,status, active_status FROM ${table_name} where  name = ? and priority = ? order by priority  `;
};

let getServiceByName = () => {
  return `SELECT id , name, priority ,status, active_status FROM ${table_name} where  name = ?  order by priority `;
};

let getServiceByPriority = () => {
  return `SELECT id, name, priority, status, active_status FROM ${table_name} where priority = ? and status = 1 order by priority `;
};

let getServiceById = () => {
  return `SELECT id , priority, name, status, active_status FROM ${table_name} where  id = ? and status = 1 order by priority`;
};

let addNewService = () => {
  return `INSERT INTO ${table_name} SET ?`;
};

let updateServiceByID = () => {
  return `UPDATE ${table_name} set name = ? , priority = ? , updated_by= ? , updated_at = ? where id = ?  `;
};

let deleteServiceById = () => {
  return `UPDATE ${table_name} set status = 0 , active_status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
};

let enableServiceById = () => {
  return `UPDATE ${table_name} set  active_status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
};

let disableServiceById = () => {
  return `UPDATE ${table_name} set active_status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
};

module.exports = {
  getServiceList,
  getServiceByNameAndPriority,
  getServiceByName,
  getServiceByPriority,
  addNewService,
  getServiceById,
  updateServiceByID,
  deleteServiceById,
  enableServiceById,
  disableServiceById,
};
