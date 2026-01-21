import React, { useState } from "react";
import { Card, Input, Button, Select, Switch, Divider, Space, Typography, message } from "antd";
import axios from "axios";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { uid } from "uid";
import Navbar from "../Form-Nav/Navbar/Navbar";

const { Title, Text } = Typography;

 


export default function FormBuilder() {
    const [activeField, setActiveField] = useState(null);
    const [styles, setStyles] = useState({
        header: {
            fontSize: 16,
            fontFamily: "Inter",
            bgColor: "#6ba6ff",
            bold: true,
            italic: false,
            underline: false
        },
        section: {
            fontSize: 20,
            fontFamily: "Inter",
            bgColor: "#9e9e9e",
            bold: false,
            italic: false,
            underline: false
        },
        field: {
            fontSize: 14,
            fontFamily: "Arial",
            bgColor: "#ffffff",
            bold: false,
            italic: false,
            underline: false
        }
    });
        
    console.log("Styles in FormBuilder:", styles);

  const [form, setForm] = useState({
    title: "",
    description: "",
    sections: []
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
          styles: {
            headerBgColor: "#f5f7fa",
            headerTextColor: "#111827",
            fontSize: 16,
            fontWeight: "bold"
          },
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
      styles: {
        fontSize: 14,
        bold: false,
        italic: false,
        underline: false,
        strike: false
      }
    });
    setForm({ ...form, sections });
  };

  const updateField = (sIdx, fIdx, key, value) => {
  setForm((prev) => ({
    ...prev,
    sections: prev.sections.map((section, si) =>
      si !== sIdx
        ? section
        : {
            ...section,
            fields: section.fields.map((field, fi) =>
              fi !== fIdx
                ? field
                : {
                    ...field,
                    [key]: value
                  }
            )
          }
    )
  }));
};


 const deleteField = (sIdx, fIdx) => {
  setForm((prev) => {
    const sections = [...prev.sections];

    if (sections[sIdx].fields.length === 1) return prev; // 🚫 block

    sections[sIdx].fields.splice(fIdx, 1);
    return { ...prev, sections };
  });
};

const createOption = () => ({
  id: uid("option"),
  label: ""
});

console.log("form", form)


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


  /* ---------------- SAVE ---------------- */

  const saveForm = async () => {
    try {
      await axios.post("/api/forms", form);
      message.success("Form saved successfully");
    } catch (err) {
      message.error("Failed to save form");
    }
  };

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


      {form.sections.map((section, sIdx) => (
        <React.Fragment key={section.id}>
        <Divider />
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
          {section.fields.map((field, fIdx) => (
            <Card
            key={field.id}
            size="small"
            style={{ marginBottom: 12, ...styles.field }}
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
                    <Select
                        value={field.type}
                        onFocus={() =>
                            setActiveField({ sectionIndex: sIdx, fieldIndex: fIdx })
                        }
                        onChange={(val) =>
                            updateField(sIdx, fIdx, "type", val)
                        }
                        />

                        <Switch
                        checked={field.required}
                        onFocus={() =>
                            setActiveField({ sectionIndex: sIdx, fieldIndex: fIdx })
                        }
                        onChange={(val) =>
                            updateField(sIdx, fIdx, "required", val)
                        }
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

          <Button
            type="dashed"
            primary
            
            icon={<PlusOutlined />}
            onClick={() => addField(sIdx)}
          >
            Add Field
          </Button>
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
