let table_name = "mtae_zipcodes";



let getZipListByCityId = () => {
    return `SELECT * FROM ${table_name} where city_id = ? order by code`;
}

let getZipById = () => {
    return `SELECT * FROM ${table_name} where id = ?`;
}

let getZipDetailsById = () => {
    return `SELECT ${table_name}.id , ${table_name}.code ,${table_name}.city_id, mtae_cities.name as city_name , ${table_name}.state_id,mtae_states.name as state_name from ${table_name} 
    JOIN mtae_cities on (${table_name}.city_id = mtae_cities.id)
    JOIN mtae_states on (${table_name}.state_id = mtae_states.id)
    
    where ${table_name}.id = ?`;
}

module.exports = {
    
    getZipListByCityId,
    getZipDetailsById,
    getZipById
}