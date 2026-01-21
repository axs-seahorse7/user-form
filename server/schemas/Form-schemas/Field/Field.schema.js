// field.schema.js
import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "number",
        "email",
        "dropdown",
        "radio",
        "checkbox",
        "date"
      ],
      required: true
    },

    label: {
      type: String,
      required: true
    },

    placeholder: String,

    required: {
      type: Boolean,
      default: false
    },

    options: {
      type: [String], // only for dropdown / radio / checkbox
      default: []
    },

    validation: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
      regex: String
    },

    styles: {
      fontSize: {
        type: Number,
        default: 14
      },
      bold: {
        type: Boolean,
        default: false
      },
      italic: {
        type: Boolean,
        default: false
      },
      underline: {
        type: Boolean,
        default: false
      },
      strike: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

export default FieldSchema;
