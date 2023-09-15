const express=require('express')
const {otp}=require("./otpFunctions")
const {signUpFun, updateOtpFun,valid,token,getTokenLogin, tokenCheck,phoneNumberAdd,details,updateDetails}=require("./dbFunctions")
const moment=require("moment")
const {dataBaseM}=require("./database")
const {genToken}=require("./otpFunctions")
const bodyParser=require('body-parser')
const {get_validation_failure_response, get_success_response}=require("./responseSender")
const route=express.Router()

function indiaTime(){
  let aTime= moment().add(5,"hours").add(30,"m")
  let bTime= moment(aTime).format("YYYY-MM-DD HH:mm:ss")
  console.log(bTime);
  return bTime
}
function expiryTime(){
let a=moment(indiaTime()).add(2,"m")
let b=moment(a).format("YYYY-MM-DD HH:mm:ss")
return b
}

route.post("/signUp",async(request,response)=>{ 
    
    let {phoneNumber} =  request.body

  let otp1=otp()
  

  async function phoneNumberCheck(){
    
    let db=await dataBaseM("phoneNumber")
    
    let obj=({phoneNumber:phoneNumber})
    let data=await db.findOne(obj)
    
   if(data===null){
   
   let aa=await signUpPhoneNumber()
   }
   else if(data.phoneNumber===phoneNumber){
      try{
        
        let updateOtp1=otp()
        let db=await dataBaseM("phoneNumber")
        let result=await  updateOtpFun(phoneNumber,updateOtp1,expiryTime())
        response.send(get_success_response(`successfully`,"request processed successfully",`otp is ${updateOtp1}`))
      }
      catch(err){
        console.log(err);
      }
   }
    
  }
  if(phoneNumber===undefined){
    response.send(get_validation_failure_response("request processed successfully","add a phone number"))
  }
  else{
    console.log(777);
    let bb=await phoneNumberCheck()
}
 

  async function signUpPhoneNumber(){
   let first=await signUpFun(phoneNumber,otp1,expiryTime())
   response.send(get_success_response(`successfully`,"request processed successfully",`otp is ${otp1}`))
  }

})



const activeTime=moment().format("YYYY-MM-DD HH:mm:ss")
function userExpiryTime(){
  let a=moment(indiaTime()).add(2,"m")
  let b=moment(a).format("YYYY-MM-DD HH:mm:ss")
  console.log(b);
  return b
}
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
        response.send(get_success_response(`otp successfull`,"request processed successfully",{token:token1}))
        }
       else{
        response.send(get_success_response(`otp successfull`,"request processed successfully",{token:gettingTokenId.token}))
       }      
       }   
})


route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());
route.post("/userDetails", async (request, response) => {
  let { name, email, address, isActive, isAdmin } = request.body;

  try {
 
    let token = request.headers.token;
    let dataF = await tokenCheck(token);
    let phoneNumberAddCheck = await phoneNumberAdd(dataF.fkId);

    async function tokenCheckDb() {
      
      let collections=await dataBaseM("userDetails")
      let query = await collections.findOne({ fkId: dataF.fkId });
      if (query === null) {
      let InsertUserDetails=await details(name,phoneNumberAddCheck,email,address,isActive,isAdmin,dataF.fkId);
        response.send( get_success_response("user details successfully created") );
      } else {
        let updatDetails1 = await updateDetails(
          dataF.fkId,
          name,
          phoneNumberAddCheck,
          email,
          address,
          isActive,
          isAdmin,
          dataF.fkId );
        response.send(get_success_response("user details successfully updated")
        );
      }
    }
    tokenCheckDb();
  } catch (err) {
    console.log(err);
  }
});

module.exports=route