import { withSessionRoute } from "@lib/withSession";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = await req.body;

    if (username === USERNAME && password === PASSWORD) {
      req.session.user = {
        username: "admin",
      };
      await req.session.save();
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  }
}

export default withSessionRoute(handler);
