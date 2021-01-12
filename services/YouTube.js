const fs = require('fs');
const util = require('util');
const Promise = require("bluebird");
const request = require('request');

/**
 * Logic for searching YouTube using the search API
 */
class YouTubeService {
    /**
     * Constructor
     * @param {*} csvId - The id from the csv line
     * @param {*} search_term - The search term we wish to search on YouTube
     * @param {*} api_key - The api key to be used for searching
     */
    constructor(csvId, search_term, api_key) {
        this.csvId = csvId || 0;
        this.search_term = escape(search_term);
        this.api_key = api_key;
    }

    /**
     * Fetches YouTube data from the search term provided to the constructor
     */
    async search() {

        let self = this;

        return new Promise(function(resolve, reject) {
            searchYouTube(self.csvId, self.search_term, self.api_key).then(function (search_data) {
                resolve(search_data);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

}

function searchYouTube(csvId, search_term, api_key){

    return new Promise(function(resolve, reject) {
        try {

            let youTubeSearchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search_term}&type=video&videoEmbeddable=true&key=${api_key}`;

            //console.log(csvId, search_term, api_key);
            //console.log(youTubeSearchUrl);

            request(youTubeSearchUrl, function (error, response, body) {
                if (!body.error && response.statusCode === 200) {

                    body = JSON.parse(body);

                    let responseData = {
                        id: body.items[0].id.videoId,
                        csvId: csvId,
                        publishedAt : body.items[0].snippet.publishedAt,
                        title : body.items[0].snippet.title,
                        description: body.items[0].snippet.description,
                        thumbnail: body.items[0].snippet.thumbnails.medium.url
                    }

                    resolve(responseData);

                }else{

                    body = JSON.parse(body);

                    let errorResponseData = {
                        error: body.error && body.error.errors && body.error.errors[0].reason,
                        code: body.error.code,
                        message: body.error.message,
                        status: body.error.status
                    }
                    reject(errorResponseData);
                }
            })

        }catch (e) {
            reject(e);
        }
    });

}

const searchResponseData = {
    kind: "youtube#searchListResponse",
    etag: "c3CqBGyPoOB9DMGJHL_Kq9soQuM",
    nextPageToken: "CAEQAA",
    regionCode: "AE",
    pageInfo: {
        totalResults: 664079,
        resultsPerPage: 1
    },
    items: [
        {
            kind: "youtube#searchResult",
            etag: "aeycH5G6CFyYo3qEMVR190OVs3I",
            id: {
                kind: "youtube#video",
                videoId: "3588qRl8Ubs"
            },
            snippet: {
                publishedAt: "2015-05-02T15:30:44Z",
                channelId: "UCG11aiovma65vUiQdeZOh6A",
                title: "CGR Undertow - BAYONETTA review for Nintendo Wii U",
                description: "Bayonetta review. http://www.ClassicGameRoom.com Shop CGR shirts & mugs! http://www.CGRstore.com Classic Game Room presents a CGR Undertow video ...",
                thumbnails: {
                    default: {
                        url: "https://i.ytimg.com/vi/3588qRl8Ubs/default.jpg",
                        width: 120,
                        height: 90
                    },
                    medium: {
                        url: "https://i.ytimg.com/vi/3588qRl8Ubs/mqdefault.jpg",
                        width: 320,
                        height: 180
                    },
                    high: {
                        url: "https://i.ytimg.com/vi/3588qRl8Ubs/hqdefault.jpg",
                        width: 480,
                        height: 360
                    }
                },
                channelTitle: "CGRundertow",
                liveBroadcastContent: "none",
                publishTime: "2015-05-02T15:30:44Z"
            }
        }
    ]
};

module.exports = YouTubeService;