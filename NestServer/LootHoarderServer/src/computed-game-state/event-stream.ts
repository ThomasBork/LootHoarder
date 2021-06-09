import { Subscription, Subject } from "rxjs";

export class EventStream<T> {
  private onEvent: Subject<T>;
  private currentEventBucket?: T[];
  private eventBuckets: T[][];
  public constructor() {
    this.onEvent = new Subject();
    this.eventBuckets = [];
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
    const newEventBucket: T[] = [];
    this.eventBuckets.push(newEventBucket);
    this.currentEventBucket = newEventBucket;
  }

  public flushEventBucket(): T[] {
    if (!this.currentEventBucket) {
      throw Error ('No bucket to flush.');
    }
    const events = this.currentEventBucket;
    this.eventBuckets = this.eventBuckets.filter(b => b !== this.currentEventBucket);
    if (this.eventBuckets.length > 0) {
      this.currentEventBucket = this.eventBuckets[this.eventBuckets.length - 1];
    } else {
      this.currentEventBucket = undefined;
    }
    return events;
  }
}