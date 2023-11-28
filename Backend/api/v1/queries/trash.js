let table_name = "mtae_trashes";

let addNewTrash = () => {
    return `INSERT INTO ${table_name} SET ?`;
  };

let getTrashFileListByUserId = () => {
    return `SELECT * FROM ${table_name}  where status = 1 and user_id = ? and trash_type = ? and table_name = ?
    and expired_time > ? order by id desc`;
}

let getTrashCaseListByUserId = () => {
  return `SELECT * FROM ${table_name}  where status = 1 and user_id = ? and trash_type = ? and table_name = ?
  and expired_time > ? order by id desc`;
}

let getAllTrashFile = () => {
  return `SELECT * FROM ${table_name}  where status = 1  and trash_type = ? and table_name = ?
  and expired_time > ? order by id desc`;
}

let getTrashFileById = () => {
  return `SELECT * FROM ${table_name}  where status = 1 and id = ?`;
}

let restoreCaseFileById = () => {
  return `UPDATE ${table_name} set status = 0  , updated_at = ? where id = ?  `;
};


module.exports = {
    getTrashFileListByUserId,
    addNewTrash,
    getTrashFileById,
    restoreCaseFileById,
    getAllTrashFile,
    getTrashCaseListByUserId
}