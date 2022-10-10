import { withAuthRoute } from "@lib/withAuth";
import dbConnect from "@lib/dbConnect";
import Item from "@models/Item";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { _id } = req.query;
      await Item.deleteOne({ _id });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else if (req.method === "PUT") {
    try {
      const { _id } = req.query;
      await Item.updateOne({ _id }, req.body);
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}

export default withAuthRoute(handler);
