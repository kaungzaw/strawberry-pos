import Head from "next/head";
import { Form, Input, InputNumber, Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { withAuthSsr } from "lib/withAuth";
import dbConnect from "lib/dbConnect";
import { Item } from "models";
import { getDocuments } from "lib/helpers";

export const getServerSideProps = withAuthSsr(async ({ query }) => {
  try {
    const _id = query._id;
    await dbConnect();
    let result = await Item.findOne({ _id });
    result = getDocuments(result);
    return {
      props: { item: result },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
});

const EditItem = ({ item }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  async function onFinish(values) {
    try {
      if (form.isFieldsTouched()) {
        axios.put(`/api/items/${item._id}`, values);
        router.replace(router.asPath);
        message.success("Item updated successfully.");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to update Item.");
    }
  }

  const handleDelete = async () => {
    const { _id, name } = item;
    Modal.confirm({
      title: "Do you want to delete this Item?",
      icon: <ExclamationCircleOutlined />,
      content: <div>{`Name: ${name}`}</div>,
      onOk: async () => {
        try {
          await axios.delete(`/api/items/${_id}`);
          message.success("Item deleted successfully.");
          router.push("/items?");
        } catch (error) {
          console.log(error);
          message.error("Failed to delete Item.");
        }
      },
    });
  };

  return (
    <>
      <Head>
        <title>POS - Edit Item</title>
      </Head>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={item}
        layout="vertical"
        method="POST"
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Buy Price"
          name="buy_price"
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Sell Price"
          name="sell_price"
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button htmlType="reset">Reset</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="danger" htmlType="button" onClick={handleDelete}>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EditItem;
