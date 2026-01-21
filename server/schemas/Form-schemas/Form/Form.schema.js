// form.model.js
import mongoose from "mongoose";
import SectionSchema from "../Sections/Section.schema.js";

const FormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft"
    },

    globalStyles: {
      fontFamily: {
        type: String,
        default: "Inter"
      },
      fontSize: {
        type: Number,
        default: 14
      }
    },

    sections: {
      type: [SectionSchema],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Form", FormSchema);
