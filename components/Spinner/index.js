import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles["container"]}>
      <Spin indicator={<LoadingOutlined className={styles["icon"]} spin />} />
    </div>
  );
};

export default Spinner;
