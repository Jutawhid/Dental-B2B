let table_name = "mtae_user_balance_records";

let addNewUserBalanceRecord = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getAllBalanceRecordsByUserID = () => {
    return `SELECT id, starting_amount, ending_amount, amount, reason, transaction_type , status, created_at  FROM ${table_name} where  user_id = ?  and status = 1 order by id DESC`;
}

let getAllBalanceRecordsByID = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 order by id DESC `;
}

let getTotalInBalanceByUserId = () => {
    return `select sum(amount) as total_in_balance from ${table_name} where transaction_type = 1 and user_id = ?`;
}

let getTotalOutBalanceByUserId = () => {
    return `select sum(amount) as total_out_balance from ${table_name} where transaction_type = 2 and user_id = ?`;

    // select sum(amount) as total_out_balance from mtae_user_balance_records where transaction_type = 2 and user_id = 0;
}



module.exports = {
    addNewUserBalanceRecord,
    getAllBalanceRecordsByUserID,
    getAllBalanceRecordsByID,
    getTotalInBalanceByUserId,
    getTotalOutBalanceByUserId

}