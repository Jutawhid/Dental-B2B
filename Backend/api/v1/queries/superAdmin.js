let table_name = "mtae_super_admins";

let getSuperAdminById = () => {
    return `SELECT id, first_name, last_name, email, phone, profile_image FROM ${table_name} where  id = ?  and status = 1 `;
}

let updateSuperAdminEmailById = () => {
    return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ?  `;
  }

module.exports = {
    getSuperAdminById,
    updateSuperAdminEmailById
}