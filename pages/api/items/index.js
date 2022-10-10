import { withAuthRoute } from "@lib/withAuth";
import dbConnect from "@lib/dbConnect";
import Item from "@models/Item";
import { create } from "@lib/crud";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const result = await Item.find();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else if (req.method === "POST") {
    try {
      const result = await create(Item, req.body);
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}

export default withAuthRoute(handler);
