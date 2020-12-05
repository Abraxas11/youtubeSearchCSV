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
     * @param {*} search_term - The search term we wish to search on YouTube
     */
    constructor(search_term) {
        this.search_term = search_term;
    }

    /**
     * Fetches YouTube data from the search term provided to the constructor
     */
    async search() {

        let self = this;

        return new Promise(function(resolve, reject) {

            searchYouTube(self.search_term).then(function (search_data) {
                resolve(search_data);
            }).catch(function (error) {
                reject(error);
            })

        })
    }

}

function searchYouTube(search_term){

    return new Promise(function(resolve, reject) {
        try {

            let youTubeSearchUrl = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +  search_term + "&type=video&videoEmbeddable=true&key=AIzaSyB187nomXbo_CL3pd8FOLBQN_vUaoSKTmc";

            request(youTubeSearchUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    resolve(searchResponseData);
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