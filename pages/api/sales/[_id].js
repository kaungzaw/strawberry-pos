import { withAuthRoute } from "@lib/withAuth";
import dbConnect from "@lib/dbConnect";
import Item from "@models/Item";
import Sale from "@models/Sale";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { _id } = req.query;
      const foundSale = await Sale.findOne({ _id });
      const itemId = foundSale._doc.itemId;
      const quantity = foundSale._doc.quantity;
      await Sale.deleteOne({ _id });
      await Item.updateOne({ _id: itemId }, { $inc: { quantity: quantity } });
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
