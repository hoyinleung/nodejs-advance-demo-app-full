const bcrypt = require('bcrypt');

async function genPasswordWithSalt(password){

const salt = await bcrypt.genSalt(10);
console.log("salt | ", salt)

const hashedPasswordWithSalt = await bcrypt.hash(password, salt);
console.log("hashedPasswordWithSalt | ", hashedPasswordWithSalt)

}
genPasswordWithSalt('12345')

async function genHashPassword(password){
const hashedPassword = await bcrypt.hash(password, 10);
console.log("hashedPassword | ", hashedPassword)
}

genHashPassword('12345')