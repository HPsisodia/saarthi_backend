const URLModel = require('./../models/url');
var afterLoad = require('after-load');
const request = require('request');

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");

exports.addURL = async (req,res) =>{
    try {
        const uri = req.body.url;
        request({uri: uri}, async (error, response, body) =>{
            if(error){
                return res.render("pageNotFound");
            }
            const addURL = await URLModel.create({
                url: req.body.url,
                url_content: body
            });
            return res.render('content',{
                post:{
                    content: body
                }
            });
        })
        
        
        //return res.redirect('/showURL')       
    } catch (error) {
        return res
        .status(statusCode.bad)
        .render('404')        
    }
    
}


exports.showURL = async (req,res) => {
    try {
        const result = await URLModel.find({});
        const showURL = [];
        for(i=0; i< result.length; i++){
            showURL[i] = {
                id: result[i]._id,
                URL: result[i].url,
                URL_content: result[i].url_content
            }
        }
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "Employee on Leave",
                showURL
            )
            );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .render('404')
    }
}

exports.showContent = async (req,res) =>{
    try {
        const id = req.params.id
        const result = await URLModel.findById(id);
        request({uri: result.url}, async (error, response, body) =>{
            if(error){
                return res.render("pageNotFound");
            }
            return res.render('content',{
                post:{
                    content: body
                }
            });
        })

    } catch (error) {
        res.status(statusCode.bad).render('404')
    }
}