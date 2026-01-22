import React, { useState, useEffect } from "react";
import { Card, Input, Button, Select, Switch, Divider, Space, Typography, message } from "antd";
import axios from "axios";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { uid } from "uid";
import Navbar from "../Form-Nav/Navbar/Navbar";
import { useParams, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;


const createOption = () => ({
  id: uid("option"),
  label: ""
});
 
function OptionsEditor({ options = [], onChange, visible }) {
  const addOption = (e) => {
    e.stopPropagation();
    onChange([...options, createOption()]);
  };

  const updateOption = (id, value) => {
    onChange(
      options.map((opt) =>
        opt.id === id ? { ...opt, label: value } : opt
      )
    );
  };

  const removeOption = (id, e) => {
    e.stopPropagation();
    onChange(options.filter((opt) => opt.id !== id));
  };

  return (
    <div
      style={{
        display: visible ? "block" : "none"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Card size="small" style={{ background: "#fafafa" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {options.map((opt) => (
            <Space key={opt.id} style={{ width: "100%" }}>
              <Input
                value={opt.label}
                placeholder="Option"
                onChange={(e) =>
                  updateOption(opt.id, e.target.value)
                }
              />
              <Button
                danger
                onClick={(e) => removeOption(opt.id, e)}
              >
                ✕
              </Button>
            </Space>
          ))}

          <Button type="dashed" onClick={addOption}>
            + Add Option
          </Button>
        </Space>
      </Card>
    </div>
  );
}


export default function FormBuilder() {
   
    const [activeField, setActiveField] = useState(null);
     const { id } = useParams();
     const [searchParams] = useSearchParams();
     const isEditMode = searchParams.get("edit") === "true" || searchParams.get("edit") === "";
    const url = import.meta.env.VITE_API_URL;
    const [styles, setStyles] = useState({
        header: {
            fontSize: 20,
            fontFamily: "Inter",
            bgColor: "#6ba6ff",
            bold: true,
            italic: false,
            underline: false
        },
        section: {
            fontSize: 18,
            fontFamily: "Inter",
            bgColor: "#9e9e9e",
            bold: false,
            italic: false,
            underline: false
        },
        field: {
            fontSize: 16,
            fontFamily: "Arial",
            bgColor: "#ffffff",
            bold: false,
            italic: false,
            underline: false
        }
    });


  const [form, setForm] = useState({
    title: "",
    description: "",
    sections: [],
    
  });

  /* ---------------- SECTIONS ---------------- */

  const createDefaultField = () => ({
  id: uid("field"),
  type: "text",
  label: "Untitled Question",
  placeholder: "",
  required: false,
  options: [],
  styles: {
    fontSize: 14,
    bold: false,
    italic: false,
    underline: false,
    strike: false
  }
});

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: uid("section"),
          title: `New Section ${form.sections.length + 1}`,
          fields: [createDefaultField()]
        }
      ]
    }));
  };

  const updateSection = (index, key, value) => {
    const sections = [...form.sections];
    sections[index][key] = value;
    setForm({ ...form, sections });
  };

  const deleteSection = (index) => {
    const sections = form.sections.filter((_, i) => i !== index);
    setForm({ ...form, sections });
  };

  /* ---------------- FIELDS ---------------- */
  const hasOptions = (type) => ["dropdown", "radio", "checkbox"].includes(type);

  const addField = (sectionIndex) => {
    const sections = [...form.sections];
    sections[sectionIndex].fields.push({
      id: uid("field"),
      type: "text",
      label: "Untitled Question",
      required: false,
      options: [],
      
    });
    setForm({ ...form, sections });
  };

  const updateField = (sIdx, fIdx, key, value) => {
    setForm((prev) => {
      // Clone sections
      const newSections = [...prev.sections];
      // Clone the specific section
      const newSection = { ...newSections[sIdx] };
      // Clone the specific fields array
      const newFields = [...newSection.fields];
      // Update the specific field
      newFields[fIdx] = { ...newFields[fIdx], [key]: value };
      
      newSection.fields = newFields;
      newSections[sIdx] = newSection;

      return { ...prev, sections: newSections };
    });
  };

  const deleteField = (sIdx, fIdx) => {
    setForm((prev) => {
      const sections = [...prev.sections];

      if (sections[sIdx].fields.length === 1) return prev; // 🚫 block

      sections[sIdx].fields.splice(fIdx, 1);
      return { ...prev, sections };
    });
  };


  console.log("form", form)
  /* ---------------- SAVE ---------------- */

  const saveForm = async () => {
  const payload = {
    title: form.title,
    description: form.description,

    //  GLOBAL STYLES
    formStyle: { ...styles.header },
    sectionStyles: { ...styles.section },
    fieldStyles: { ...styles.field },

    //  FORM STRUCTURE
    sections: form.sections.map((section, sIdx) => ({
      id: section.id,
      title: section.title,
      order: sIdx,

      fields: section.fields.map((field, fIdx) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options || [],
        order: fIdx
      }))
    }))
  };

  if( isEditMode ){
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/forms/${id}`, payload);
      message.success("Form updated successfully");
    }
    catch (err) {
      message.error("Failed to update form");
    }

  }else{
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/forms`, payload);
      message.success("Form saved successfully");
    } catch (err) {
      message.error("Failed to save form");
    }

  }

};

