
const bcrypt = require('bcrypt');

async function genHashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword | ", hashedPassword)
    return hashedPassword
}
async function comparePassword(UserEnterPassword,dbPassword){
    return await bcrypt.compare(UserEnterPassword,dbPassword);
    //return await bcrypt.compare(dbPassword,UserEnterPassword);
}

module.exports = {genHashPassword,comparePassword};