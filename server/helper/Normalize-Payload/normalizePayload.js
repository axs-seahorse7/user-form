import mongoose from "mongoose";

export const normalizeFormPayload = (payload) => {

  const submittedBy = mongoose.Types.ObjectId.isValid(payload.submittedBy)
  ? new mongoose.Types.ObjectId(payload.submittedBy)
  : new mongoose.Types.ObjectId(); 


  return {
    title: payload.title,
    description: payload.description || "",

    createdBy: submittedBy,
    headerStyles: payload.formStyle || {},

    sections: payload.sections.map((section) => ({
      title: section.title,

      sectionStyles: section.sectionStyles || {},

      fields: section.fields.map((field) => ({
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || "",
        required: !!field.required,

        // ✅ FIX: extract label only
        options: Array.isArray(field.options)
          ? field.options.map((opt) =>
              typeof opt === "string" ? opt : opt.label
            )
          : [],

        validation: field.validation || {},
        fieldStyles: field.fieldStyles || {}
      }))
    }))
  };
};
