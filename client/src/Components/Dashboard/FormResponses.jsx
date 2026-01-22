import { Card, Tag, Typography, Divider } from "antd";
import { FileTextOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;


export default function FormResponses() {
  const url = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [responses, setResponses] = useState([]);
  const [Forms, setForms] = useState([])
  const navigate = useNavigate();
  const [isLoadingForm, setisLoadingForm] = useState(false)
  const [isSubmissionLoadin, setisSubmissionLoadin] = useState(false)


  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setisSubmissionLoadin(true)
        const { data } = await axios.get(`${url}/form/responses/${user?.id}`, { withCredentials: true });
        console.log("Fetched form responses:", data.data);
        setResponses(data.data);
      } catch (error) {
        console.error("Error fetching form responses:", error.message);
      }finally{
        setisSubmissionLoadin(false)
      }
    };

    fetchResponses();
  }, [url, user?.id]);

  useEffect(() => {
    
    const fetchResponses = async () => {
      try {
        setisLoadingForm(true)
      const {data} = await axios.get(`${url}/user/forms/${user?.id}`, { withCredentials: true });
      setForms(data.data);
      console.log("Fetched user forms :", data.data);
      setResponses(data.data);
      } catch (error) {
        console.error("Error fetching user forms :", error.message);
      }finally{
        setisLoadingForm(false)
      }
    };

    fetchResponses();
  }, [url, user?.id]);




  return (
    <section className="form-responses flex flex-col gap-4">

      <div className="form-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        { isLoadingForm ? (
          <div>Loading forms...</div>
        ) : Forms?.map((form) => (
          <Card
            key={form._id}
            hoverable
            className="rounded-xl shadow-sm transition-all hover:shadow-md"
            bodyStyle={{ padding: 16 }}
            actions={[
              <span
                key="open"
                onClick={() => navigate(`${form.path}?edit=true`)}
                className="flex items-center justify-center gap-2 text-blue-600 font-medium"
              >
                Open Form <ArrowRightOutlined />
              </span>
            ]}
            loading={isLoadingForm}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextOutlined className="text-blue-600 text-lg" />
              </div>

              <div className="flex flex-col gap-1">
                <Title level={5} className="!mb-0">
                  {form.title}
                </Title>

                <Text type="secondary" ellipsis>
                  {form.description || "No description provided"}
                </Text>
              </div>
            </div>
          </Card>
        ))
        }
      </div>

      <Divider />

      <Title level={4}>Form Responses</Title>

      <div className="flex gap-4">
        {
          isSubmissionLoadin ? (
          <div>Loading responses...</div>
        ) :
        responses?.map((resp, idx) => (
          <Card key={idx} title={ <div className="flex flex-col"> <span>{resp?.formId?.title} </span> <span className="text-sm text-gray-400"> {resp?.submittedBy?.email} </span>  </div> } style={{ marginBottom: '20px' }}>
            <div>
              {resp?.responses?.map((r, rIdx) => (
                <p key={rIdx}><strong>{r.label}:</strong> {Array.isArray(r.value) ? r.value.join(", ") : r.value}</p>
              ))}
            </div>
          </Card>
        ))  }
      </div>

    </section>
  );
}
