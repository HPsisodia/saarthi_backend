const { promisify } = require('util');
const registrationModel = require('./../models/registration'); 
const ENV = 'development';
const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");

require("dotenv").config();  

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = (email) =>{
    return jwt.sign({email: email}, process.env.SECRET_KEY, {
        expiresIn: "90d"
    });
}

const createSendToken = (user, res) =>{
  const token = signToken(user[0].email);

  const cookieOptions = {
    expires: new Date(Date.now() + 90*24*60*60*1000 ),
    httpOnly: true
  }

  if(ENV === 'production') cookieOptions.secure = true;
  return res.cookie('jwt', token, cookieOptions);
  
  //res.redirect('/dashboard');
  
}


exports.registration = async(req,res) => {
    try {

        const newUser = await registrationModel.create(req.body)

        const token = signToken(newUser.email);
        if(newUser){
            res.set( {
                'token': token
            });
            res.redirect('/login')
            //res.redirect('/login'); 
        }else{
            return res
            .status(statusCode.bad)
            .json(
              returnErrorJsonResponse(
                statusCode.bad,
                "fail",
                "Something went wrong, couldnt save user. Check internet connection",
                error
              )
            );            
        }
        


    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Please try again",
            error
          )
        );        
    }
}


exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await registrationModel.find({email: email}).select('+password');

        if(user[0] === undefined || !(await bcrypt.compare(password, user[0].password))){
            return res.render("404login")           
        }

        ///send token
        createSendToken(user, res);
        // const token = signToken(user[0].email, user[0].role);
        // console.log(token);

        return res.redirect('/dashboard');
        // return res
        // .status(statusCode.success)
        // .json(
        //     returnJsonResponse(
        //     statusCode.success,
        //     "success",
        //     "Logged in",
        //     token
        //   )
        // );
    } catch (error) {
        return res.render("404login")        
    }
}


exports.protect = async (req,res,next) => {
  try{
    let token;

    if(req.cookies.jwt){
      token = req.cookies.jwt;
    }

    if(token === "loggedout"){
      return res.render("pleaselogin");
    }
    if(!token){
      return res
      .status(statusCode.unauthorized)
      .json(
        returnErrorJsonResponse(
          statusCode.unauthorized,
          "fail",
          "Not logged in",
          error
        )
      );
    }

    //verify
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    ///check if user exits
    const freshUser = await registrationModel.find({email: decoded.email});
    if(!freshUser){
      return res
      .status(statusCode.unauthorized)
      .json(
        returnErrorJsonResponse(
          statusCode.unauthorized,
          "fail",
          "User Doesnt exist anymore",
          error
        )
      );      
    }

    ////Grant Access
    req.user = freshUser[0];
    next();
  }catch{
    return res
    .status(statusCode.bad)
    .json(
      returnErrorJsonResponse(
        statusCode.bad,
        "fail",
        "Something went wrong, Please try again",
        error
      )
    );
  }
}

exports.restrictTo = (...roles) =>{
  return (req,res,next) =>{
    if(!roles.includes(req.user.role)) {
      return res.render("notallowed");      
    }
    next();
  };
};
