let table_name = "mtae_case_files";


let getCaseFileListByCaseId = () => {
  return `SELECT  ${table_name}.id , ${table_name}.case_id,${table_name}.file_original_name,${table_name}.created_at ,
  ${table_name}.created_by,${table_name}.status
  FROM ${table_name}
   where ${table_name}.case_id = ? and status = 1 order by ${table_name}.created_at DESC `;
};


let getCaseFileDataById = () => {
  return `SELECT id, created_by, updated_by ,case_id ,file_original_name,file_temp_name,status FROM ${table_name} where  id = ? and status = 1`;
}

let getDeletedCaseFileDataById = () => {
  return `SELECT id, created_by, updated_by ,case_id ,file_original_name,file_temp_name,status FROM ${table_name} where  id = ? and status = 0`;
}


let addNewCaseFile = () => {
    return `INSERT INTO ${table_name} SET ?`;
  };

let deleteCaseFileById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
};

let restoreCaseFileFromTrash = () => {
  return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
};


module.exports = {
    getCaseFileListByCaseId,
    getCaseFileDataById,
    addNewCaseFile,
    deleteCaseFileById,
    getDeletedCaseFileDataById,
    restoreCaseFileFromTrash
}