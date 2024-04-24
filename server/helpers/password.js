
const bcrypt = require('bcrypt');

async function genHashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword | ", hashedPassword)
    return hashedPassword
}

module.exports = genHashPassword;