import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
  const user = signin();
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Concert",
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("fetches the order of different user error", async () => {
  const user = signin();
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Concert",
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signin())
    .send()
    .expect(401);
});
