import { Layout, Menu, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./MainLayout.module.css";

const { Content, Sider } = Layout;
const { Title } = Typography;

const items = [
  { label: <Link href="/">Dashboard</Link>, key: "dashboard" },
  { label: <Link href="/items?">Items</Link>, key: "items" },
  {
    label: <Link href="/sales?">Sales</Link>,
    key: "sales",
  },
  {
    label: <Link href="/daily-reports?">Daily Reports</Link>,
    key: "daily-reports",
  },
  {
    label: "More",
    key: "more",
    children: [{ label: "Log Out", key: "logout" }],
  },
];

const MainLayout = ({ children }) => {
  const router = useRouter();

  const handleMenuClick = async ({ key }) => {
    if (key === "logout") {
      try {
        await axios.post("/api/logout");
        router.push("/auth/login");
      } catch (error) {
        console.log(error);
        message.error("Failed to Log Out.");
      }
    }
  };

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        theme="light"
      >
        <Title className={styles["title"]}>POS</Title>
        <Menu
          mode="inline"
          selectedKeys={[
            router.pathname !== "/"
              ? router.pathname.split("/")[1]
              : "dashboard",
          ]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className={styles["layout"]}>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
