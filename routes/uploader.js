var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('uploader', { title: "Upload your CSV", message: "Here is where you upload your CSV. " + "\n" + "Up to 100 searches can be made per API key." });
});

module.exports = router;
