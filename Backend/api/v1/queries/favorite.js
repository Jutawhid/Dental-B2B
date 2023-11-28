let table_name = "mtae_favorite_user";

let addToFavorite = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getExistInFavoriteList = () => {
    return `SELECT id, user_id,favorite_user_id,favorite_user_role_id, status FROM ${table_name} where  user_id = ? and favorite_user_id = ?
     and favorite_user_role_id = ? and status = 1`;
}

let removeFromFavorite = () => {
    return `UPDATE ${table_name} set status = 0 ,  updated_at = ? where id = ?  `;
}

let getAllFavoriteList = () => {
    return `SELECT id, user_id,favorite_user_id,favorite_user_role_id, status FROM ${table_name} where  user_id = ?  and status = 1`;
}

let getMyAllFavByRoleId = () => {
    return `SELECT id, user_id,favorite_user_id,favorite_user_role_id, status FROM ${table_name} where  user_id = ? 
    and favorite_user_role_id = ? and status = 1 `;
}

let getMyFavByRoleId = () => {
    return `SELECT id, user_id,favorite_user_id,favorite_user_role_id, status FROM ${table_name} where  user_id = ? 
    and favorite_user_role_id = ? and status = 1 limit ?`;
}

let getMyNextFavByRoleId = () => {
    return `SELECT id, user_id,favorite_user_id,favorite_user_role_id, status FROM ${table_name} where  user_id = ? 
    and favorite_user_role_id = ? and ${table_name}.id > ? and status = 1 limit ?`;
}


module.exports = {
    addToFavorite,
    getExistInFavoriteList,
    removeFromFavorite,
    getAllFavoriteList,
    getMyFavByRoleId,
    getMyNextFavByRoleId,
    getMyAllFavByRoleId
}