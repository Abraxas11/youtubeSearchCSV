var express = require('express');
var router = express.Router();
const Promise = require("bluebird");
const CSVService = require('../services/CSV');
const YouTubeService = require('../services/YouTube');
const _ = require("lodash");
const multer = require("multer");
const uuid = require("uuid").v4;

var csvLines = [];

module.exports = (app) => {

    router.get('/', async function(req, res, next) {

        csvLines = [];
        //let csvFile = './retrogamingclub.csv';
        //let api_key = process.env.KEY2;

        //const csvService = new CSVService(csvLines, csvFile, api_key);

        //let data = await csvService.getData();

        //app.locals.searchData = data;

        res.render('uploader', {
            title: "Upload your CSV",
            message: "Here is where you upload your CSV. " + "\n" + "Up to 100 searches can be made per API key.",
            data : [],
            apiKeys : app.locals.apiKeys
        });

    });


    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage });
    //var upload = multer({ dest: 'uploads/' })
    router.post('/', upload.array('csvFile', 1), async function(req, res, next) {

        console.log(req.body);
        console.log(req.files);
        if(req.body.apikeyselect && req.files.length > 0){
            csvLines = [];
            let csvBuffer = req.files[0].buffer
            let api_key = req.body.apikeyselect;

            const csvService = new CSVService(csvLines, csvBuffer, api_key);

            let data = await csvService.getBufferData();

            res.render('uploader', {
                title: "Your CSV has been uploaded",
                message: "Following are the 100 first results",
                data : data,
                apiKeys : app.locals.apiKeys
            });
        }else{
            res.render('uploader', {
                title: "Your CSV has not been uploaded",
                message: "Please try again",
                data : [],
                apiKeys : app.locals.apiKeys
            });
        }

    })

    router.get('/youtube', async function(req, res, next) {

        let api_key = process.env.KEY2;

        //const csvService = new CSVService(csvLines, csvFile, api_key);

        //let data = await csvService.getData();

        //console.log(JSON.stringify(data,null, 4));

        if(app.locals.searchData && app.locals.searchData.length > 0){

            Promise.map(app.locals.searchData, function(row){
                //console.log(row.search_term)
                const youTubeService = new YouTubeService(row.search_term, api_key);
                return youTubeService.search();

            }).then(function(results){

                console.log(results)

                res.render('youtube', {
                    title: "Here are your embed codes",
                    message: "",
                    data : results || []
                });

            }).catch(function(error){
                console.log(error);
            })

        }else{
            res.render('youtube', {
                title: "Here are your embed codes",
                message: "",
                data : app.locals.searchData || []
            });
        }

    });

    return router;
}
