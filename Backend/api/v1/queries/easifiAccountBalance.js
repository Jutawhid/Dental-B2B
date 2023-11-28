let table_name = "mtae_easifi_account_balance";


let addNewBalanceRecords = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getAllEasifiBalanceRecordsById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;
}

let getBalanceByID = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;
}

let updateBalanceById = () => {
    return `UPDATE
    mtae_easifi_account_balance SET
    balance = ( SELECT
        SUM(
            CASE WHEN transaction_type = 1 THEN amount WHEN transaction_type = 2 THEN - amount ELSE 0
        END) AS balance 
        FROM mtae_user_balance_records
        WHERE  table_id = ? AND  STATUS  = 1) WHERE id = ?`;
}

let updateEasifiBalanceRecordsById = (data) => {
    let keys = Object.keys(data);

    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}


module.exports = {
    addNewBalanceRecords,
    getAllEasifiBalanceRecordsById,
    updateEasifiBalanceRecordsById,
    getBalanceByID,
    updateBalanceById
}