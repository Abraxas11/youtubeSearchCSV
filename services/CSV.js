const fs = require('fs');
const Promise = require("bluebird");
const csv = require('fast-csv');
const YouTubeService = require('./YouTube');
const { Readable } = require('stream');

/**
 * Logic for reading and writing CSV data
 */
class CSVService {
    /**
     * Constructor
     * @param {*} csvLines - The variable that will hold the final data
     * @param {*} csvFile - Path to a CSV file that contains the data
     * @param {*} api_key - The api key to use
     */
    constructor(csvLines, csvFile, api_key) {
        this.csvLines = csvLines;
        this.csvFile = csvFile;
        this.api_key = api_key;
        this.count = 0;
    }

    /**
     * Fetches feedback data from the JSON file provided to the constructor
     */
    async getData() {

        let self = this;

        return new Promise(function(resolve, reject) {

            readCSV(self.csvLines, self.csvFile, self.api_key).then(function (csvLines) {
                resolve(csvLines);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

    /**
     * Fetches feedback data from the JSON file provided to the constructor
     */
    async getBufferData() {

        let self = this;

        return new Promise(function(resolve, reject) {

            readCSVfromBuffer(self.csvLines, self.csvFile, self.count, self.api_key).then(function (csvLines) {
                resolve(csvLines);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

}

function readCSVfromBuffer(csvLines, csvBuffer, count, api_key){

    return new Promise(function(resolve, reject) {
        try {

            csv.parseStream(bufferToStream(csvBuffer), { maxRows: 10000, ignoreEmpty: true, headers: true, discardUnmappedColumns:true, trim:true })
                .on('error', error => reject(error))
                .on('data', row => {
                    if(row.product_desc === "" && count < 80){
                        count++;
                        logLine(csvLines, row, api_key)
                    }
                })
                //.on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
                .on('end', rowCount => resolve(csvLines));

        }catch (e) {
            reject(e);
        }
    });

}

async function logLine(csvLines, row, api_key){

    try {
        csvLines.push(row);
    }catch (e){
        console.log(e);
    }

}

function bufferToStream(binary) {
    return new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
}

function readCSV(csvLines, csvFile, api_key){

    return new Promise(function(resolve, reject) {
        try {
            csv.parseFile(csvFile, { maxRows: 2, ignoreEmpty: true, headers: true, discardUnmappedColumns:true, trim:true })
                .on('error', error => reject(error))
                .on('data', row => {
                    logLine(csvLines, row, api_key)
                })
                //.on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
                .on('end', rowCount => resolve(csvLines));

        }catch (e) {
            reject(e);
        }
    });

}

module.exports = CSVService;