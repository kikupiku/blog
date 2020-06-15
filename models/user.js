let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
});

UserSchema
.virtual('fullName')
.get(function () {
  return firstName + ' ' + lastName;
});

UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

UserSchema
.virtual('attributes')
.get(function () {
  return { firstName: this.firstName, lastName: this.lastName, email: this.email, id: this._id };
});

module.exports = mongoose.model('User', UserSchema);
