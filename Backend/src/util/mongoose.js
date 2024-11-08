module.exports = {
    mutipleMoongoseToObject: function (mongoose) {
      return mongoose.map((mongoose) => mongoose.toObject());
    },
  
    moongoseToObject: function (mongoose) {
      return mongoose ? mongoose.toObject() : mongoose;
    },
  };
  