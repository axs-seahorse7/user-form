// section.schema.js
import mongoose from "mongoose";
import FieldSchema from "../Field/Field.schema.js";

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    sectionName: {
      type: String,
      required: true
    },

    styles: {
      headerBgColor: {
        type: String,
        default: "#f5f7fa"
      },
      headerTextColor: {
        type: String,
        default: "#111827"
      },
      fontSize: {
        type: Number,
        default: 16
      },
      fontWeight: {
        type: String,
        enum: ["normal", "bold"],
        default: "bold"
      }
    },

    fields: {
      type: [FieldSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default SectionSchema;
