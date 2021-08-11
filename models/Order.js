const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    id: String,
    user_id:String,
    amount: Number,
    currency: String,
    created_at: Number,
    status: String,
  },
  { versionKey: false }
);

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
