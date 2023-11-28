const axios = require('axios');


let npiCheck = async (npiId = "12") => {


    return new Promise((resolve, reject) => {

        try {

            if (typeof (npiId) !== "number") {
                npiId = parseInt(npiId);
            }

            axios.get(`https://npiregistry.cms.hhs.gov/api/?number=${npiId}&enumeration_type=NPI-1&pretty=on&version=2.1`)
                .then(function (response) {

                    if (response.data.hasOwnProperty('result_count')) {
                        if (response.data.result_count == 0) {

                            resolve({
                                result: false,
                                message: "unknown NPI Id"
                            });

                        } else {

                            let basicInfo = {
                                "firstName": response.data.results[0].basic.hasOwnProperty('first_name') ? response.data.results[0].basic.first_name : "",
                                "lastName": response.data.results[0].basic.hasOwnProperty('last_name') ? response.data.results[0].basic.last_name : "",
                                "name": response.data.results[0].basic.hasOwnProperty('name') ? response.data.results[0].basic.name : (basicInfo.firstName + " " + basicInfo.lastName),
                                "gender": response.data.results[0].basic.hasOwnProperty('gender') ? response.data.results[0].basic.gender : "",
                                "license": "",
                                "desc": "",
                            }

                            if (response.data.results[0].hasOwnProperty("taxonomies") && response.data.results[0].taxonomies.length > 0) {
                                basicInfo.license = response.data.results[0].taxonomies[0].hasOwnProperty('license') ? response.data.results[0].taxonomies[0].license : "";
                                basicInfo.desc = response.data.results[0].taxonomies[0].hasOwnProperty('desc') ? response.data.results[0].taxonomies[0].desc : "";
                            }

                            if (response.data.results[0].hasOwnProperty("addresses") && response.data.results[0].addresses.length > 0) {

                                if (response.data.results[0].addresses[0].hasOwnProperty('address_2')) {
                                    delete response.data.results[0].addresses[0].address_2;
                                }

                                if (response.data.results[0].addresses[0].hasOwnProperty('address_1')) {
                                    response.data.results[0].addresses[0].address = response.data.results[0].addresses[0].address_1;
                                    delete response.data.results[0].addresses[0].address_1;
                                }

                                basicInfo = { ...basicInfo, ...response.data.results[0].addresses[0] }
                            }

                            resolve({
                                result: true,
                                message: "NPI data found",
                                data: basicInfo
                            })
                        }
                    } else {

                        resolve({
                            result: false,
                            message: "unknown NPI Id"
                        });
                    }

                }).catch(function (error) {
                    resolve({
                        result: false,
                        message: "error found"
                    });
                });

        } catch (error) {

            resolve({
                result: false,
                message: "error found"
            });
        }
    });

}

module.exports = {
    npiCheck
}