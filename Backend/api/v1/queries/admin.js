let table_name = "mtae_admins";
let user_table_name = "mtae_users";

let getAllAdminList = () => {
  
  return `SELECT ${table_name}.id , ${table_name}.first_name , ${table_name}.last_name , ${table_name}.email ,
    ${table_name}.phone , ${table_name}.profile_image , ${table_name}.address , ${table_name}.status ,
    ${user_table_name}.id as user_id FROM ${table_name} 
    JOIN ${user_table_name} on (${table_name}.id = ${user_table_name}.profile_id) 
    where ${user_table_name}.role_id = 2 and ${table_name}.status > 0
    order by ${table_name}.id ASC`;
};

let getAdminById = () => {
  return `SELECT id, first_name, last_name, email, phone, profile_image ,status FROM ${table_name} where  id = ?  and status = 1 `;
};

let getAdminDetailsById = () => {
  return `SELECT * FROM ${table_name} where  id = ?   `;
};

let addNewAdmin = () => {
  return `INSERT INTO ${table_name} SET ?`;
};

let disableAdminById = () => {
  return `UPDATE ${table_name} set status = 2 , updated_by= ? , updated_at = ? where id = ?  `;
};

let enableAdminById = () => {
  return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
};

let updateAdminProfileById = (data) => {
  let keys = Object.keys(data);

  let query = `update ${table_name} set ` + keys[0] + ` = ? `;

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i] + ` = ? `;
  }

  query += ` where id = ? `;

  return query;
};

let updateAdminEmailById = () => {
  return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ?  `;
}

module.exports = {
  getAllAdminList,
  getAdminById,
  addNewAdmin,
  disableAdminById,
  enableAdminById,
  getAdminDetailsById,
  updateAdminProfileById,
  updateAdminEmailById
};
