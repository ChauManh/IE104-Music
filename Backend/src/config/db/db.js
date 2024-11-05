require('dotenv').config();
const mongoose = require('mongoose');
require('dotenv').config();


async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connect succesfully!!!');
  } catch (error) {
    console.log(error);
    console.log('Connect fail!!!');
  }
}

module.exports = { connect };
