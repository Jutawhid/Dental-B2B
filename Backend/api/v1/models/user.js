const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesUser = require('../queries/user');
const queriesUserBalance = require('../queries/userBalance');
const dentistModel = require('./dentist');
const consultantModel = require('./consultant');
const labModel = require('./lab');
const techCompanyModel = require('./techCompany');
const adminModel = require('./admin');
const superAdminModel = require("./superAdmin");
const userBalanceModel = require("./userBalance");
const otpModel = require('./otp');
const forgetPasswordModel = require('./forgetPassword');
const isEmpty = require('is-empty');

let getUserByUserName = async (userName = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserByUserName(), [userName], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByUserNameOrEmail = async (userName = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserByUserNameOrEmail(), [userName, userName], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserDetailsById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserDetailsById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getPendingUserById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getPendingUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let updateUserPasswordByUserId = async (id = 0, password = "") => { // get only active user
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.updateUserPasswordByUserId(), [password, id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByEmail = async (email = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserByEmail(), [email], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUserByPhone = async (phone = "") => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.getUserByPhone(), [phone], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let addNewUser = (userInfo = {}, profileInfo = {}) => {


    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (userInfo.role_id === 3) {
                    let addDentist = await dentistModel.addNewDentist(profileInfo, conn);

                    if (addDentist.affectedRows == undefined || addDentist.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    //insert added data's id into userInfo
                    userInfo.profile_id = addDentist.insertId;

                    conn.query(queriesUser.addNewUser(), [userInfo], (error, result, fields) => {
                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } 

                        let userBalance = {
                            "user_id" : result.insertId,
                            "updated_by" : result.insertId,
                        };

                        conn.query(queriesUserBalance.addInitialBalance(), [userBalance], (error, updateResult, fields) => {
        
                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
    
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
                        });
                    });
                } else if (userInfo.role_id === 4) {
                    let addConsultant = await consultantModel.addNewConsultant(profileInfo, conn);

                    if (addConsultant.affectedRows == undefined || addConsultant.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    //insert added data's id into userInfo
                    userInfo.profile_id = addConsultant.insertId;

                    conn.query(queriesUser.addNewUser(), [userInfo], (error, result, fields) => {
                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } 

                        let userBalance = {
                            "user_id" : result.insertId,
                            "updated_by" : result.insertId,
                        };

                        conn.query(queriesUserBalance.addInitialBalance(), [userBalance], (error, updateResult, fields) => {
        
                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
    
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
                        });
                    });

                } else if (userInfo.role_id === 5) {
                    let addLab = await labModel.addNewLab(profileInfo, conn);

                    if (addLab.affectedRows == undefined || addLab.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    //insert added data's id into userInfo
                    userInfo.profile_id = addLab.insertId;

                    conn.query(queriesUser.addNewUser(), [userInfo], (error, result, fields) => {
                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } 

                        let userBalance = {
                            "user_id" : result.insertId,
                            "updated_by" : result.insertId,
                        };

                        conn.query(queriesUserBalance.addInitialBalance(), [userBalance], (error, updateResult, fields) => {
        
                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
    
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
                        });
                    });
                } else if (userInfo.role_id === 6) {
                    let addTech = await techCompanyModel.addNewTech(profileInfo, conn);

                    if (addTech.affectedRows == undefined || addTech.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    //insert added data's id into userInfo
                    userInfo.profile_id = addTech.insertId;

                    conn.query(queriesUser.addNewUser(), [userInfo], (error, result, fields) => {
                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } 

                        let userBalance = {
                            "user_id" : result.insertId,
                            "updated_by" : result.insertId,
                        };

                        conn.query(queriesUserBalance.addInitialBalance(), [userBalance], (error, updateResult, fields) => {
        
                            if (error) {
                               
                                return conn.rollback(function () {

                                    conn.release();
                                    resolve([]);
                                });
                            }
    
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
                        });
                    });
                } else if (userInfo.role_id === 2) {
                    let addAdmin = await adminModel.addNewAdmin(profileInfo, conn);

                    if (addAdmin.affectedRows == undefined || addAdmin.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    //insert added data's id into userInfo
                    userInfo.profile_id = addAdmin.insertId;
                    //console.log(userInfo.profile_id);
                    conn.query(queriesUser.addNewUser(), [userInfo], (error, result, fields) => {
                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                }




            });
        });
    });
}




let resetPasswordForUser = async (user_id, password, updatedBy, updatedAt) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesUser.resetPasswordForUser(), [password, updatedBy, updatedAt, user_id], (error, result, fields) => {

            if (error) reject(error)
            else resolve(result)
        });
    });
}

