
let table_name = "mtae_otp";

let getEmailChangeRequestByUserId = () => {
    return `SELECT * FROM ${table_name} where  user_id = ? and type = ?`;
}

let getRequestByOTP = () => {
    return `SELECT * FROM ${table_name} where  user_id = ? and type = ? and otp = ?`;
}



let updateEmailChangeRequest = () => {
    return `UPDATE ${table_name} set status = 0 where id = ?  `;
}

let addRequestMailChange = () => {
    return `INSERT INTO ${table_name} SET ? `;
}

let getActiveRequestByIdAndType = () => {
    return `SELECT * FROM ${table_name} where  user_id = ? and type = ? and status = 1`;
}


let updateCounter = () => {
    return `UPDATE ${table_name} set counter = ? where id = ?  `;
}


module.exports = {

    getEmailChangeRequestByUserId,
    getRequestByOTP,
    updateEmailChangeRequest,
    addRequestMailChange,
    getActiveRequestByIdAndType,
    updateCounter
}