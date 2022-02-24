import { Publisher, Subjects, TicketUpdatedEvent } from "@fknsoft/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
