import { useState } from "react";
import Head from "next/head";
import { Form, Input, InputNumber, Button, message } from "antd";
import { withAuthSsr } from "@lib/withAuth";
import axios from "axios";

export const getServerSideProps = withAuthSsr(() => {
  return {
    props: {},
  };
});

const CreateItem = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  async function onFinish(values) {
    try {
      setLoading(true);
      await axios.post("/api/items", values);
      form.resetFields();
      message.success("Item created successfully.");
    } catch (error) {
      console.log(error);
      message.error("Failed to create Item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>POS - Create Item</title>
      </Head>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Buy Price"
          name="buy_price"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Sell Price"
          name="sell_price"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateItem;
