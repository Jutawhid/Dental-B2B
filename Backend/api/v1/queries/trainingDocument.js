let table_name = "mtae_trainings_document";


let getDocumentListByTrainingId = () => {
    return `SELECT id, training_id, file_original_name,file_temp_name ,status FROM ${table_name} where  training_id = ? and status = 1`;
}

let addDocument = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let deleteDocumentByTrainingId = () => {
    return `UPDATE ${table_name} set status = 0 , updated_by= ? , updated_at = ? where training_id = ?  `;
};

let updateDocument = (data) => {
    let keys = Object.keys(data);
    
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] +  ` = ? `;
    }

    query += ` where training_id = ? `;
   

    return query;
}


module.exports = {
    getDocumentListByTrainingId,
    addDocument,
    deleteDocumentByTrainingId,
    updateDocument
}