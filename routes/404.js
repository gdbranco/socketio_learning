var express = require('express');
var router = express.Router();
//LANDING ROUTE
router.get("*", function (req, res) {
        res.render("404");
});

module.exports = router;