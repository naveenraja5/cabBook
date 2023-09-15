const express=require('express')
const morgan= require('morgan')
const bodyParser=require('body-parser')
const {get_validation_failure_response, get_success_response}=require("./responseSender")
const {genToken}=require("./otpFunctions")
const {valid,token,getTokenLogin}=require("./dbFunctions")
const moment=require("moment")
const { dataBaseM } = require('./database')
const route=express.Router()
const currentTime=moment().format("YYYY-MM-DD HH:mm:ss")
const activeTime=moment().format("YYYY-MM-DD HH:mm:ss")
function indiaTime(){
    let aTime= moment().add(5,"hours").add(30,"m")
    let bTime= moment(aTime).format("YYYY-MM-DD HH:mm:ss")
    console.log(bTime);
    return bTime
}
function userExpiryTime(){
    let a=moment(indiaTime()).add(2,"m")
    let b=moment(a).format("YYYY-MM-DD HH:mm:ss")
    console.log(b);
    return b
}
//let ux=userExpiryTime()

route.post("/otpValidate",async (request,response)=>{

   
    const {phoneNumber,otp}=request.body
    let validOtp=await valid(phoneNumber)
    if(validOtp===null){
        response.send(get_validation_failure_response("enter the numbers correctly"))
    }
    else if(validOtp.otp!=otp){
    response.send(get_validation_failure_response("wrong otp"))
    }
    else if(indiaTime()>validOtp.expiryTime){
    response.send(get_validation_failure_response("otp expired"))
    }
    else{
        let gettingTokenId=await getTokenLogin(validOtp._id) 
        if(gettingTokenId===null){
        let token1=await token(genToken(),validOtp._id,indiaTime(),activeTime,userExpiryTime())
        response.send(get_success_response(`otp successfull,{token:${token1}}`))
        }
       else{
        response.send(get_success_response(`otp successfull,{token:${gettingTokenId.token}}`))
       }
       
       }
   
})
module.exports=route