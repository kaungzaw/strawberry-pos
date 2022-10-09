import { useState } from "react";
import Head from "next/head";
import { Table, Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { withAuthSsr } from "lib/withAuth";
import dbConnect from "lib/dbConnect";
import Sale from "models/Sale";
import moment from "moment";

export const getServerSideProps = withAuthSsr(async ({ query }) => {
  try {
    await dbConnect();

    const sort = query.sort ?? "_id";
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;

    const total = await Sale.find().count();
    const result = await Sale.aggregate([
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
    ])
      .sort(sort)
      .limit(limit)
      .skip(skip);
    return {
      props: { data: { total, result }, success: true },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { data: { total: 0, result: [] }, success: false },
    };
  }
});

const Sales = ({ data }) => {
  const router = useRouter();
  let { skip, limit, sort } = router.query;
  limit = limit ? Number(limit) : 10;
  skip = skip ? Number(skip) : 0;

  const [pagination, setPagination] = useState({
    position: ["topRight"],
    showSizeChanger: true,
    pageSizeOptions: [10, 50],
    total: data.total,
    current: skip / limit + 1,
    pageSize: limit,
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      sortOrder:
        sort === "date" ? "ascend" : sort === "-date" ? "descend" : false,
      render: (record) => (
        <span>{moment(record.date).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder:
        sort === "name" ? "ascend" : sort === "-name" ? "descend" : false,
    },
    {
      title: "Sell Price",
      dataIndex: "sell_price",
      key: "sell_price",
      sorter: true,
      sortOrder:
        sort === "sell_price"
          ? "ascend"
          : sort === "-sell_price"
          ? "descend"
          : false,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: true,
      sortOrder:
        sort === "quantity"
          ? "ascend"
          : sort === "-quantity"
          ? "descend"
          : false,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: true,
      sortOrder:
        sort === "total" ? "ascend" : sort === "-total" ? "descend" : false,
    },
  ];

  const handleTableChange = (pagination, _filters, sorter) => {
    let query = "?";

    const { current, pageSize } = pagination;
    query = query + `&skip=${(current - 1) * pageSize}&limit=${pageSize}`;

    setPagination((pagination) => ({ ...pagination, current, pageSize }));

    const { field, order } = sorter;
    if (order) {
      query = query + `&sort=${order === "ascend" ? "" : "-"}${field}`;
    }
    router.replace(router.pathname + query);
  };

  return (
    <>
      <Head>
        <title>POS - Sales</title>
      </Head>
      <Button type="primary">
        <Link href="/sales/create">Create</Link>
      </Button>
      <Table
        columns={columns}
        dataSource={data.result}
        rowKey="_id"
        onChange={handleTableChange}
        pagination={pagination}
        size="small"
        bordered
      />
    </>
  );
};

export default Sales;
