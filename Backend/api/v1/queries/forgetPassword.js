
let table_name = "mtae_forget_password";

// forget password code
let insertForgetPassword = () => {
    return "INSERT INTO `mtae_forget_password` SET ? ";
}

let getUserByToken = () => {
    return "SELECT id, user_id, reset_token ,expired_time,status FROM `mtae_forget_password` where  reset_token = ?";
}

let disableLinkById = () => {
    return "UPDATE `mtae_forget_password` set status = 0  where id = ?  ";
}


module.exports = {
    
    insertForgetPassword,
    getUserByToken,
    disableLinkById
}