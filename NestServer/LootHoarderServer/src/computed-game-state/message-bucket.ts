import { Subscription, Subject } from "rxjs";

export class EventStream<T> {
  private onEvent: Subject<T>;
  private currentEventBucket?: T[];
  public constructor() {
    this.onEvent = new Subject();
  }

  public subscribe(eventHandler: (event: T) => void): Subscription {
    return this.onEvent.subscribe(eventHandler);
  }

  public next(event: T): void {
    if(this.currentEventBucket) {
      this.currentEventBucket.push(event);
    } else {
      this.onEvent.next(event);
    }
  }

  public setUpNewEventBucket(): void {
    if (this.currentEventBucket) {
      throw Error ('Cannot have two buckets for the same event stream.');
    }
    this.currentEventBucket = [];
  }

  public flushEventBucket(): T[] {
    if (!this.currentEventBucket) {
      throw Error ('No bucket to flush.');
    }
    const events = this.currentEventBucket;
    this.currentEventBucket = undefined;
    return events;
  }
}