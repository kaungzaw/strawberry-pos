import { withSessionRoute } from "@lib/withSession";

async function handler(req, res) {
  if (req.method === "POST") {
    req.session.destroy();
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}

export default withSessionRoute(handler);
