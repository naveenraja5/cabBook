const express = require("express");
const body= require("body-parser");
const { dataBaseM } = require("./database");
const {tokenCheck,paymentFunc}= require("./dbFunctions");
const { get_validation_failure_response } = require("./responseSender");
const moment=require("moment")
const route = express.Router()

route.use(body.urlencoded({ extended: false }));
route.use(body.json());


route.post("/cabConfirmation",async(request,response)=>{
    let {payment}=request.body
    let token=request.headers.token
    try{
        let dataF = await tokenCheck(token);
    if (dataF.token === token) { 
        console.log(4444);
            async function getBookingId(){
            let db=await dataBaseM("bookingDetails")
            let query= await db.findOne({fkId:dataF.fkId})
           // console.log(query);
            return query  
              }
           
      let bookingDetailsData=await getBookingId()
      console.log(bookingDetailsData);
      console.log(bookingDetailsData.cabVehicleId,9999);
      async function vehicleIdCheck(){
        let db=await dataBaseM("bookingDetails")
        let query= await db.findOne({cabVehicleId:bookingDetailsData.cabVehicleId})
      // console.log();
        console.log(query,66666);
        return query
    }
    let aa=await vehicleIdCheck()
      let date=moment().format("YYYY-MM-DD HH:mm:ss") 
      let paymentDb=await paymentFunc(bookingDetailsData.amount,date,bookingDetailsData.userDetailId,bookingDetailsData._id)
      console.log(paymentDb);


    }
    else {
        response.send(get_validation_failure_response("wrong token "))
    }
}
    catch(err){
        console.log(err);
    }
    
})
module.exports=route