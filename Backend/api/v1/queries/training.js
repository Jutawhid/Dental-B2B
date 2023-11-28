let table_name = "mtae_trainings";
let table_training_document = "mtae_trainings_document";

let getTrainingListByUserId = () => {
    return `SELECT id, user_id, title ,description ,status FROM ${table_name} 
    where  user_id = ? and status = 1
    order by id DESC`;
}

let getTrainingById = () => {
    return `SELECT id, user_id, title ,description ,status FROM ${table_name} where  id = ? and status = 1`;
}

let getTrainingByName = () => {
    return `SELECT id, user_id, title ,description ,status FROM ${table_name} where  user_id = ? and title = ? and status = 1`;
}

let addNewTraining = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let deleteTrainingById = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where id = ?  `;
};

let updateTraining = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where id = ? `;
   

    return query;
}


module.exports = {
    getTrainingListByUserId,
    getTrainingById,
    getTrainingByName,
    addNewTraining,
    deleteTrainingById,
    updateTraining
}