let disableUserById = (updatedBy, updatedAt, userId, profileId, roleId) => {


    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (roleId === 2) {
                    let disableAdmin = await adminModel.disableAdminById(updatedBy, updatedAt, profileId, conn);

                    if (disableAdmin.affectedRows == undefined || disableAdmin.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.disableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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

                    });
                } else if (roleId === 3) {
                    let disableDentist = await dentistModel.disableDentistById(updatedBy, updatedAt, profileId, conn);

                    if (disableDentist.affectedRows == undefined || disableDentist.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.disableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            //console.log("result");
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


                    });
                } else if (roleId === 4) {
                    let disableConsultant = await consultantModel.disableConsultantById(updatedBy, updatedAt, profileId, conn);

                    if (disableConsultant.affectedRows == undefined || disableConsultant.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.disableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 5) {
                    let disableLab = await labModel.disableLabById(updatedBy, updatedAt, profileId, conn);

                    if (disableLab.affectedRows == undefined || disableLab.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.disableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 6) {
                    let disableTech = await techCompanyModel.disableTechById(updatedBy, updatedAt, profileId, conn);

                    if (disableTech.affectedRows == undefined || disableTech.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.disableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
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


                    });
                }

            });
        });
    });
}

let enableUserById = (updatedBy, updatedAt, userId, profileId, roleId) => {



    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (roleId === 2) {
                    let enableAdmin = await adminModel.enableAdminById(updatedBy, updatedAt, profileId, conn);

                    if (enableAdmin.affectedRows == undefined || enableAdmin.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.enableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 3) {
                    let enableDentist = await dentistModel.enableDentistById(updatedBy, updatedAt, profileId, conn);

                    if (enableDentist.affectedRows == undefined || enableDentist.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.enableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 4) {
                    let enableConsultant = await consultantModel.enableConsultantById(updatedBy, updatedAt, profileId, conn);

                    if (enableConsultant.affectedRows == undefined || enableConsultant.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.enableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 5) {
                    let enableLab = await labModel.enableLabById(updatedBy, updatedAt, profileId, conn);

                    if (enableLab.affectedRows == undefined || enableLab.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.enableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 6) {
                    let enableTech = await techCompanyModel.enableTechById(updatedBy, updatedAt, profileId, conn);

                    if (enableTech.affectedRows == undefined || enableTech.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.enableUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                }

            });
        });
    });
}

let deleteUserById = (updatedBy, updatedAt, userId, profileId, roleId) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (roleId === 3) {
                    let deleteDentist = await dentistModel.deleteDentistById(updatedBy, updatedAt, profileId, conn);

                    if (deleteDentist.affectedRows == undefined || deleteDentist.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.deleteUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 4) {
                    let deleteConsultant = await consultantModel.deleteConsultantById(updatedBy, updatedAt, profileId, conn);

                    if (deleteConsultant.affectedRows == undefined || deleteConsultant.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.deleteUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 5) {
                    let deleteLab = await labModel.deleteLabById(updatedBy, updatedAt, profileId, conn);

                    if (deleteLab.affectedRows == undefined || deleteLab.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.deleteUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                } else if (roleId === 6) {
                    let deleteTech = await techCompanyModel.deleteTechById(updatedBy, updatedAt, profileId, conn);

                    if (deleteTech.affectedRows == undefined || deleteTech.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    conn.query(queriesUser.deleteUserById(), [updatedBy, updatedAt, userId], (error, result, fields) => {

                        if (error) {
                           
                            return conn.rollback(function () {
                                conn.release();
                                resolve([]);
                            });
                        } else {
                            
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


                    });
                }

            });
        });
    });
}


