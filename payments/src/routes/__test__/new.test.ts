import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/auth-helper";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@fknsoft/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 when the purchasing an order that does not exist", async () => {
  await request(app).post("/api/payments").set("Cookie", signin()).send({
    token: "asdadad",
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });
  expect(404);
});

it("returns a 401 when the purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app).post("/api/payments").set("Cookie", signin()).send({
    token: "asdadad",
    orderId: order.id,
  });
  expect(401);
});

it("returns 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "asdadad",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stipeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stipeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  expect(stripeCharge).toBeDefined();

  const payment = await Payment.findOne({
    stripeId: stripeCharge?.id,
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
});
