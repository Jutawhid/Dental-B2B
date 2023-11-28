let table_name = "mtae_customer_payable_amount";
let case_member_table = "mtae_case_members";

let addNewCustomerPayableAmount = () => {
    return `INSERT INTO ${table_name} set ? `;
};

let getPaymentRequestInfoByIdAndPaymentSenderId = () => {
    return `Select * from ${table_name} where id = ? and payment_sender_id = ?`;
};

let updatePaymentRequestByID = (keys) => {
    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;
    return query;
}

let getMyCaseCompletedListByCaseId = () => {
    return `Select * from ${table_name} where table_id In (SELECT id FROM ${case_member_table}  where case_id = ? and status = 1) 
    and payment_sender_id = ? and table_name = ? and  status = 1 `;
};

let getCaseApprovedPaymentsByCaseId = () => {
    
    return `Select * from ${table_name} where table_id In (SELECT id FROM ${case_member_table}  where case_id = ? and 
        service_status = 3 and status = 1) 
    and is_approve = 1 and table_name = ? and  status = 1 `;
};


let getCaseApprovedPaymentsByCaseIdAndUserId = () => {
 
    return `Select * from ${table_name} where table_id In (SELECT id FROM ${case_member_table}  where case_id = ? and 
        service_status = 3 and status = 1) 
    and is_approve = 1 and table_name = ? and payment_sender_id = ? and  status = 1 `;
};


let getInvoicesByUserId = () => {
    return `Select * from ${table_name} where (payment_sender_id = ? or payment_receiver_id = ?) and is_approve = 1 and status = 1 order by id DESC`;
};

let getInvoiceDetailsById = () => {
    return `Select * from ${table_name} where id = ? and is_approve = 1 and status = 1`;
};

let getAllInvoicesList = () => {
    return `Select * from ${table_name} where  is_approve = 1 and status = 1 order by id DESC`;
};


let getCompletedCaseListByUserId = () => {
    return `Select * from ${table_name} where payment_receiver_id = ? and is_approve = 1 and status = 1 order by id DESC`;
};


module.exports = {
    addNewCustomerPayableAmount,
    getPaymentRequestInfoByIdAndPaymentSenderId,
    updatePaymentRequestByID,
    getMyCaseCompletedListByCaseId,
    getCaseApprovedPaymentsByCaseId,
    getCaseApprovedPaymentsByCaseIdAndUserId,
    getInvoicesByUserId,
    getInvoiceDetailsById,
    getAllInvoicesList,
    getCompletedCaseListByUserId
}