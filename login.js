const express=require('express')
const {otp}=require("./otpFunctions")
const {signUpFun, updateOtpFun,valid,getTokenLogin}=require("./dbFunctions")
const moment=require("moment")
const {dataBaseM}=require("./database")
const {get_validation_failure_response, get_success_response} =require("./responseSender")
const route=express.Router()
function expiryTime(){
let a=moment().add(2,"m")
let b=moment(a).format("YYYY-MM-DD HH:mm:ss")
return b
}

route.post("/auth",async(request,response)=>{ 
    
    let {phoneNumber} =  request.body
    let otp1=otp()

    async function phoneNumberCheck(){
    let db=await dataBaseM("phoneNumber")
    let obj=({phoneNumber:phoneNumber})
    let data=await db.findOne(obj)
    
    if(data.phoneNumber===phoneNumber){
      try{
        let updateOtp1=otp()
        let db=await dataBaseM("phoneNumber")
        let result=await updateOtpFun(phoneNumber,updateOtp1,expiryTime())
        response.send(`otp is ${updateOtp1}`)
      }
      catch(err){
        console.log(err);
      }
   }
    
  }
 let bb=await phoneNumberCheck()

  async function signUpPhoneNumber(){
   let first=await signUpFun(phoneNumber,otp1,expiryTime())
   response.send(`otp is ${otp1}`)
  }
})


route.post("/loginOtpValidate",async (request,response)=>{

    const currentTime=moment().format("YYYY-MM-DD HH:mm:ss")
    const {phoneNumber,otp}=request.body
    let validOtp=await valid(phoneNumber)
    console.log(validOtp);
    if(validOtp===null){
        response.send(get_validation_failure_response("enter the numbers correctly"))
    }
    else if(validOtp.otp!=otp){
    response.send(get_validation_failure_response("wrong otp"))
    }
    else if(currentTime>validOtp.expiryTime){
    response.send(get_validation_failure_response("otp expired"))
    }
    else{   
        
           let gettingTokenId=await getTokenLogin(validOtp._id) 
          
           response.send(get_success_response(`otp successfull,{token:${gettingTokenId}}`))
       
       }
   
})
module.exports=route

