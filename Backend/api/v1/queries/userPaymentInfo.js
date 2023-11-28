let table_name = "mtae_user_payment_info";

let addPaymentInfo = () => {
    return `INSERT INTO ${table_name} SET ?`;
  };


let deletePaymentInfo = () => {
  return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where user_id = ? and table_name = ? and table_id = ?`;
};              

module.exports = {
    addPaymentInfo,
    deletePaymentInfo
}