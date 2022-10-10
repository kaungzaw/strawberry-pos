import Head from "next/head";
import { Table, Typography } from "antd";
import { withAuthSsr } from "@lib/withAuth";
import dbConnect from "@lib/dbConnect";
import Sale from "@models/Sale";
import moment from "moment";

const { Title } = Typography;

export const getServerSideProps = withAuthSsr(async ({ query }) => {
  try {
    await dbConnect();

    const date = query.date;

    const result = await Sale.aggregate([
      { $match: { date } },
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
          buy_price: { $first: "$foundItems.buy_price" },
          sell_price: { $first: "$sell_price" },
          quantity: { $first: "$quantity" },
        },
      },
      {
        $project: {
          date: 1,
          name: 1,
          buy_price: 1,
          sell_price: 1,
          quantity: 1,
          total: {
            $multiply: ["$sell_price", "$quantity"],
          },
        },
      },
      { $sort: { name: 1 } },
      {
        $group: {
          _id: "$date",
          sales: { $push: "$$ROOT" },
          total: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          sales: 1,
          total: 1,
        },
      },
    ]);
    return {
      props: { data: result[0] },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const DailyReportDetails = ({ data }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Buy Price",
      dataIndex: "buy_price",
      key: "buy_price",
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
  ];

  return (
    <>
      <Head>
        <title>POS - Daily Report Details</title>
      </Head>
      <Title level={4}>Date: {moment(data.date).format("DD/MM/YYYY")}</Title>
      <Title level={4}>Total: {data.total}</Title>
      <br />
      <Table
        columns={columns}
        dataSource={data.sales}
        rowKey="_id"
        size="small"
        pagination={false}
        bordered
      />
    </>
  );
};

export default DailyReportDetails;
