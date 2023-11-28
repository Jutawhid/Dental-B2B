let table_name = "mtae_cities";

let getCityById = () => {
    return `SELECT * FROM ${table_name} where id = ?`;
}

let getCityListByStateId = () => {
    return `SELECT * FROM ${table_name} where state_id = ? order by name`;
}

module.exports = {
    getCityById,
    getCityListByStateId,
}