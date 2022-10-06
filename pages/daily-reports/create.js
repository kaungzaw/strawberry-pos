import { useState } from "react";
import Head from "next/head";
import {
  Form,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Table,
  message,
} from "antd";
import axios from "axios";
import { dateFormat } from "lib/constants";
import { withAuthSsr } from "lib/withAuth";
import dbConnect from "lib/dbConnect";
import Item from "models/Item";
import { getDocuments } from "lib/helpers";

export const getServerSideProps = withAuthSsr(async () => {
  try {
    await dbConnect();
    let result = await Item.find();
    result = getDocuments(result);
    return {
      props: { items: result, success: true },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { items: [], success: false },
    };
  }
});

const CreateDailyReport = ({ items }) => {
  const [form] = Form.useForm();

  const [data, setData] = useState([]);

  async function onFinish(values) {
    const date = values.date.toISOString(true);
    const item = JSON.parse(values.item);
    const quantity = values.quantity;
    const foundItemIndex = data.findIndex((i) => i._id === item._id);
    if (foundItemIndex > -1) {
      const foundItem = data[foundItemIndex];
      const newQuantity = foundItem.quantity + quantity;
      const newTotal = newQuantity * item.sell_price;
      let temp = data;
      temp[foundItemIndex] = {
        ...foundItem,
        quantity: newQuantity,
        total: newTotal,
      };
      setData([...temp]);
    } else {
      setData([
        ...data,
        {
          _id: item._id,
          date,
          name: item.name,
          quantity,
          sell_price: item.sell_price,
          total: quantity * item.sell_price,
        },
      ]);
    }
    form.resetFields(["item", "quantity"]);
  }

  const handleDelete = ({ _id }) => {
    const newData = data.filter((i) => i._id !== _id);
    setData([...newData]);
  };

  const saveData = async () => {
    try {
      const date = data[0].date;
      const items = data.map((i) => ({ _id: i._id, quantity: i.quantity }));
      await axios.post("/api/daily-reports", { date, items });
      form.resetFields();
      message.success("Daily Report created successfully.");
    } catch (error) {
      console.log(error);
      message.error("Failed to create Daily Report.");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Sell Price",
      dataIndex: "sell_price",
      key: "sell_price",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button type="danger" onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>POS - Create Daily Report</title>
      </Head>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
          <DatePicker
            format={dateFormat}
            disabled={data.length > 0}
            showToday
          />
        </Form.Item>

        <Form.Item label="Item" name="item" rules={[{ required: true }]}>
          <Select placeholder="Select Item">
            {items.map((item) => (
              <Select.Option key={item._id} value={JSON.stringify(item)}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
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
            Add
          </Button>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        htmlType="button"
        onClick={saveData}
        disabled={data.length === 0}
      >
        Save
      </Button>
      <br />
      <br />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        size="small"
        bordered
      />
    </>
  );
};

export default CreateDailyReport;
