import Head from "next/head";
import { withAuthSsr } from "@lib/withAuth";

export const getServerSideProps = withAuthSsr(() => {
  return {
    props: {},
  };
});

const Dashboard = () => {
  return (
    <div>
      <Head>
        <title>POS - Dashboard</title>
      </Head>
      <main>Dashboard</main>
    </div>
  );
};

export default Dashboard;
