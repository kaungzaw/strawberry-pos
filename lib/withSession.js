import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password: "wrK6ZNY77mKD704Fm8WMydF91vF68jTt",
  cookieName: "strawberry-pos",
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 10,
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSessionRoute = (handler) =>
  withIronSessionApiRoute(handler, sessionOptions);

export const withSessionSsr = (handler) =>
  withIronSessionSsr(handler, sessionOptions);
