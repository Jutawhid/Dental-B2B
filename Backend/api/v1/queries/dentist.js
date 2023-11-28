let table_name = "mtae_dentists";


let getAllDentistList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings,${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image ,${table_name}.status,
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
    WHERE mtae_users.role_id = 3  and ${table_name}.status > 0
    order by ${table_name}.id ASC 
    `;
}

let getActiveDentistList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings,${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image ,${table_name}.status,
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
    WHERE mtae_users.role_id = 3  and ${table_name}.status = 1
    order by ${table_name}.id ASC 
    `;
}

let getDentistListByName = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings,${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image ,${table_name}.status,
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
    WHERE (${table_name}.first_name LIKE ? or ${table_name}.last_name LIKE ?)
    and mtae_users.role_id = 3  and ${table_name}.status = 1
    order by ${table_name}.id ASC `;
}


let getAllDentistListWithLimit = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings,${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image ,${table_name}.status,
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
    WHERE mtae_users.role_id = 3  and ${table_name}.status > 0
    order by ${table_name}.id ASC 
    LIMIT  ?`;
}

let getNextDentistList = () => {
    
    return `SELECT ${table_name}.id,${table_name}.ratings,${table_name}.completed_case, ${table_name}.first_name, ${table_name}.last_name, ${table_name}.email, ${table_name}.phone, ${table_name}.fax,
    ${table_name}.address, ${table_name}.npi_number, ${table_name}.license, ${table_name}.profile_image ,${table_name}.status,
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
    WHERE mtae_users.role_id = 3  and ${table_name}.id > ? and ${table_name}.status > 0 
    order by ${table_name}.id ASC 
    LIMIT  ?`;
}

let getDentistById = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, fax, address,zip_id, npi_number, license, profile_image,status FROM ${table_name} where  id = ?  and status = 1 `;
//     return `SELECT mtae_dentists.id, mtae_dentists.first_name, mtae_dentists.last_name, mtae_dentists.email, mtae_dentists.phone,

//     mtae_dentists.fax, mtae_dentists.address, mtae_dentists.npi_number, mtae_dentists.license, mtae_dentists.profile_image,mtae_dentists.zip_id,
   
//    mtae_zipcodes.zip_code ,mtae_zipcodes.city_id, mtae_zipcodes.city_name ,mtae_zipcodes.state_id, mtae_zipcodes.state_name 
   
//    FROM mtae_dentists
   
//    join (SELECT mtae_zipcodes.id,mtae_zipcodes.code as zip_code,mtae_zipcodes.city_id, mtae_cities.name as city_name ,mtae_zipcodes.state_id,
//      mtae_states.name as state_name from mtae_zipcodes 
//    JOIN mtae_cities on (mtae_zipcodes.city_id = mtae_cities.id)
//    JOIN mtae_states on (mtae_zipcodes.state_id = mtae_states.id)
//    )
   
//    mtae_zipcodes ON
//    (mtae_zipcodes.id = mtae_dentists.zip_id)
   
//    where  mtae_dentists.id = ? and mtae_zipcodes.id = mtae_dentists.zip_id and mtae_dentists.status = 1`;
}
let getDentistDataById = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, fax, address,zip_id, npi_number, license, profile_image,status FROM ${table_name} where  id = ?  `;

}
let getDentistByNpi = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, profile_image, fax, address, npi_number, license, status
         FROM ${table_name} where  npi_number = ? and status = 1 `;
}

let getDentistByLicense = () => {
    return `SELECT id,ratings,completed_case, first_name, last_name, email, phone, profile_image, fax, address, npi_number, license, status
         FROM ${table_name} where  license = ? and status = 1 `;
}

let addNewDentist = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let verifyDentist = () => {
    return `UPDATE ${table_name} set status = 1 , updated_at = ? where id = ?  `;
}

let disableDentistById = () => {
    return `UPDATE ${table_name} set status = 2 , updated_by= ? , updated_at = ? where id = ?  `;
}

let enableDentistById = () => {
    return `UPDATE ${table_name} set status = 1 , updated_by= ? , updated_at = ? where id = ?  `;
}

let deleteDentistById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
}

let updateDentistById = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}

let updateDentistEmailById = () => {
    return `UPDATE ${table_name} set email = ? , updated_at = ?, updated_by= ?   where id = ?  `;
}

let updateRatingById = () => {
    return `UPDATE ${table_name} set ratings = ? , completed_case = ?, updated_at= ?   where id = ?  `;
}

module.exports = {
    getAllDentistListWithLimit,
    getActiveDentistList,
    getNextDentistList,
    getAllDentistList,
    getDentistById,
    getDentistDataById,
    getDentistByNpi,
    getDentistByLicense,
    addNewDentist,
    verifyDentist,
    disableDentistById,
    enableDentistById,
    deleteDentistById,
    updateDentistById,
    updateDentistEmailById,
    getDentistListByName,
    updateRatingById,      
}