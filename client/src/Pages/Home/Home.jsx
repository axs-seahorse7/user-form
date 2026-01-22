import { Tabs } from "antd";
import AllForms from "../../Components/Dashboard/AllForms.jsx";
import FormResponses from "../../Components/Dashboard/FormResponses.jsx";
import VisitedForms from "../../Components/Dashboard/VisitedForms.jsx";
import Navbar from "../../Components/User-Nav/Navbar.jsx";
import axios from "axios";
import { useEffect } from "react";

const { TabPane } = Tabs;

export default function Home() {

  


  return (
    <>
      <Navbar />
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="forms" destroyInactiveTabPane>
        <TabPane tab="All Forms" key="forms">
          <AllForms />
        </TabPane>

        <TabPane tab="Responses" key="responses">
          <FormResponses />
        </TabPane>

        <TabPane tab="Visited Forms" key="visited">
          <VisitedForms />
        </TabPane>
      </Tabs>
    </div>
    </>
  );
}
