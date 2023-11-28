let table_name = "mtae_roles";

let getRoleById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;
}

let getRoleByIdentityId = () => {
    return `SELECT * FROM ${table_name} where identity_id = ? and status = 1 `;
}

module.exports = {
    getRoleById,
    getRoleByIdentityId
}