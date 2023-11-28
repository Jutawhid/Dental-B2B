let table_name = "mtae_case_payment_records";

let addNewRecord = () => {
    return `INSERT INTO ${table_name} set ? `;
};

module.exports = {
    addNewRecord
}