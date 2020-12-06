var express = require('express');
var router = express.Router();
const Promise = require("bluebird");
const fs = require('fs');
const CSVService = require('../services/CSV');

var csvLines = [];

router.get('/', async function(req, res, next) {

    csvLines = [];
    let csvFile = './retrogamingclub.csv';
    let api_key = process.env.KEY2;

    const csvService = new CSVService(csvLines, csvFile, api_key);

    let data = await csvService.getData();

    //console.log(JSON.stringify(data,null, 4));

    res.render('uploader', {
        title: "Upload your CSV",
        message: "Here is where you upload your CSV. " + "\n" + "Up to 100 searches can be made per API key.",
        data : data
    });

});

module.exports = router;
