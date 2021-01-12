var express = require('express');
var router = express.Router();
const Promise = require("bluebird");
const CSVService = require('../services/CSV');
const YouTubeService = require('../services/YouTube');
const _ = require("lodash");
const multer = require("multer");

var csvLines = [];

module.exports = (app) => {

    router.get('/', async function(req, res, next) {

        csvLines = [];

        res.render('uploader', {
            title: "Upload your CSV",
            message: "Here is where you upload your CSV. " + "\n" + "Up to 100 searches can be made per API key.",
            data : [],
            apiKeys : app.locals.apiKeys,
            selectedApiKey : app.locals.selectedapikey || undefined
        });

    });


    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage });

    router.post('/', upload.array('csvFile', 1), async function(req, res, next) {

        // console.log(req.body);
        // console.log(req.files);
        if(req.body.selectedapikey && req.files.length > 0) {

            if(req.files[0].mimetype !=="text/csv" && req.files[0].mimetype !=="application/octet-stream"){
                res.render('uploader', {
                    title: "Your CSV has not been uploaded",
                    message: "Please try again",
                    data : [],
                    error: "Only CSV files are supported... γαμώ τη Παναγία σας!",
                    apiKeys : app.locals.apiKeys
                });
            }else{
                csvLines = [];
                let csvBuffer = req.files[0].buffer
                let api_key = req.body.selectedapikey;

                const csvService = new CSVService(csvLines, csvBuffer, api_key);

                let data = await csvService.getBufferData();

                app.locals.searchData = data;
                app.locals.selectedapikey = req.body.selectedapikey;

                res.render('uploader', {
                    title: "Your CSV has been uploaded",
                    message: "Following are the 100 first results that are missing the YouTube embed code",
                    data : data,
                    apiKeys : app.locals.apiKeys
                });
            }

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

        console.log("Selected API Key: " + app.locals.selectedapikey);
        //console.log(app.locals.searchData);

        if(app.locals.searchData && app.locals.searchData.length > 0 && !_.isEmpty(app.locals.selectedapikey)){

            let promiseArray = [];
            _.forEach(app.locals.searchData, function(data){
                promiseArray.push(
                    new Promise((resolve, reject) => {
                        const youTubeService = new YouTubeService(data.virtuemart_product_id, data.search_term, app.locals.selectedapikey);
                        resolve(youTubeService.search());
                    })
                );
            })

            Promise.all(promiseArray)
                .then((values) => {
                    console.log("values:");
                    console.log(values);
                    return values
                }).then(function(results){

                    //console.log(results)

                    res.render('youtube', {
                        title: "Here are your embed codes",
                        message: "",
                        data : results || []
                    });

                }).catch(function(error){
                    console.log("error:");
                    console.log(error);
                    res.render('youtube', {
                        title: "Something went wrong! (" + error.error + ")",
                        message: error.message + " Please use a different API key",
                        error: error.error==="quotaExceeded"?"You don't have any more search credits left, γαμώ τη Παναγία σας!! Please try another API key, thank you.":"Something went wrong! (" + error.error + ")",
                        data : [error.message]
                    });
                });


            /*Promise.map(app.locals.searchData, function(row){
                //console.log(row.search_term)
                const youTubeService = new YouTubeService(row.virtuemart_product_id, row.search_term, app.locals.selectedapikey);
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
                res.render('youtube', {
                    title: "Something went wrong! (" + error.error + ")",
                    message: "Please use a different API key",
                    data : [error.message]
                });
            })*/

        }else{
            res.render('youtube', {
                title: "Something went wrong!",
                message: "",
                data : app.locals.searchData || []
            });
        }

        /*res.render('youtube', {
            title: "Here are your embed codes",
            message: "",
            data : app.locals.searchData || []
        });*/

    });

    return router;
}
