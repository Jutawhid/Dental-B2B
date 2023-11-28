const isEmpty = require("is-empty");
let table_name = "mtae_case_types";

let getCaseTypeList = () => {
  return `SELECT  id , type, status FROM ${table_name} where status = 1 order by id ASC `;
};

let getCaseTypeById = () => {
  return `SELECT id , type , status FROM ${table_name} where  id = ? and status = 1 order by id ASC`;
};


module.exports = {
  getCaseTypeList,
  getCaseTypeById,
};
