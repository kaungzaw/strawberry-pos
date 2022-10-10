import "../styles/globals.css";
import "../styles/nprogress.css";
import NProgress from "nprogress";
import MainLayout from "components/MainLayout";

NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps, ...rest }) {
  const { router } = rest;

  router.events?.on("routeChangeStart", () => NProgress.start());
  router.events?.on("routeChangeComplete", () => NProgress.done());
  router.events?.on("routeChangeError", () => NProgress.done());

  if (["/auth/login"].includes(router.pathname))
    return <Component {...pageProps} />;

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
