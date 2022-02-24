import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/auth-helper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("Marks an order as cancelled", async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send();
  //.expect(204);

  //const updatedOrder = await Order.findById(order.id);
  //expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  console.log("Fetched Order: ", fetchedOrder);
  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send();

  console.log("Fetched Order: ", fetchedOrder);
  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
