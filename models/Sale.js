import mongoose from "mongoose";

const schemaName = "Sale";
const schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
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

export default mongoose.models[schemaName] ||
  mongoose.model(schemaName, schema);
