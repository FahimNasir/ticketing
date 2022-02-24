import { Publisher, Subjects, PaymentCreatedEvent } from "@fknsoft/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
