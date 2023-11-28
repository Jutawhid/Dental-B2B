let table_name = "mtae_stripes";
// let table_gateway_name = "mtae_payment_gateways";
// let table_user_payment_info = "mtae_user_payment_info";

let getStripeAccountByUserId = () => {
  return `SELECT id,user_id,account_id,account_status,created_at,updated_at from  ${table_name} where user_id = ? and status = 1 `;
}

let getStripeDetailsById = () => {
  return `SELECT id,user_id,account_id,account_status,created_at,updated_at FROM ${table_name} where  id = ? and user_id = ? and status = 1`;
}

let addNewStripeAccount = () => {
  return `INSERT INTO ${table_name} SET ?`;
};


let updateStripeAccountDataByID = (data) => {
  let keys = Object.keys(data);

  let query = `update ${table_name} set ` + keys[0] + ` = ? `;

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i] + ` = ? `;
  }

  query += ` where id = ? `;


  return query;
}





module.exports = {
  getStripeAccountByUserId,
  addNewStripeAccount,
  getStripeDetailsById,
  updateStripeAccountDataByID
}