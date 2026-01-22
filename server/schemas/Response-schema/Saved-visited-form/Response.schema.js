import mongoose from "mongoose";

const SavedResponseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    responses: [
      {
        fieldId: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true }
      }
    ]
  },
  { timestamps: true }
);
const SavedResponse = mongoose.model("SavedResponse", SavedResponseSchema);

export default SavedResponse;