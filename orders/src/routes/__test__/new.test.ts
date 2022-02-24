import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/auth-helper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "./../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdadada",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserved a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  console.log("Created Order: ", order.body);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
