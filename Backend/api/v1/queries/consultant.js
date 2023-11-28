let table_name = "mtae_consultants";
let table_zip = "mtae_zipcodes";


let getAllConsultantList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image,${table_name}.cover_image,${table_name}.status,
    ${table_name}.zip_id, ${table_zip}.zip_code ,${table_zip}.city_id, ${table_zip}.city_name ,${table_zip}.state_id, ${table_zip}.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT ${table_zip}.id,${table_zip}.code as zip_code,${table_zip}.city_id, mtae_cities.name as city_name ,${table_zip}.state_id,
        mtae_states.name as state_name from ${table_zip} 
        JOIN mtae_cities on (${table_zip}.city_id = mtae_cities.id)
        JOIN mtae_states on (${table_zip}.state_id = mtae_states.id)
      )
        
      ${table_zip} ON
    (${table_zip}.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 4 and ${table_name}.status > 0
    order by ${table_name}.id ASC
    `;
}

let getActiveConsultantList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image,${table_name}.cover_image,${table_name}.status,
    ${table_name}.zip_id, ${table_zip}.zip_code ,${table_zip}.city_id, ${table_zip}.city_name ,${table_zip}.state_id, ${table_zip}.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT ${table_zip}.id,${table_zip}.code as zip_code,${table_zip}.city_id, mtae_cities.name as city_name ,${table_zip}.state_id,
        mtae_states.name as state_name from ${table_zip} 
        JOIN mtae_cities on (${table_zip}.city_id = mtae_cities.id)
        JOIN mtae_states on (${table_zip}.state_id = mtae_states.id)
      )
        
      ${table_zip} ON
    (${table_zip}.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 4 and ${table_name}.status = 1 
    order by ${table_name}.ratings DESC
    `;
}


let getConsultantListByName = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image,${table_name}.cover_image,${table_name}.status,
    ${table_name}.zip_id, ${table_zip}.zip_code ,${table_zip}.city_id, ${table_zip}.city_name ,${table_zip}.state_id, ${table_zip}.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT ${table_zip}.id,${table_zip}.code as zip_code,${table_zip}.city_id, mtae_cities.name as city_name ,${table_zip}.state_id,
        mtae_states.name as state_name from ${table_zip} 
        JOIN mtae_cities on (${table_zip}.city_id = mtae_cities.id)
        JOIN mtae_states on (${table_zip}.state_id = mtae_states.id)
      )
        
      ${table_zip} ON
    (${table_zip}.id = ${table_name}.zip_id)
    WHERE (${table_name}.first_name LIKE ? or ${table_name}.last_name LIKE ?)
    and mtae_users.role_id = 4 and ${table_name}.status = 1 
    order by ${table_name}.id ASC
    `;
}




let getAllConsultantListWithLimit = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image,${table_name}.cover_image,${table_name}.status,
    ${table_name}.zip_id, ${table_zip}.zip_code ,${table_zip}.city_id, ${table_zip}.city_name ,${table_zip}.state_id, ${table_zip}.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT ${table_zip}.id,${table_zip}.code as zip_code,${table_zip}.city_id, mtae_cities.name as city_name ,${table_zip}.state_id,
        mtae_states.name as state_name from ${table_zip} 
        JOIN mtae_cities on (${table_zip}.city_id = mtae_cities.id)
        JOIN mtae_states on (${table_zip}.state_id = mtae_states.id)
      )
        
      ${table_zip} ON
    (${table_zip}.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 4 and ${table_name}.status > 0
    order by ${table_name}.id ASC
    LIMIT  ?`;
}

let getNextConsultantList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image,${table_name}.cover_image,${table_name}.status,
    ${table_name}.zip_id, ${table_zip}.zip_code ,${table_zip}.city_id, ${table_zip}.city_name ,${table_zip}.state_id, ${table_zip}.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT ${table_zip}.id,${table_zip}.code as zip_code,${table_zip}.city_id, mtae_cities.name as city_name ,${table_zip}.state_id,
        mtae_states.name as state_name from ${table_zip} 
        JOIN mtae_cities on (${table_zip}.city_id = mtae_cities.id)
        JOIN mtae_states on (${table_zip}.state_id = mtae_states.id)
      )
        
      ${table_zip} ON
    (${table_zip}.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 4 and ${table_name}.id > ? and ${table_name}.status > 0
    order by ${table_name}.id ASC
    LIMIT  ?`;
}



let getConsultantById = () => {
    return `SELECT id,ratings, completed_case,service_cancel_availability, first_name, last_name, email, phone, fax, address,zip_id, npi_number, license, profile_image,cover_image,description,status FROM ${table_name} where  id = ?  and status = 1 `;

}

let getConsultantForOtherById = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, profile_image, cover_image, description FROM ${table_name} where  id = ?  and status = 1 `;
}

let getConsultantDataById = () => {
    return `SELECT id,ratings,completed_case,service_cancel_availability, first_name, last_name, email, phone, fax, address,zip_id, npi_number, license, profile_image,cover_image,description,status FROM ${table_name} where  id = ?`;

}

let getConsultantByNpi = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, profile_image,cover_image, fax, address, npi_number, license, status
         FROM ${table_name} where  npi_number = ? and status = 1 `;
}

let getConsultantByLicense = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, profile_image,cover_image, fax, address, npi_number, license, status
         FROM ${table_name} where  license = ? and status = 1 `;
}

let addNewConsultant = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let disableConsultantById = () => {
    return `UPDATE ${table_name} set status = 2 , updated_by= ? , updated_at = ? where id = ?  `;
}

let enableConsultantById = () => {
    return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let deleteConsultantById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}

let updateConsultantById = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let updateConsultantEmailById = () => {
    return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ?  `;
}

let updateRatingById = () => {
    return `UPDATE ${table_name} set ratings = ? , completed_case = ?, updated_at= ?   where id = ?  `;
}

module.exports = {
    getActiveConsultantList,
    getAllConsultantListWithLimit,
    getAllConsultantList,
    getNextConsultantList,
    getConsultantById,
    getConsultantDataById,
    getConsultantByNpi,
    getConsultantByLicense,
    addNewConsultant,
    disableConsultantById,
    enableConsultantById,
    deleteConsultantById,
    updateConsultantById,
    updateConsultantEmailById,
    getConsultantForOtherById,
    getConsultantListByName,
    updateRatingById,
}