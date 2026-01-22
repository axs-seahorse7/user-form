import mongoose from "mongoose";

const DynamicSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    responses: [
      {
        fieldId: {
          type: String,
          required: true
        },
        label: {
          type: String,
          required: true
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        }
      }
    ],

    meta: {
      ip: String,
      userAgent: String
    }
  },
  { timestamps: true }
);

const DynamicSubmission = mongoose.model(
  "DynamicSubmission",
  DynamicSubmissionSchema
);

export default DynamicSubmission;
