import { Publisher, OrderCreatedEvent, Subjects } from "@fknsoft/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
