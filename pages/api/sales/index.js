import { withAuthRoute } from "lib/withAuth";
import dbConnect from "lib/dbConnect";
import Item from "@models/Item";
import Sale from "@models/Sale";
import { create } from "lib/crud";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const result = await Sale.find();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else if (req.method === "POST") {
    try {
      const { itemId, quantity } = req.body;
      await create(Sale, req.body);
      await Item.updateOne({ _id: itemId }, { $inc: { quantity: -quantity } });
      res.status(201).end();
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}

export default withAuthRoute(handler);
