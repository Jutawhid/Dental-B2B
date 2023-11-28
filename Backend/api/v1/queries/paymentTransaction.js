let table_name = "mtae_payment_transactions";

let addNewTransaction = () => {
    return `INSERT INTO ${table_name} SET ?`;
};

module.exports = {
    addNewTransaction,
}