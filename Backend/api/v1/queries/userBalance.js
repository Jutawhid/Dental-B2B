let table_name = "mtae_user_account_balance";


let addInitialBalance = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getCurrentBalanceByUserID = () => {
    return `SELECT id,user_id,balance,status FROM ${table_name} where  user_id = ?  and status = 1 `;
}

let updateBalanceByUserId = () => {
    return `UPDATE
    ${table_name} SET
    balance = ( SELECT
        SUM(
            CASE WHEN transaction_type = 1 THEN amount WHEN transaction_type = 2 THEN - amount ELSE 0
        END) AS balance 
        FROM mtae_user_balance_records
        WHERE  user_id = ? AND  STATUS  = 1) WHERE user_id = ?`;
}



let updateUserBalance = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}

let updateUserBalanceByUserId = (data) => {
    let keys = Object.keys(data);

    console.log(data)
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where user_id = ? `;
    return query;
}



module.exports = {
    addInitialBalance,
    getCurrentBalanceByUserID,
    updateUserBalance,
    updateUserBalanceByUserId,
    updateBalanceByUserId
}