// password update by Forget Password
let updateUserPasswordUsingForgetPassword = (userId, newPassword, forgetPasswordId) => {

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                let disableLink = await forgetPasswordModel.disableLinkById(forgetPasswordId, conn);

                if (disableLink.affectedRows == undefined || disableLink.affectedRows < 1) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }


                conn.query(queriesUser.updateUserPasswordByUserId(), [newPassword, userId], (error, result, fields) => {

                    if (error) {
                       
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    } else {
                        
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


                });


            });
        });
    });
}


let updateAdminUserData = async (userId, userData = {}, conn) => {
    let connection = connectionEasifiMYSQL;
    if (conn !== undefined) connection = conn;

    // get object, generate an array and push data value here

    // for user data
    let keys = Object.keys(userData);

    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(userData[keys[index]]);

    }
    return new Promise((resolve, reject) => {
        connection.query(queriesUser.updateAdminUserData(userData), [...dataParameter, userId], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


let updateUserProfileById = (profileId, userId, profileData = {}, userData = {}, roleId) => {
    
    // get object, generate an array and push data value here
    // for user data
    let keys = Object.keys(userData);
    let dataParameter = [];

    for (let index = 0; index < keys.length; index++) {
        dataParameter.push(userData[keys[index]]);

    }
    

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }

                if (roleId == 3) {

                    let updateProfileData = await dentistModel.updateDentistById(profileId, profileData, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    if (!isEmpty(userData)) {
                        conn.query(queriesUser.updateUserProfileById(userData), [...dataParameter, userId], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(updateProfileData);

                        });
                    }

                } else if (roleId == 4) {

                    let updateProfileData = await consultantModel.updateConsultantById(profileId, profileData, conn);
                   
                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    if (!isEmpty(userData)) {
                        
                        conn.query(queriesUser.updateUserProfileById(userData), [...dataParameter, userId], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(updateProfileData);

                        });
                    }

                } else if (roleId == 5) {

                    
                    let updateProfileData = await labModel.updateLabById(profileId, profileData, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    if (!isEmpty(userData)) {
                        conn.query(queriesUser.updateUserProfileById(userData), [...dataParameter, userId], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(updateProfileData);

                        });
                    }

                } else if (roleId == 6) {
                    let updateProfileData = await techCompanyModel.updateTechById(profileId, profileData, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    if (!isEmpty(userData)) {
                        conn.query(queriesUser.updateUserProfileById(userData), [...dataParameter, userId], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(updateProfileData);

                        });
                    }

                }

            });
        });
    });
}


// update user email
let updateUserEmail = (requestData,roleId) => {
    
    

    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.getConnection(function (err, conn) {

            conn.beginTransaction(async function (error) {
                if (error) {
                    return conn.rollback(function () {
                        conn.release();
                        resolve([]);
                    });
                }


                // profile table email update
                if (roleId == 3) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await dentistModel.updateDentistEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                } else if (roleId == 4) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await consultantModel.updateConsultantEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                } else if (roleId == 5) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await labModel.updateLabEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                } else if (roleId == 6) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await techCompanyModel.updateTechEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                }  else if (roleId == 2) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await adminModel.updateAdminEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                }  else if (roleId == 1) {

                    // otp status change
                    let disableOTP = await otpModel.updateEmailChangeRequest(requestData.otp_id,conn);
                    if (disableOTP.affectedRows == undefined || disableOTP.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }

                    let updateProfileData = await superAdminModel.updateSuperAdminEmailById(requestData.email,requestData.updated_at,requestData.updated_by,requestData.profile_id, conn);

                    if (updateProfileData.affectedRows == undefined || updateProfileData.affectedRows < 1) {
                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    }


                    
                        conn.query(queriesUser.updateUserEmailById(), [requestData.email, requestData.user_id,requestData.updated_at,requestData.updated_by], (error, result, fields) => {

                            if (error) {
                               
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            } else {

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


                        });
                    

                }
                

            });
        });
    });
}





module.exports = {
    getUserByUserName,
    getUserByUserNameOrEmail,
    getUserById,
    getUserDataById,
    getPendingUserById,
    updateUserPasswordByUserId,
    getUserByEmail,
    getUserByPhone,
    addNewUser,
    resetPasswordForUser,
    disableUserById,
    enableUserById,
    getUserDetailsById,
    updateUserPasswordUsingForgetPassword,
    updateAdminUserData,
    deleteUserById,
    updateUserProfileById,
    updateUserEmail

}

