const express=require('express')
const morgan= require('morgan')
const {cabDrivers,cabVehicles}=require("./dbFunctions")
const {get_validation_failure_response, get_success_response}=require("./responseSender")
const route=express.Router()

route.post("/cabDetails",(request,response)=>{
    
    let {name,contact,email,licenceNo,isAvailable,photo,vehicleModel,year,registerationNo,capacity}=request.body

    if((name&&contact&&email&&licenceNo&&isAvailable&&photo&&vehicleModel&&year&&registerationNo&&capacity)===undefined){
        response.send(get_validation_failure_response("enter all the keys name correctly"))
    }
    else{
        cabData()
    }

    async function cabData(){
    try{
    let det1=await cabDrivers(name,contact,email,licenceNo,isAvailable,photo)
    let id=det1.insertedId
    let det2=await cabVehicles(id,vehicleModel,year,registerationNo,capacity)
    response.send(get_success_response("driver's data stored"))
     }
     catch(err){
    console.log(err);
      }
    }
  
    
})
module.exports=route