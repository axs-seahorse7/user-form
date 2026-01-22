import {useState } from "react";
import { Layout, Input, Button, Avatar, Space, Tooltip, Modal, message, Card } from "antd";
import { BgColorsOutlined, SaveOutlined, ShareAltOutlined, UploadOutlined, UserOutlined, CopyOutlined } from "@ant-design/icons";
import FormStyleDrawer from "../Style-Drawer/FormStyleDrawer.jsx";
const { Header } = Layout;
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

export default function Navbar({ formName, setFormName, styles, setStyles, onSave, onPublish }) {
    const [open, setOpen] = useState(false)
    const onOpenStylePanel = () => setOpen(true);
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = searchParams.get("edit") === "true" || searchParams.get("edit") === "";
    const [openUrlModal, setOpenUrlModal] = useState(false);

    

  return (
    <>  
    <FormStyleDrawer open={open} onClose={() => setOpen(false)} styles={styles} setStyles={setStyles} />
      <Modal
      title="Share Response Form"
      open={openUrlModal}
      onCancel={() => setOpenUrlModal(false)}
      >

        <section
         className="border border-slate-200 rounded-lg py-5 px-3 flex flex-col gap-4"
        >
          <div
          style={{ display: 'flex', gap: '8px' }}
          className="share-form-url "
          >
               <Input
                value={`${window.location.origin}/response/${id}`}
                readOnly
              />

              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/response/${id}`);
                  setOpenUrlModal(false);
                  message.success('Form URL copied to clipboard!');
                }}
              >
              Copy
            </Button>
          </div>
          <div>
            <Button type="primary" onClick={() => navigate(`/preview/${id}`)} >See Preview</Button>
          </div>
        </section>
      </Modal>
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        height: 64,
        padding: "0 24px"
      }}
    >
      
      

      <Space>

        <Tooltip title="Style Form">
          <Button
            icon={<BgColorsOutlined />}
            onClick={onOpenStylePanel}
          />
        </Tooltip>

       

        {isEditMode && 
        <Button
          icon={<ShareAltOutlined />}
          onClick={() => setOpenUrlModal(true)}
        >
          Share
        </Button>
        }
        <Avatar icon={<UserOutlined />} />
      </Space>

     
    </Header>
    </>
  );
}
