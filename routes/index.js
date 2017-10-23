var express = require('express');
var Page = require('../models/page');
var router = express.Router();
//LANDING ROUTE
router.get("/", function (req, res) {
        res.render("home");
});

module.exports = router;