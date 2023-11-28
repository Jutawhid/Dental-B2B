const { connectionEasifiMYSQL } = require('../connections/connection');
const queriesCaseCancelScenario = require('../queries/caseCancelScenario');

let getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour = async (serviceAssociatedType = "sender",  caseServiceStatus = 0, hourAlreadyPass = 0  ) => {
    return new Promise((resolve, reject) => {
        connectionEasifiMYSQL.query(queriesCaseCancelScenario.getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour(), [serviceAssociatedType, caseServiceStatus, hourAlreadyPass, hourAlreadyPass ], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

module.exports = {
    getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour
}

