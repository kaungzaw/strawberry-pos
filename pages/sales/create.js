import { useState } from "react";
import Head from "next/head";
import { Form, InputNumber, Button, Select, Table, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { withAuthSsr } from "@lib/withAuth";
import dbConnect from "@lib/dbConnect";
import Item from "@models/Item";
import Sale from "@models/Sale";
import { getDocuments } from "@lib/helpers";
import moment from "moment";

export const getServerSideProps = withAuthSsr(async () => {
  try {
    await dbConnect();
    let items = await Item.find();
    items = getDocuments(items);

    const sales = await Sale.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "itemId",
          foreignField: "_id",
          as: "foundItems",
        },
      },
      { $unwind: "$foundItems" },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          name: { $first: "$foundItems.name" },
          sell_price: { $first: "$sell_price" },
          quantity: { $first: "$quantity" },
        },
      },
      {
        $project: {
          date: 1,
          name: 1,
          sell_price: 1,
          quantity: 1,
          total: {
            $multiply: ["$sell_price", "$quantity"],
          },
        },
      },
    ]).sort("-_id");

    return {
      props: { items, sales },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const CreateSale = ({ items, sales }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(0);

  async function onFinish(values) {
    try {
      setLoading(true);
      const item = JSON.parse(values.item);
      const quantity = values.quantity;
      const date = moment().format("YYYY-MM-DD");
      await axios.post("/api/sales", {
        date,
        itemId: item._id,
        sell_price: item.sell_price,
        quantity,
      });
      form.resetFields();
      setMaxQuantity(0);
      router.replace(router.asPath);
      message.success("Sale created successfully.");
    } catch (error) {
      console.log(error);
      message.error("Failed to create Sale.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (record) => {
    const { _id, name } = record;
    Modal.confirm({
      title: "Do you want to delete this Sale?",
      icon: <ExclamationCircleOutlined />,
      content: <div>{`Name: ${name}`}</div>,
      onOk: async () => {
        try {
          await axios.delete(`/api/sales/${_id}`);
          form.resetFields();
          setMaxQuantity(0);
          router.replace(router.asPath);
          message.success("Sale deleted successfully.");
        } catch (error) {
          console.log(error);
          message.error("Failed to delete Sale.");
        }
      },
    });
  };

  const onValuesChange = (changeValues) => {
    if (changeValues.item) {
      const item = JSON.parse(changeValues.item);
      setMaxQuantity(item.quantity);
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
      title: "Sell Price",
      dataIndex: "sell_price",
      key: "sell_price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
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
        <Button
          type="danger"
          onClick={() => handleDelete(record)}
          loading={loading}
          disabled={loading}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>POS - Create Sale</title>
      </Head>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        layout="vertical"
      >
        <Form.Item label="Item" name="item" rules={[{ required: true }]}>
          <Select
            placeholder="Select Item"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            showSearch
          >
            {items.map(
              (item) =>
                item.quantity !== 0 && (
                  <Select.Option key={item._id} value={JSON.stringify(item)}>
                    {item.name}
                  </Select.Option>
                )
            )}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={maxQuantity} disabled={maxQuantity === 0} />
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

      <Table
        columns={columns}
        dataSource={sales}
        rowKey="_id"
        size="small"
        pagination={false}
        bordered
      />
    </>
  );
};

export default CreateSale;
