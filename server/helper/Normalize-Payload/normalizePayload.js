export const normalizeFormPayload = (payload) => {
  return {
    title: payload.title,
    description: payload.description || "",

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
