const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Soundtify');
    console.log('Connect succesfully!!!');
  } catch (error) {
    console.log('Connect fail!!!');
  }
}

module.exports = { connect };
