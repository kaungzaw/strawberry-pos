import { withSessionRoute, withSessionSsr } from "./withSession";

export const withAuthRoute = (handler) =>
  withSessionRoute(async (req, res) => {
    const user = req.session.user;

    if (!user) {
      res.status(401).end();
      return;
    }

    return await handler(req, res);
  });

export const withAuthSsr = (handler) =>
  withSessionSsr(async (context) => {
    const { req } = context;
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    return await handler(context);
  });
