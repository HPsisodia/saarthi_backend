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
            return res.send(body);
        })
        
        
        //return res.redirect('/showURL')       
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Please try again. Check internet connection",
            error
          )
        );        
    }
    
}


exports.showURL = async (req,res) => {
    try {
        const URLs = await URLModel.find({});
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "Available Clinics",
                URLs
              )
            );        
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );        
    }        
}