import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../Components/Helper/Axios-Api/api.js";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/login",
        values
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(data);

      message.success("Login successful");
      if(data.success) navigate("/", { replace: true });

    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card title="Login" style={styles.card}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Login
          </Button>

          <Button type="link" block onClick={() => navigate("/register")}>
            Create account
          </Button>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5"
  },
  card: {
    width: 350
  }
};

export default Login;
