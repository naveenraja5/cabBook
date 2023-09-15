const MongoClient = require("mongodb").MongoClient;
  const uri =  "mongodb+srv://naveen:navin8888@cluster0.r1ia1p6.mongodb.net/?retryWrites=true&w=majority";
  //const uri="mongodb://0.tcp.in.ngrok.io:19345"
 

  const database = "cab";
  const client = new MongoClient(uri);

  async function dataBaseM(collectionName){
    let dbClient = await client.connect();
    let mydb = dbClient.db(database);
    return mydb.collection(collectionName)
  }
  async function aa(){
    let a1=await dataBaseM("dataS")
    let query= await a1.insertOne({val:123})
    console.log(query);
  }
  //aa()
  //let dataB1=await db.getSiblingDB('cab').getCollection('cabVehicleDetails').renameCollection('cabVehiclesDetail');
  module.exports={dataBaseM}