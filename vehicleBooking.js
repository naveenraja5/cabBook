const express = require("express");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const moment = require("moment");
const {tokenCheck, vehicleCheck, cabData, userCabBooking,userD,takingDriverId,paymentFunc} = require("./dbFunctions");
const { get_success_response,get_validation_failure_response } = require("./responseSender");
const bson = require("bson");
const { dataBaseM } = require("./database");
const route = express.Router();

route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

route.post("/vehicleBooking", async (request, response) => {
  let token = request.headers.token;
  let { startingLocation, destination,distance, startingTime, endTime } = request.body;
  let perKmPrice = 20
  let payAmount=distance*perKmPrice

  try {
    let dataF = await tokenCheck(token);
    
    if (dataF.token === token) {
     
      let { id } = request.body;
      if (id === undefined) {
        let availableVehicles = await cabData();
        response.send(get_success_response("successfull","request processed successfully",{availableVehicles:availableVehicles}));
      } else {
        let vehicleId = await vehicleCheck(new bson.ObjectId(id));
       
        let time = moment().format("YYYY-MM-DD HH:mm:ss");
        let userDetailId= await userD(dataF.fkId)
      
        let DriverPhoneNumber=await takingDriverId(vehicleId.id)
  
       
        let cabBooking = await userCabBooking(
          uuidv4(),
          time,
          startingLocation,
          destination,
          distance,
          payAmount,
          startingTime,
          endTime,
          userDetailId,
          vehicleId._id, 
          dataF.fkId       
        );
        console.log(cabBooking);

        // async function getBookingId(){
        //   let db=await dataBaseM("bookingDetails")
        //   let query= await db.findOne({fkId:dataF.fkId})
        //   console.log(query);
        //   return query  
        //     }

        //     let date=moment().format("YYYY-MM-DD HH:mm:ss") 
        //     let paymentDb=await paymentFunc(amount,date,bookingDetailsData.userDetailId,bookingDetailsData._id)
        //     console.log(paymentDb); 

        response.json({details:{price:payAmount,driverNumber:DriverPhoneNumber.phoneNumber}})

      }
    } else {
      response.send("not avalid token");
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = route;
