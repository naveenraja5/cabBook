const express = require("express");
const body = require("body-parser");
const { tokenCheck,phoneNumberAdd,details,updateDetails} = require("./dbFunctions");
let {
  get_validation_failure_response,
  get_success_response,} = require("./responseSender");
const {dataBaseM} = require("./database")
const route = express.Router();

route.use(body.urlencoded({ extended: false }));
route.use(body.json());


route.post("/userDetails", async (request, response) => {
  let { name, email, address, isActive, isAdmin } = request.body;

  // const MongoClient = require("mongodb").MongoClient;
  // const uri = "mongodb://0.0.0.0:27017";
  // const database = "cab";
  // const client = new MongoClient(uri);

  // async function dataBaseM(example){
  //   let dbClient = await client.connect();
  //   let mydb = dbClient.db(database);
  //   return mydb.collection(example)
  // }

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

module.exports = route;
