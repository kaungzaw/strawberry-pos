import mongoose from "mongoose";
import { Sale } from "models";

const schemaName = "Item";
const schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  buy_price: {
    type: Number,
    required: true,
  },
  sell_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

schema.pre("deleteOne", function (next) {
  Sale.deleteMany({ itemId: this._id }, next);
});

export default mongoose.models[schemaName] ||
  mongoose.model(schemaName, schema);
