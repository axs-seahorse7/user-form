import { Table, Tag } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {Card} from "antd";

export default function FormResponses() {
  const url = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [responses, setResponses] = useState([]);


  useEffect(() => {
    const fetchResponses = async () => {
      
      try {
        const { data } = await axios.get(`${url}/form/responses/${user?.id}`, { withCredentials: true });
        console.log("Fetched form responses:", data.data);
        setResponses(data.data);
      } catch (error) {
        console.error("Error fetching form responses:", error.message);
      }
    };

    fetchResponses();
  }, [url, user?.id]);

  const dataSource = responses.map(res => res.responses).flat().map((item, index) => ({
  key: item.fieldId || index,
  label: item.label,
  value: Array.isArray(item.value)
    ? item.value.join(", ")
    : item.value
}));

// console.log("Data source for table:", dataSource);

const columns = [
  {
    title: "Field",
    dataIndex: "label",
    key: "label"
  },
  {
    title: "Response",
    dataIndex: "value",
    key: "value"
  }
];



  return (
    <section>
      {responses.map((resp, idx) => (
        <Card key={idx} title={`Response ${idx + 1}`} style={{ marginBottom: '20px' }}>
          <div>
            {resp.responses.map((r, rIdx) => (
              <p key={rIdx}><strong>{r.label}:</strong> {Array.isArray(r.value) ? r.value.join(", ") : r.value}</p>
            ))}
          </div>
        </Card>
      ))  }

      <Table
        rowKey="id"
        dataSource={  dataSource || []}
        pagination={false}
        columns={columns}
      />
    </section>
  );
}
