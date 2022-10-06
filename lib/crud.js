import mongoose from "mongoose";

export const create = (model, data) => {
  const _id = mongoose.Types.ObjectId().toHexString();
  return model.create({ _id, ...data });
};
