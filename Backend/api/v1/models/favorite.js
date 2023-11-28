const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesFavorite = require('../queries/favorite');

// Promises Method
let addToFavorite = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.addToFavorite(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getExistInFavoriteList = async (userId = 0,favoriteUserId = 0,favoriteUserRoleId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.getExistInFavoriteList(), [userId,favoriteUserId,favoriteUserRoleId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let removeFromFavorite = async (id,updated_at) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.removeFromFavorite(), [updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllFavoriteList = async (userId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.getAllFavoriteList(), [userId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyAllFavByRoleId = async (userId = 0,roleId = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.getMyAllFavByRoleId(), [userId,roleId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyFavByRoleId = async (userId = 0,roleId = 0,limit = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.getMyFavByRoleId(), [userId,roleId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getMyNextFavByRoleId = async (userId = 0,roleId = 0,startId = 0,limit = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFavorite.getMyNextFavByRoleId(), [userId,roleId,startId,limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}





module.exports = {
    addToFavorite,
    getExistInFavoriteList,
    removeFromFavorite,
    getAllFavoriteList,
    getMyFavByRoleId,
    getMyNextFavByRoleId,
    getMyAllFavByRoleId,
}

