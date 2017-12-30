var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Find My Way' })
})

router.get('/otherhomes/:homenumber/secondary', function(req, res, next) {
    var homenum = req.params.homenumber

    // if url parameter :homenum is not a number
    if (isNaN(homenum)) {
        // take the visitor to the first home
        homenum = 1
    }
    res.render('index', { title: 'Other Home number ' + homenum })
})

router.get('/otherhomes/holiday', function(req, res, next) {
    res.render('index', { title: 'Holiday Home' })
})

module.exports = router
