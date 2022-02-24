import { Publisher, Subjects, TicketCreatedEvent } from "@fknsoft/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
