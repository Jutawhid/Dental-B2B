let table_name = "mtae_labs";


let getAllLabList = () => {
    
   
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax, ${table_name}.address, ${table_name}.license,
    ${table_name}.cover_image, ${table_name}.profile_image  ,${table_name}.status,
    ${table_name}.zip_id, mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
        mtae_states.name as state_name from mtae_zipcodes 
        JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
        JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
      )
        
    mtae_zipcodes ON
    (mtae_zipcodes.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 5 and ${table_name}.status > 0
    order by ${table_name}.id ASC
    `;
} 

let getActiveLabList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax, ${table_name}.address, ${table_name}.license,
    ${table_name}.cover_image, ${table_name}.profile_image  ,${table_name}.status,
    ${table_name}.zip_id, mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
        mtae_states.name as state_name from mtae_zipcodes 
        JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
        JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
      )
        
    mtae_zipcodes ON
    (mtae_zipcodes.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 5 and ${table_name}.status = 1
    order by ${table_name}.ratings DESC
    `;
}

let getLabListByName = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax, ${table_name}.address, ${table_name}.license,
    ${table_name}.cover_image, ${table_name}.profile_image  ,${table_name}.status,
    ${table_name}.zip_id, mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
        mtae_states.name as state_name from mtae_zipcodes 
        JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
        JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
      )
        
    mtae_zipcodes ON
    (mtae_zipcodes.id = ${table_name}.zip_id)
    WHERE ${table_name}.name LIKE ? and 
    mtae_users.role_id = 5 and ${table_name}.status = 1
    order by ${table_name}.id ASC
    `;
}



let getAllLabListWithLimit = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax, ${table_name}.address, ${table_name}.license,
    ${table_name}.cover_image, ${table_name}.profile_image  ,${table_name}.status,
    ${table_name}.zip_id, mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
        mtae_states.name as state_name from mtae_zipcodes 
        JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
        JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
      )
        
    mtae_zipcodes ON
    (mtae_zipcodes.id = ${table_name}.zip_id)
    WHERE mtae_users.role_id = 5 and ${table_name}.status > 0
    order by ${table_name}.id ASC
    LIMIT  ?`;
}

let getNextLabList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings, ${table_name}.completed_case, ${table_name}.name,${table_name}.description, ${table_name}.email, ${table_name}.phone, ${table_name}.fax, ${table_name}.address, ${table_name}.license,
    ${table_name}.cover_image, ${table_name}.profile_image  ,${table_name}.status,
    ${table_name}.zip_id, mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name ,
    mtae_users.id as user_id,mtae_users.role_id as role_id FROM ${table_name} 
    JOIN mtae_users on (${table_name}.id = mtae_users.profile_id) 
    JOIN (
        SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
        mtae_states.name as state_name from mtae_zipcodes 
        JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
        JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
      )
        
    mtae_zipcodes ON
    (mtae_zipcodes.id = ${table_name}.zip_id)   
    WHERE mtae_users.role_id = 5 and ${table_name}.id > ? and ${table_name}.status > 0
    order by ${table_name}.id ASC
    LIMIT  ?`;
} 

let getLabById = () => {
    return `SELECT id,ratings,completed_case,service_cancel_availability, name, email, phone, fax, address,zip_id, license, cover_image, profile_image,description,status FROM ${table_name} where  id = ?  and status = 1 `;

}

let getLabForOtherById = () => {
    return `SELECT id,ratings,completed_case, name,  cover_image, profile_image, description FROM ${table_name} where  id = ?  and status = 1 `;
}

let getLabDataById = () => {
    return `SELECT id,ratings,completed_case, name, email, phone, fax, address,zip_id, license, cover_image, profile_image,description,status FROM ${table_name} where  id = ?  `;
}

let addNewLab = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let disableLabById = () => {
    return `UPDATE ${table_name} set status = 2 , updated_by= ? , updated_at = ? where id = ?  `;
}

let enableLabById = () => {
    return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let deleteLabById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}

let getLabByLicense = () => {
    return `SELECT id,ratings,completed_case, name, email, phone, fax, address,zip_id, license, cover_image, profile_image,status
         FROM ${table_name} where  license = ? and status = 1 `;
}

let updateLabById = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let updateLabEmailById = () => {
    return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ?  `;
}

let updateRatingById = () => {
    return `UPDATE ${table_name} set ratings = ? , completed_case = ?, updated_at= ?   where id = ?  `;
}

module.exports = {
    getAllLabList,
    getActiveLabList,
    getNextLabList,
    getAllLabListWithLimit,
    getLabById,
    getLabDataById,
    addNewLab,
    disableLabById,
    enableLabById,
    deleteLabById,
    updateLabById,
    getLabByLicense,
    updateLabEmailById,
    getLabForOtherById,
    getLabListByName,
    updateRatingById,
}