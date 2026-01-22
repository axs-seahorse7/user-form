import React from "react";
import { Form, Input, Select, Radio, Button, Typography, Card,  Divider, message, } from "antd";
import axios from "axios";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ResponseForm = ({ form, }) => {
  const [antdForm] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));
  const url = import.meta.env.VITE_API_URL;

  const handleFinish = async (values) => {
    const responses = [];

  form.sections.forEach(section => {
    section.fields.forEach(field => {
      const value = values[field._id];

      if (value !== undefined) {
        responses.push({
          fieldId: field._id,
          label: field.label, 
          value
        });
      }
    });
  });

  const payload = {
    formId: form._id,
    submittedBy: user?.id,
    responses
  };
    console.log("Submitting form response with payload:", payload);

    try {
      const {data} = await axios.post(`${url}/responses`, payload, { withCredentials: true });
      console.log("Form response submitted successfully:", data);
      message.success("Your response has been submitted successfully!");
      window.location.reload();
    }catch(error){
      console.error("Error submitting form response:", error.message);
      message.error("There was an error submitting your response. Please try again.");
    }
  };


const renderField = (field) => {
  if (!field?._id) return null;

  const rules = field.required
    ? [{ required: true, message: `${field.label} is required` }]
    : [];

  switch (field.type) {

    case "text":
    case "email":
      return (
        <Form.Item
          key={field._id}
          name={field._id}          
          label={field.label}
          rules={rules}
        >
          <Input
            type={field.type}
            placeholder={field.placeholder || ""}
          />
        </Form.Item>
      );

    case "radio":
      return (
        <Form.Item
          key={field._id}
          name={field._id}     
          label={field.label}
          rules={rules}
        >
          <Radio.Group>
            {(field.options || []).map((opt) => (
              <Radio key={opt} value={opt}>
                {opt}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      );

    case "dropdown":
      return (
        <Form.Item
          key={field._id}
          name={field._id}   
          label={field.label}
          rules={rules}
        >
          <Select placeholder="Select an option">
            {(field.options || []).map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );

    case "checkbox":
      return (
        <Form.Item
          key={field._id}
          name={field._id}       
          label={field.label}
          rules={rules}
        >
          <Checkbox.Group>
            {(field.options || []).map((opt) => (
              <Checkbox key={opt} value={opt}>
                {opt}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      );

    default:
      return null;
  }
};


  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50 space-y-6">
      
      {/* 1. SEPARATE HEADER CARD */}
      <Card className="shadow-sm border-t-8 border-t-blue-600 relative">
        <div className="absolute top-0 left-0 rounded-tl-md rounded-bl-md h-full w-3 " style={{ backgroundColor: form?.headerStyles?.headerBgColor ?? "blue" }} />

        <Title level={2} className="mb-2">{form.title}</Title>
        <Paragraph className="text-gray-500 mb-0">{form.description}</Paragraph>
        <p className=" mb-0"><span className="text-cyan-500">{user?.email}</span> your email will be recorded as response </p>

      </Card>

      <Form
        form={antdForm}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        className="space-y-6" // Adds spacing between each Section Card
      >
        {/* 2. SECTION-WISE CARDS */}
        {form?.sections?.map((section) => (
          <React.Fragment key={section.id}>
            <Divider />
          <Card key={section.id} className="shadow-sm relative">
            <div className="absolute top-0 left-0 rounded-tl-md rounded-bl-md h-full w-3 " style={{ backgroundColor: section?.sectionStyles?.headerBgColor }} />
            <Title level={4} className="mb-6 border-b pb-2">
              {section.title}
            </Title>
            
            <div className="space-y-4">
              {section?.fields?.map((field) => renderField(field))}
            </div>
          </Card>
          </React.Fragment>
        ))}

        {/* 3. SUBMIT ACTION (Bottom Card or floating) */}
        <Divider />
        <div className="flex justify-start">

          <Button type="primary" htmlType="submit" size="large" className="px-10 h-auto py-2 font-semibold">
            Submit Response
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ResponseForm;