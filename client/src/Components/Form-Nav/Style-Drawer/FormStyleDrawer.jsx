import React from "react";
import {
  Drawer,
  Card,
  Divider,
  Select,
  Switch,
  Space,
  Typography,
  Input
} from "antd";

const { Text } = Typography;

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Roboto", label: "Roboto" }
];





function StyleBlock({ title, value = {}, onChange,}) {

   

  return (
    <>
      <Divider orientation="center">{title}</Divider>

      <Card size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          
          <Text>Font Size</Text>
          <Input
            type="number"
            value={value.fontSize}
            onChange={(e) =>
              onChange({ ...value, fontSize: +e.target.value })
            }
          />

          <Text>Font Family</Text>
          <Select
            value={value.fontFamily}
            options={FONT_OPTIONS}
            onChange={(v) =>
              onChange({ ...value, fontFamily: v })
            }
            style={{ width: "100%" }}
          />

          <Text>Background Color</Text>
          <Input
            type="color"
            value={value.bgColor}
            onChange={(e) =>
              onChange({ ...value, bgColor: e.target.value })
            }
          />

          <Space>
            <Switch
              checked={value.bold}
              onChange={(v) =>
                onChange({ ...value, bold: v })
              }
              checkedChildren="Bold"
            />

            <Switch
              checked={value.italic}
              onChange={(v) =>
                onChange({ ...value, italic: v })
              }
              checkedChildren="Italic"
            />

            <Switch
              checked={value.underline}
              onChange={(v) =>
                onChange({ ...value, underline: v })
              }
              checkedChildren="Underline"
            />
          </Space>

        </Space>
      </Card>
    </>
  );
}

export default function FormStyleDrawer({
  open,
  onClose,
  styles,
  setStyles
}) {
  const updateStyle = (key, value) => {
    setStyles((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Drawer
      title="Form Styling"
      placement="right"
      width={340}
      open={open}
      onClose={onClose}
      mask={false}   // ✅ no blur
      closable
    >
      <StyleBlock
        title="Header"
        value={styles.header}
        onChange={(v) => updateStyle("header", v)}
      />

      <StyleBlock
        title="Section"
        value={styles.section}
        onChange={(v) => updateStyle("section", v)}
      />

      <StyleBlock
        title="Field"
        value={styles.field}
        onChange={(v) => updateStyle("field", v)}
      />
    </Drawer>
  );
}
