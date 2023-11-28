const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesFeatureUser = require('../queries/featureUser');

// Promises Method

let getFeatureUserList = async () => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.getFeatureUserList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getFeatureUserById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.getFeatureUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getFeatureUserByUserId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.getFeatureUserByUserId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNewFeatureUser = async (info) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.addNewFeatureUser(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateFeatureUserByID = async (name, image, updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.updateFeatureUserByID(), [name, image, updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let deleteFeatureUserById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.deleteFeatureUserById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let enableFeatureUserById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.enableFeatureUserById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableFeatureUserById = async (updated_by, updated_at, id) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesFeatureUser.disableFeatureUserById(), [updated_by, updated_at, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let serialFeatureUserById = (updatedBy, updatedAt, userIds = [],) => {

    return new Promise((resolve, reject) => {

        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                conn.query(queriesFeatureUser.updateAllFeatureUser(), [updatedBy, updatedAt], (error, result, fields) => {

                    if (error) {
                        console.log(error);
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });

                    } else {

                        for (let index = 0; index < userIds.length; index++) {
                            conn.query(queriesFeatureUser.updateSerialByFeatureUserId(), [(index + 1), updatedBy, updatedAt, userIds[index]], (error, result, fields) => {

                                if (error) {
                                    console.log(error);
                                    return conn.rollback(function () {
                                        conn.release();
                                        resolve([]);
                                    });

                                } else {
                                    if (index == userIds.length - 1) {
                                        conn.commit(function (err) {
                                            if (err) {
                                                return conn.rollback(function () {
                                                    conn.release();
                                                    resolve([]);
                                                });
                                            }
                                            conn.release();
                                            return resolve(result);
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            });
        });
    });
}



module.exports = {
    getFeatureUserList,
    getFeatureUserById,
    addNewFeatureUser,
    updateFeatureUserByID,
    deleteFeatureUserById,
    getFeatureUserByUserId,
    enableFeatureUserById,
    disableFeatureUserById,
    serialFeatureUserById
}