const hydrateFormFromDB = (dbForm) => {
  return {
    form: {
      title: dbForm.title || "",
      description: dbForm.description || "",
      sections: dbForm?.sections?.map((section) => ({
        id: section._id,
        title: section.title,
        fields: section.fields.map((field) => ({
          id: field._id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || "",
          required: field.required || false,
          options:
            field.options?.map((opt, idx) => ({
              id: uid("opt"),
              label: opt
            })) || []
        }))
      }))
    },

    styles: {
      header: {
        fontSize: dbForm.headerStyles?.fontSize ?? 20,
        fontFamily: dbForm.headerStyles?.fontFamily ?? "Inter",
        bgColor: dbForm.headerStyles?.bgColor ?? "#6ba6ff",
        bold: dbForm.headerStyles?.bold ?? false,
        italic: dbForm.headerStyles?.italic ?? false,
        underline: dbForm.headerStyles?.underline ?? false
      },
      section: {
        fontSize: dbForm.sectionStyles?.fontSize ?? 18,
        fontFamily: dbForm.sectionStyles?.fontFamily ?? "Inter",
        bgColor: dbForm.sectionStyles?.bgColor ?? "#9e9e9e",
        bold: dbForm.sectionStyles?.bold ?? false,
        italic: dbForm.sectionStyles?.italic ?? false,
        underline: dbForm.sectionStyles?.underline ?? false
      },
      field: {
        fontSize: dbForm.fieldStyles?.fontSize ?? 16,
        fontFamily: dbForm.fieldStyles?.fontFamily ?? "Arial",
        bgColor: dbForm.fieldStyles?.bgColor ?? "#ffffff",
        bold: dbForm.fieldStyles?.bold ?? false,
        italic: dbForm.fieldStyles?.italic ?? false,
        underline: dbForm.fieldStyles?.underline ?? false
      }
    }
  };
};

