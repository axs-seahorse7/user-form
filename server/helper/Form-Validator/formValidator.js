export const validateFormPayload = (payload) => {
  if (!payload.title || typeof payload.title !== "string") {
    throw new Error("Form title is required");
  }

  if (!Array.isArray(payload.sections)) {
    throw new Error("Sections must be an array");
  }

  payload.sections.forEach((section, sIdx) => {
    if (!section.title) {
      throw new Error(`Section title missing at index ${sIdx}`);
    }

    if (!Array.isArray(section.fields)) {
      throw new Error(`Fields must be an array in section ${sIdx}`);
    }

    section.fields.forEach((field, fIdx) => {
      if (!field.type || !field.label) {
        throw new Error(
          `Field type/label missing at section ${sIdx}, field ${fIdx}`
        );
      }

      const needsOptions = ["dropdown", "radio", "checkbox"].includes(
        field.type
      );

      if (needsOptions && !Array.isArray(field.options)) {
        throw new Error(
          `Options must be array for ${field.type} at section ${sIdx}, field ${fIdx}`
        );
      }
    });
  });
};
