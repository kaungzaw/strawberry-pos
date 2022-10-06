import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      await axios.post("/api/login", values);
      router.push("/");
    } catch (error) {
      console.log(error);
      message.error("Invalid Username or Password.");
    }
  };

  return (
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
        >
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
