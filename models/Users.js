const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save Hook, encrypt password
userSchema.pre("save", function(next) {
  const user = this;
  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // Otherwise hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// User Schema Methods
// When new User is created then this
// func is everywhere can accessible
// arrow func didn't work here
userSchema.methods.comparePassword = function(candidatePssword, callback) {
  bcrypt.compare(candidatePssword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Create the Model class
const ModelClass = mongoose.model("user", userSchema);
// Export Model Class
module.exports = ModelClass;