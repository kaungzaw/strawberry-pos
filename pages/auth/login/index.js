import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Form, Input, message, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Login.module.css";

const { Title } = Typography;

const Login = () => {
  const router = useRouter();

  const [loadig, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/login", values);
      router.push("/");
    } catch (error) {
      console.log(error);
      message.error("Invalid Username or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>POS - Log In</title>
      </Head>
      <Title className={styles["title"]}>Strawberry - POS</Title>
      <Form onFinish={onFinish} className={styles["form"]}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles["login-btn"]}
            loading={loadig}
            disabled={loadig}
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
