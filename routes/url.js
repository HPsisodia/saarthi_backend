const express = require('express');
const router = express.Router();

const { protect } = require('./../controllers/authcontroller');
const { showURL, addURL, showContent} = require('./../controllers/url')


router.post('/addURL', protect, addURL);
router.get('/addURL', protect, (req,res)=>{
    res.render("addURL");
})

router.get('/show-url', protect, showURL);
router.get('/showURL', protect, (req,res) =>{
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .render("showURL");
    
});


router.get('/content/:id', protect, showContent);

module.exports = router;