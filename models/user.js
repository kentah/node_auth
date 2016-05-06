const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


// Define model
const userSchema = new Schema({
  email: {type: String,
          unique: true,
          lowercase: true
        },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // get access to the User model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {return next(err);}

    // hash the password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) {return next(err);}

      // overwrite plaintext password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
