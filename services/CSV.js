const fs = require('fs');
const util = require('util');
const Promise = require("bluebird");
//const readFile = util.promisify(fs.readFile);
//const writeFile = util.promisify(fs.writeFile);
const csv = require('fast-csv');
const YouTubeService = require('./YouTube');

/**
 * Logic for reading and writing CSV data
 */
class CSVService {
    /**
     * Constructor
     * @param {*} csvLines - The variable that will hold the final data
     * @param {*} csvFile Path to a CSV file that contains the data
     */
    constructor(csvLines, csvFile) {
        this.csvLines = csvLines;
        this.csvFile = csvFile;
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

            readCSV(self.csvLines, self.csvFile).then(function (csvLines) {
                resolve(csvLines);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

}

function readCSV(csvLines, csvFile){

    return new Promise(function(resolve, reject) {

        try {
            csv.parseFile(csvFile, { maxRows: 3, ignoreEmpty: true, headers: true, discardUnmappedColumns:true, trim:true })
                .on('error', error => reject(error))
                .on('data', row => logLine(csvLines, row))
                //.on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
                .on('end', rowCount => resolve(csvLines));

        }catch (e) {
            reject(e);
        }
    });

}

async function logLine(csvLines, row){
    csvLines.push(row);

    const youtubeService = new YouTubeService(row.search_term);
    let result = await youtubeService.search();

    console.log(row.search_term);
    //console.log(result);
    //console.log(`LINE=${JSON.stringify(row)}`)
}

module.exports = CSVService;