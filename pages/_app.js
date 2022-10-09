import "../styles/globals.css";
// import { useState } from "react";
import MainLayout from "components/MainLayout";
// import Spinner from "components/Spinner";

function MyApp({ Component, pageProps, ...rest }) {
  const { router } = rest;

  // const [loading, setLoading] = useState();

  // const toggleLoading = () => setLoading((loading) => !loading);

  // router.events?.on("routeChangeStart", toggleLoading);
  // router.events?.on("routeChangeComplete", toggleLoading);

  if (["/auth/login"].includes(router.pathname))
    return <Component {...pageProps} />;

  return (
    <MainLayout>
      {/* {loading ? <Spinner /> : <Component {...pageProps} />} */}
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
