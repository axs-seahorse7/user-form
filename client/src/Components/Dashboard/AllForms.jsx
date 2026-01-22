import { useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import {useEffect} from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function AllForms() {
  const [forms, setForms] = useState([])
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${url}/user/forms/${user.id}`);
        console.log('Fetched forms by user:', response.data);
        setForms(response.data.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);


  return (
    <Row gutter={[16, 16]}>
      {forms.map((form) => (
        <Col key={form._id} span={6}>
          <Card hoverable onClick={() => navigate(`/form/${form._id}?edit=true`)} >
            <h3>{form.title}</h3>
            <Tag
              color={
                form.status === "active"
                  ? "green"
                  : form.status === "draft"
                  ? "orange"
                  : "red"
              }
            >
              {form.status}
            </Tag>
            <p style={{ marginTop: 8 }}>
              Created: {dayjs(form.createdAt).format("MMMM D, YYYY")}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
