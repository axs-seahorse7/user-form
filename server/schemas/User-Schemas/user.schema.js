import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false // hide by default
    },

    forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form"
      }
    ],

    visitedForms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form"
      }
    ],

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