useEffect(() => {
  const fetchForm = async () => {
    const res = await fetch(`${url}/forms/${id}`);
    const dbForm = await res.json();
    const { form, styles } = hydrateFormFromDB(dbForm.data);
    setForm(form);
    setStyles(styles);
  };

  fetchForm();
}, []);


  /* ---------------- UI ---------------- */

  return (
    <div className="bg-slate-200 min-h-screen pb-5 ">
    <Navbar styles={styles} setStyles={setStyles} />
    
    <Card style={{width:"60vw", margin:"10px auto", backgroundColor: "transparent", border:"none"}} >
       <Card
        style={{
            position:"relative"
        }}
       >
        <div className="absolute top-0 left-0 w-full h-4 rounded-tr-md rounded-tl-md" style={{backgroundColor: styles.header.bgColor}}></div>
      <Title level={3}>Form Builder</Title>

      <Input
        placeholder="Form Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{
        marginBottom: 8,
        
        fontFamily: styles.header.fontFamily,
        fontSize: styles.header.fontSize,
        fontWeight: styles.header.bold ? "bold" : "normal",
        fontStyle: styles.header.italic ? "italic" : "normal",
        textDecoration: styles.header.underline ? "underline" : "none"
        }}
      />

      <Input.TextArea
        placeholder="Form Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={{ marginBottom: 16 }}
        />
        </Card> 


      {form?.sections?.map((section, sIdx) => (
        <React.Fragment key={section.id}>
        <Divider > Section </Divider>
        <Card
            
            style={{
            position:"relative",
            marginBottom: 10,
            backgroundColor: "transparent",
            border:"none",
            display: "flex",
            flexDirection: "column",
            gap:"20px"
            }}
            bodyStyle={{ padding: 0 }}
            
        >
           
        <div className=" top-header-bg absolute top-0 left-0 w-full h-4 rounded-tr-md rounded-tl-md" style={{backgroundColor: styles.section.bgColor}}></div>
            <div className="px-3 py-8 bg-white rounded-b-md mb-10 flex gap-3 items-center" style={{marginTop: "10px"}} >
                <Input
                    value={section.title}
                    onChange={(e) =>
                    updateSection(sIdx, "title", e.target.value)
                    }
                    className="border-0 outline-0 w-full px-1"
                    style={{
                    fontFamily: styles.section.fontFamily,
                    fontSize: styles.section.fontSize,
                    fontWeight: styles.section.bold ? "bold" : "normal",
                    fontStyle: styles.section.italic ? "italic" : "normal",
                    textDecoration: styles.section.underline ? "underline" : "none",
                    backgroundColor: "transparent", 
                    }}
                />
                 <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteSection(sIdx)}
                    style={{ marginLeft: 10, }}
                />
            </div>

           
          {/* FIELDS */}
          {section?.fields?.map((field, fIdx) => (
            <Card
            key={field.id}
            size="small"
            style={{ marginBottom: 12, ...styles.field }}
            onFocus={() =>
            setActiveField({ sectionIndex: sIdx, fieldIndex: fIdx })
            }
            >
            
            <Space 
            orientation="vertical" 
            style={{ width: "100%" }} 
            >
                
                {/* QUESTION / LABEL */}
                <Input
                placeholder="Field Label"
                value={field.label}
                onChange={(e) =>
                updateField(sIdx, fIdx, "label", e.target.value)
                }
                onFocus={() =>
                setActiveField({ sectionIndex: sIdx, fieldIndex: fIdx })
                }
                style={styles.field}
                />
                {/* FIELD META */}
                <Space
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                <Select
                    value={field.type}
                    onChange={(val) =>
                    updateField(sIdx, fIdx, "type", val)
                    }
                    style={{ width: 140 }}
                >
                    <Select.Option value="text">Text</Select.Option>
                    <Select.Option value="number">Number</Select.Option>
                    <Select.Option value="dropdown">Dropdown</Select.Option>
                    <Select.Option value="radio">Radio</Select.Option>
                    <Select.Option value="checkbox">Checkbox</Select.Option>
                </Select>

                <section className="flex gap-4 items-center">
                    
                    <Switch
                    checked={field.required}
                    onChange={(val) =>
                    updateField(sIdx, fIdx, "required", val)
                    }
                    checkedChildren="Required"
                    unCheckedChildren="Required"
                    />

                    <Button
                    danger
                    size="small"
                    onClick={() => deleteField(sIdx, fIdx)}
                    >
                    Remove
                    </Button>
                </section>
                </Space>    

                <OptionsEditor
                options={field.options}
                onChange={(opts) =>
                updateField(sIdx, fIdx, "options", opts)
                }
                visible={
                activeField?.sectionIndex === sIdx &&
                activeField?.fieldIndex === fIdx &&
                hasOptions(field.type)
                }
                />

            </Space>
           
            </Card>

        ))}

       

        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addField(sIdx)}
            style={{textAlign:"end"}}
          >
            Add Field
          </Button>
        </div>
        </Card>
        </React.Fragment>
      ))}

      <Divider />

      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={addSection}
        style={{height:"60px"}}
      >
        Add Section
      </Button>

      <Divider />

      <Button type="primary" onClick={saveForm}>
        Save Form
      </Button>
    </Card>
    </div>
  );
}
