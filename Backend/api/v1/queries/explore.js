let user_table = "mtae_users";
let consultant_table = "mtae_consultants";
let lab_table = "mtae_labs";
let tech_table = "mtae_techs";
let service_table = "mtae_services";

let getExploreConsultantList = () => {

    return `SELECT ${consultant_table}.id, ${consultant_table}.first_name, ${consultant_table}.last_name,${consultant_table}.description,
     ${consultant_table}.profile_image,${consultant_table}.cover_image,${consultant_table}.status,
     ${user_table}.id as user_id,${user_table}.role_id as role_id
     FROM ${consultant_table}
     JOIN ${user_table} on (${consultant_table}.id = ${user_table}.profile_id)
     WHERE ${user_table}.role_id = 4 and ${consultant_table}.status = 1 and ${user_table}.status = 1
     LIMIT  ?`;
}

let getExploreLabList = () => {

    return `SELECT ${lab_table}.id, ${lab_table}.name,${lab_table}.description,${lab_table}.profile_image,${lab_table}.cover_image,
    ${lab_table}.status,
    ${user_table}.id as user_id,${user_table}.role_id as role_id
    FROM ${lab_table} 
    JOIN ${user_table} on (${lab_table}.id = ${user_table}.profile_id) 
    WHERE ${user_table}.role_id = 5 and ${lab_table}.status = 1 and ${user_table}.status = 1
    LIMIT  ?`;
}

let getExploreTechList = () => {

    return `SELECT ${tech_table}.id, ${tech_table}.name,${tech_table}.description,${tech_table}.profile_image,${tech_table}.cover_image,
    ${tech_table}.status,
    ${user_table}.id as user_id,${user_table}.role_id as role_id
    FROM ${tech_table} 
    JOIN ${user_table} on (${tech_table}.id = ${user_table}.profile_id) 
    WHERE ${user_table}.role_id = 6 and ${tech_table}.status = 1 and ${user_table}.status = 1
    LIMIT  ?`;
}


// SELECT * FROM `mtae_labs` WHERE name LIKE '%t%' and zip_id IN ( SELECT id from mtae_zipcodes where state_id = 1) and  id IN (
//     select mtae_users.profile_id from mtae_users 
//     Inner JOIN  mtae_user_provide_services on mtae_user_provide_services.user_id = mtae_users.id
//      where mtae_users.status = 1 and mtae_user_provide_services.service_id In (3,4) AND mtae_users.role_id = 5) and 
//      id IN ( 
//          select mtae_users.profile_id from mtae_users where id In ( SELECT user_id FROM `mtae_case_members` where service_status = 3 GROUP by user_id HAVING COUNT(id) >= 1)
//          )




module.exports = {
    getExploreConsultantList,
    getExploreLabList,
    getExploreTechList,
}