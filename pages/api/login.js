import { withSessionRoute } from "lib/withSession";

async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = await req.body;

    if (username === "admin" && password === "Admin1234") {
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
