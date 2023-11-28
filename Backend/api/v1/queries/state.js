let table_name = "mtae_states";

let getAllStateList = () => {
    return `SELECT * FROM ${table_name} order by name`;
}

let getStateById = () => {
    return `SELECT * FROM ${table_name} where id = ?`;
}

module.exports = {
    getAllStateList,
    getStateById
}