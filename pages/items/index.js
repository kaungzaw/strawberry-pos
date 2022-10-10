import { useState } from "react";
import Head from "next/head";
import { Table, Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { withAuthSsr } from "lib/withAuth";
import dbConnect from "lib/dbConnect";
import Item from "@models/Item";
import { getDocuments } from "lib/helpers";

export const getServerSideProps = withAuthSsr(async ({ query }) => {
  try {
    await dbConnect();

    const sort = query.sort ?? "_id";
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;

    const total = await Item.find().count();
    let result = await Item.find().sort(sort).limit(limit).skip(skip);
    result = getDocuments(result);
    return {
      props: { items: { total, result }, success: true },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { items: { total: 0, result: [] }, success: false },
    };
  }
});

const Items = ({ items }) => {
  const router = useRouter();
  let { skip, limit, sort } = router.query;
  limit = limit ? Number(limit) : 10;
  skip = skip ? Number(skip) : 0;

  const [pagination, setPagination] = useState({
    position: ["topRight"],
    showTotal: () => "Total: " + items.total,
    showSizeChanger: true,
    pageSizeOptions: [10, 50],
    total: items.total,
    current: skip / limit + 1,
    pageSize: limit,
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder:
        sort === "name" ? "ascend" : sort === "-name" ? "descend" : false,
    },
    {
      title: "Buy Price",
      dataIndex: "buy_price",
      key: "buy_price",
      sorter: true,
      sortOrder:
        sort === "buy_price"
          ? "ascend"
          : sort === "-buy_price"
          ? "descend"
          : false,
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
      title: "Action",
      key: "action",
      render: (record) => (
        <Button>
          <Link href={`/items/${record._id}`}>Edit</Link>
        </Button>
      ),
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
        <title>POS - Items</title>
      </Head>
      <Button type="primary">
        <Link href="/items/create">Create</Link>
      </Button>
      {items.total === 0 && (
        <>
          <br />
          <br />
        </>
      )}
      <Table
        columns={columns}
        dataSource={items.result}
        rowKey="_id"
        onChange={handleTableChange}
        pagination={pagination}
        size="small"
        bordered
      />
    </>
  );
};

export default Items;
