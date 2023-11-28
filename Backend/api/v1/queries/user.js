let table_name = "mtae_users";


let getUserByUserName = () => {
    return `SELECT * FROM ${table_name} where  user_name = ?`;
}

let getUserByUserNameOrEmail = () => {
    return `SELECT * FROM ${table_name} where  user_name = ? or email = ?`;
}

let getUserById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;
}


let getUserDetailsById = () => {
    return `SELECT * FROM ${table_name} where  id = ?   `;
}

let getPendingUserById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 2 `;
}


let updateUserPasswordByUserId = () => {
    return `UPDATE ${table_name} set password = ? where id = ? `;
}

let getUserByEmail = () => {
    return `SELECT id , user_name, email , phone , status, role_id FROM ${table_name} where  email = ? and status <> 0 `;
}

let getUserByPhone = () => {
    return `SELECT id , user_name, email , phone , status, role_id FROM ${table_name} where  phone = ? and status <> 0 `;
}

let addNewUser = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let resetPasswordForUser = () => {
    return `UPDATE ${table_name} set password = ? , updated_by = ? , updated_at = ? where id =  ? `;
}

let disableUserById = () => {
    return `UPDATE ${table_name} set status = 2 , updated_by= ? , updated_at = ? where id = ?  `;
}

let enableUserById = () => {
    return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let deleteUserById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}

let updateAdminUserData = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let updateUserProfileById = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let updateUserEmailById = () => {
    return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ? `;
}






module.exports = {
    getUserByUserName,
    getUserByUserNameOrEmail,
    getUserById,
    getPendingUserById,
    updateUserPasswordByUserId,
    getUserByEmail,
    getUserByPhone,
    addNewUser,
    resetPasswordForUser,
    disableUserById,
    enableUserById,
    deleteUserById,
    getUserDetailsById,
    updateAdminUserData,
    updateUserProfileById,
    updateUserEmailById
    
}