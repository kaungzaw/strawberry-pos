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

    const sort = query.sort ?? "-date";
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;

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
          sell_price: { $first: "$sell_price" },
          quantity: { $first: "$quantity" },
        },
      },
      {
        $project: {
          date: 1,
          sell_price: 1,
          quantity: 1,
          total: {
            $multiply: ["$sell_price", "$quantity"],
          },
        },
      },
      {
        $group: {
          _id: "$date",
          total: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
        },
      },
    ])
      .sort(sort)
      .limit(limit)
      .skip(skip);
    const total = result.length;
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

const DailyReports = ({ data }) => {
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
      render: (date) => <span>{moment(date).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: true,
      sortOrder:
        sort === "total" ? "ascend" : sort === "-total" ? "descend" : false,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button>
          <Link href={`/daily-reports/${record.date}`}>Details</Link>
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
        <title>POS - Daily Reports</title>
      </Head>
      <Button type="primary">
        <Link href="/sales/create">Create</Link>
      </Button>
      {data.total === 0 && (
        <>
          <br />
          <br />
        </>
      )}
      <Table
        columns={columns}
        dataSource={data.result}
        rowKey="date"
        onChange={handleTableChange}
        pagination={pagination}
        size="small"
        bordered
      />
    </>
  );
};

export default DailyReports;
