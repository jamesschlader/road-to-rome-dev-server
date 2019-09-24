const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const SALT = bcrypt.genSaltSync(10);

const UserSchema = new Schema({
  first: {
    type: String,
    required: [true, "Please provide a first name."],
    trim: true,
    match: [/\D/g, "Only use letters in the first name"],
    minlength: [1, "Please provide a first name"],
    maxlength: [30, "First name cannot be more than 30 characters"]
  },
  last: {
    type: String,
    required: [true, "Please enter a last name."],
    match: [/\D/g, "Only use letters in the last name"],
    trim: true,
    minlength: [1, "Please provide a last name"],
    maxlength: [40, "Last name cannot be more than 40 characters"]
  },
  username: {
    type: String,
    required: [
      true,
      "Please enter a username. It must be between 5 and 30 characters in length."
    ],
    unique: [true, "That username already exists."],
    trim: true,
    minlength: [5, "username must be at least 5 characters"],
    maxlength: [30, "username cannot be more than 30 characters"]
  },
  password: {
    type: String,
    required: [true, "Enter a password between 8 and 30 characters."],

    trim: true,
    minlength: [8, "password must be at least 8 characters"],
    maxlength: [100, "password cannot be more than 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email address."],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "given input is not a valid email address"
    ]
  },
  motto: {
    type: String,
    trim: true,
    maxlength: [220, "the motto cannot exceed 220 characters"]
  },
  stableIds: [Schema.Types.ObjectId],
  image: { type: String }
});

UserSchema.pre("save", async function preSave(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const hash = await bcrypt.hash(user.password, SALT);
    console.log(`user.password = ${user.password} and has = ${hash}`);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };
