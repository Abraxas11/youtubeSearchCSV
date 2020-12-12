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
    }

    /**
     * Get all feedback items
     */
    /*async getList() {
        const data = await this.getData();
        return data;
    }*/

    /**
     * Add a new feedback item
     * @param {*} name The name of the user
     * @param {*} title The title of the feedback message
     * @param {*} message The feedback message
     */
    /*async addEntry(name, email, title, message) {
        const data = (await this.getData()) || [];
        data.unshift({ name, email, title, message });
        return writeFile(this.datafile, JSON.stringify(data));
    }*/

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

        console.log(self);

        return new Promise(function(resolve, reject) {

            readCSVfromBuffer(self.csvLines, self.csvFile, self.api_key).then(function (csvLines) {
                resolve(csvLines);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

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

function readCSVfromBuffer(csvLines, csvBuffer, api_key){

    return new Promise(function(resolve, reject) {
        try {

            csv.parseStream(bufferToStream(csvBuffer), { maxRows: 50, ignoreEmpty: true, headers: true, discardUnmappedColumns:true, trim:true })
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

async function logLine(csvLines, row, api_key){

    try {

        csvLines.push(row);

        //const youtubeService = new YouTubeService(row.search_term, api_key);
        //let result = await youtubeService.search();

        //console.log(result);
        //console.log(row.search_term);

        //return result;

        //console.log(`LINE=${JSON.stringify(row)}`)
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

module.exports = CSVService;