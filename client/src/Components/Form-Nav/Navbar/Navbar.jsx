import {useState } from "react";
import { Layout, Input, Button, Avatar, Space, Tooltip } from "antd";
import { BgColorsOutlined, SaveOutlined, ShareAltOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import FormStyleDrawer from "../Style-Drawer/FormStyleDrawer.jsx";
const { Header } = Layout;

export default function Navbar({ formName, setFormName, styles, setStyles, onSave, onPublish }) {
    const [open, setOpen] = useState(false)
    const onOpenStylePanel = () => setOpen(true);

    

  return (
    <>  
    <FormStyleDrawer open={open} onClose={() => setOpen(false)} styles={styles} setStyles={setStyles} />
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64,
        padding: "0 24px"
      }}
    >
      {/* LEFT SIDE */}
         {/* RIGHT SIDE */}
      <Input
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="Form name"
        style={{ width: 280 }}
      />

      <Space>

        <Tooltip title="Style Form">
          <Button
            icon={<BgColorsOutlined />}
            onClick={onOpenStylePanel}
          />
        </Tooltip>

        <Button
          icon={<SaveOutlined />}
          onClick={onSave}
        >
          Save
        </Button>

        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={onPublish}
        >
          Publish
        </Button>

        <Button
          icon={<ShareAltOutlined />}
        >
          Share
        </Button>
        <Avatar icon={<UserOutlined />} />
      </Space>

     
    </Header>
    </>
  );
}
