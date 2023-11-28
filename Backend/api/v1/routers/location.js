
const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const roleModel = require('../models/role');
const stateModel = require('../models/state');
const cityModel = require('../models/city');
const zipModel = require('../models/zip');

const { routeAccessChecker } = require('../middlewares/routeAccess');

const commonObject = require('../common/common');

router.get('/stateList', async (req, res) => {

    let result = await stateModel.getAllStateList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "All State List",
        "count" : result.length,
        "data": result
    });
});

router.get('/cityListByStateId/:state_id', async (req, res) => {
    
    let stateId = req.params.state_id;

    if (isEmpty(stateId)) {

        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Please provide state id."
            });
    }

    let validateId = await commonObject.checkItsNumber(stateId);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "State Value should be integer."
        });
    } else { 
        req.params.state_id = validateId.data;
        stateId = validateId.data;
    }

    let stateData = await stateModel.getStateById(stateId);

    if (isEmpty(stateData)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No State found",

        });
    }

    let result = await cityModel.getCityListByStateId(stateId);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "All City List",
        "count" : result.length,
        "data": result
    });


});

router.get('/zipListByCityId/:city_id', async (req, res) => {
    
    let cityId = req.params.city_id;

    if (isEmpty(cityId)) {

        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Please provide city id."
            });
    }

    let validateId = await commonObject.checkItsNumber(cityId);

    if (validateId.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "City Value should be integer."
        });
    } else {
        req.params.city_id = validateId.data;
        cityId = validateId.data;
        
    }

    let cityData = await cityModel.getCityById(cityId);

    if (isEmpty(cityData)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No City found",

        });
    }

    let result = await zipModel.getZipListByCityId(cityId);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "All Zip List",
        "count" : result.length,
        "data": result
    });


});



router.get('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});


router.post('/*', (req, res) => {
    return res.status(404)
        .send({
            'status': 404,
            'message': "unknown route",
            "success": false
        })
});

module.exports = router;