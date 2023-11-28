let table_name = "mtae_case_cancel_scenarios";

let getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour = () => {
    return `select * from ${table_name}  where status = 1 and service_associated_type = ? and  case_service_status = ? and allow_hours_min < ? 
    and (allow_hours_max >= ? or allow_hours_max = -1)`;
}

module.exports = {
    getCaseCancelScenarioByAssociatedTimeStatusAndPassedHour
}