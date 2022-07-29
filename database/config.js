const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Success");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConnection,
};
