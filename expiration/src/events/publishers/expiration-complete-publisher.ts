import { Subjects, Publisher, ExpirationCompleteEvent } from "@fknsoft/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
