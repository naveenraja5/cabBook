
const {dataBaseM}=require("./database")

async function cabDrivers(name, contact, email, licenceNo, isAvailable, photo) {
  let db= await dataBaseM("cabDriversDetail")
  let dataB = await db.insertOne({driverName: name,phoneNumber: contact,email: email,licenceNo: licenceNo,isAvailable: isAvailable,photo: photo});
  return new Promise((resolve, reject) => {
    if (dataB) {
      resolve(dataB);
    } else {
      reject("error in cabDriver");
    }
  });
}

async function cabVehicles(id, vehicleModel, year, registerationNo, capacity) {
  try {
    let db= await dataBaseM("cabVehiclesDetail")
    let dataB1 = await db.insertOne({id: id,vehicleModel: vehicleModel,year: year,registerationNo: registerationNo,capacity: capacity});
  } catch (err) {
    console.log(err);
  }
}

async function signUpFun( phoneNumber, otp, expiryTime) {
  let db= await dataBaseM("phoneNumber")
  let data = await db.insertOne( { phoneNumber: phoneNumber, otp: otp, expiryTime: expiryTime });
  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data);
    } else {
      reject("error in signUpFun");
    }
  });
}

async function updateOtpFun(phoneNumber, otp, expiryTime) {
  let db= await dataBaseM("phoneNumber")
  let result = await db.updateOne({ phoneNumber: phoneNumber },{ $set: { otp: otp, expiryTime: expiryTime } }  ); 
}

async function token( genToken, resultId, currentTime, activeTime, userExpiryTime) {
  let db = await dataBaseM("token")
  let query = await db.findOne({ userId: resultId });
  if (query === null) {
    let db= await dataBaseM("token")
    let query = await db.insertOne({token: genToken,fkId: resultId,createdAt: currentTime,lastActive: activeTime,tokenExpiry: userExpiryTime,});
    return new Promise((resolve, reject) => {
      if (query) {
        resolve(genToken);
      } else {
        reject("error in token");
      }
    });
  }
}

async function valid(phoneNumber){
  try{
      let db=await dataBaseM("phoneNumber")
    
      let result= await db.findOne({phoneNumber:phoneNumber})          
      return result
     }
catch(err){
  console.log(err);
}
}

async function tokenCheck(token) {
  let db= await dataBaseM("token")
  
  let result = await db.findOne({ token: token });
  if (result === null) {
    return "the given token NO. is not registered";
  } else {
    return result;
  }
}

async function phoneNumberAdd(userId) {
  let db= await dataBaseM("phoneNumber")
  
  let data = await db.findOne({ _id: userId });
  if (data === null) {
    return "the given token NO. is not registered";
  } else {
    return data.phoneNumber;
  }
}

async function details(
  name,
  phoneNumberAddCheck,
  email,
  address,
  isActive,
  isAdmin,
  fkId
) {
  let db= await dataBaseM("userDetails")

  let query = await db.insertOne({
    name: name,
    contactNo: phoneNumberAddCheck,
    email: email,
    address: address,
    isActive: isActive,
    isAdmin: isAdmin,
    fkId: fkId,
  });
  return query;
}

async function updateDetails(
  userUserId,
  name,
  phoneNumberAddCheck,
  email,
  address,
  isActive,
  isAdmin,
  fkId
) {
  let db= await dataBaseM("userDetails")
 
  let query = await db.updateOne(
    { fkId: userUserId },
    {
      $set: {
        name: name,
        contactNo: phoneNumberAddCheck,
        email: email,
        address: address,
        isActive: isActive,
        isAdmin: isAdmin,
        fkId: fkId,
      },
    }
  );
}

async function vehicleCheck(id) {
  let db = await dataBaseM("cabVehiclesDetail")
  
  let query = await db.findOne({ _id: id });
  return query;
}

async function cabData() {
  let db= await dataBaseM("cabVehiclesDetail")  
  let query = await db.find({}, { projection: { _id: 1, id: 0 } }) .toArray();
  return query;
}

async function userCabBooking(uuidv4,time,startingLocation,destination,distance,amount,startingTime,endTime,  userDetailId,vehicleId,fkId ) {
  let db= await dataBaseM("bookingDetails")
  let query = await db.insertOne({bookingNo: uuidv4,bookingDate: time,startingLocation: startingLocation,destination: destination,distance:distance,amount:amount,startTime: startingTime,endTime: endTime,userDetailId: userDetailId,cabVehicleId: vehicleId,fkId:fkId});
  return query
}

async function userD(data){
  console.log(data);
  let db= await dataBaseM("userDetails")
  let query=await db.findOne({fkId:data})
  return query._id
}

async function paymentFunc(amount,date,userDetailId,id){
  let db=await dataBaseM("payment")
  let query=await db.insertOne({amount:amount,paidDate:date,customerId:userDetailId,bookingId:id})
return query
}


async function takingDriverId(driverId){
  let db=await dataBaseM("cabDriversDetail")
  let query= await db.findOne({_id:driverId})
  return query
  }

  async function getTokenLogin(id){
    let db=await dataBaseM("token")
    let query = await db.findOne({fkId:id})
    return query
}  
module.exports = {
  cabDrivers,
  cabVehicles,
  signUpFun,
  valid,
  getTokenLogin,
  updateOtpFun,
  token,
  tokenCheck,
  phoneNumberAdd,
  details,
  updateDetails,
  vehicleCheck,
  cabData,
  userCabBooking,
  userD,
  takingDriverId,
  paymentFunc
};
