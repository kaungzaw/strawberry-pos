import mongoose from "mongoose";

const schemaName = "DailyReport";
const schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

export default mongoose.models[schemaName] ||
  mongoose.model(schemaName, schema);
