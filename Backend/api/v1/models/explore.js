const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesExplore = require('../queries/explore');

// Promises Method

let getExploreConsultantList = async (limit = 0) => {
    console.log(limit)
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesExplore.getExploreConsultantList(),[limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getExploreLabList = async (limit = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesExplore.getExploreLabList(),[limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getExploreTechList = async (limit = 0) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesExplore.getExploreTechList(),[limit], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    getExploreConsultantList,
    getExploreLabList,
    getExploreTechList
}

