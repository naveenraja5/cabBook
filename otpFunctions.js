function otp(){
    let values="123456789"
    let an=""
    for(let i=0;i<4;i++){
        an+=values[Math.floor(Math.random()*9)]
    }
   
return an
}

function genToken(){
    let value="1234567890qwertyuiopasdfghjklzxcvbnm"
    let token=""
    for(let i=0;i<32;i++){
    token+=value[Math.floor(Math.random()*36)]
    }
    return token
}
module.exports={otp,genToken}