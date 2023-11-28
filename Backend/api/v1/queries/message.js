
let table_name = "mtae_messages";


let getMessageList = () => {
    return `SELECT * from ${table_name} where id in (
        SELECT Max(id) as id
    FROM ${table_name} where (sender_id = ? or receiver_id = ?) and (sender_id != receiver_id) and status  = 1 
    GROUP by (CASE
        WHEN sender_id = ? THEN receiver_id
        ELSE sender_id
    END)) order by created_at DESC `;
}

let getMessageDetails = () => {
    return `SELECT * FROM ${table_name} where ((sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?))
     and status  = 1 order by id ASC`;
}

let getMessageById = () => {
    return `SELECT * FROM ${table_name} where id = ? and status  = 1 `;
}

let addNewMessage = () => {
    return `INSERT INTO ${table_name} SET ? `;
}

let updateMessageSeenId = () => {
    return `UPDATE ${table_name} set is_seen = 1, updated_by= ? , updated_at = ? where id = ? and status = 1`;
}


module.exports = {
    getMessageList,
    getMessageDetails,
    getMessageById,
    addNewMessage,
    updateMessageSeenId
}