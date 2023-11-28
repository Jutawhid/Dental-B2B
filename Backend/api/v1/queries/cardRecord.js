let table_name = "mtae_card_records";
let table_gateway_name = "mtae_payment_gateways";
let table_user_payment_info = "mtae_user_payment_info";

let getCardListByUserId = () => {
  return `SELECT ${table_name}.id,${table_name}.is_default,${table_name}.user_id,${table_name}.gateway_id,${table_gateway_name}.name,${table_user_payment_info}.user_payment_info_type,
  ${table_name}.cvv_no,
  ${table_name}.card_number,${table_name}.card_holder,${table_name}.expired_date FROM ${table_name}
  JOIN ${table_gateway_name} on (${table_name}.gateway_id = ${table_gateway_name}.id)
  JOIN ${table_user_payment_info} on (${table_user_payment_info}.table_id = ${table_name}.id)
  where  ${table_name}.user_id = ? and ${table_name}.status = 1 and ${table_user_payment_info}.status = 1`;
}

let getCardData = () => {
  return `SELECT * FROM ${table_name} where  user_id = ? and gateway_id = ? and card_type = ? and cvv_no = ? and card_number = ?
  and card_holder = ? and expired_date = ? and status = 1`;
 
}

let getExistingCardsByUserId = () => {
  return `SELECT * FROM ${table_name} where   user_id = ? and status = 1`;
 
}

let getCardDetailsById = () => {
  return `SELECT * FROM ${table_name} where  id = ? and user_id = ? and status = 1`;
}

let addNewCard = () => {
    return `INSERT INTO ${table_name} SET ?`;
};


let updateCardData = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let makeDefault = () => {
  return `UPDATE ${table_name} set is_default = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let setDefaultZeroOfOtherCards = () => {
  return `UPDATE ${table_name} set is_default = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}

let deleteCard = () => {
  return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}




module.exports = {
    getCardListByUserId,
    getExistingCardsByUserId,
    addNewCard,
    getCardDetailsById,
    getCardData,
    updateCardData,
    makeDefault,
    setDefaultZeroOfOtherCards,
    deleteCard
}