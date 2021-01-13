import { Queue } from '@crcr/utils';
import { EventEmitter } from 'events';

type JobType = {
  id: number,
  callback: Function,
  data?: any[]
}

const LIMITS = {
  GROUP: 60 * 1000 / 20,  // 20 msg per minute in same group
  CHAT: 1000,             // 1 msg per second in same chat
  ALL: 1000 / 30          // 30 msg per second in any chat
}

export default class TBL {
  static EVENTS = {
    PUSH: 'flow:afterpush',
    DONE: 'flow:afterjobdone'
  };
  _busy: boolean = false; 
  _cache: {[key in number]: number} = { 0: 0 }; // 0 - last request time
  _queue: Queue = new Queue();
  _event: EventEmitter = new EventEmitter();

  constructor() {
    this._registerEvents();
  }

  _registerEvents() {
    this._event.on(TBL.EVENTS.PUSH, this._afterPush.bind(this));
    this._event.on(TBL.EVENTS.DONE, this._afterDone.bind(this));
  }

  push(id: number, callback: Function, ...data: any[]) {
    this._queue.push({id, callback, data});
    this._event.emit(TBL.EVENTS.PUSH);
  }

  _afterPush() {
    if (!this._busy && !this._queue.isEmpty()) {
      this._busy = true;
      const cacheTimeDiff = Date.now() - this._cache[0];
      if (cacheTimeDiff > LIMITS.ALL) {
        this._checkJobLimits()
      } else {
        setTimeout(() => this._checkJobLimits(), LIMITS.ALL - cacheTimeDiff);
      }
    }
  }

  _afterDone() {
    this._busy = false;
  }

  _jobCallback = (job: JobType) => {
    const now = Date.now();
    this._cache[job.id] = now;
    this._cache[0] = now;
    this._event.emit(TBL.EVENTS.DONE);
    this._event.emit(TBL.EVENTS.PUSH);
    job.callback(job.data);
  }

  _checkJobLimits = () => {
    const job = (this._queue.peek()?.value as JobType);
    const curLimit = this.isGroup(job.id) ? LIMITS.GROUP : LIMITS.CHAT;
    if (typeof this._cache[job.id] !== 'undefined') {
      const jobTimeDiff = Date.now() - curLimit
      if (this._cache[job.id] < jobTimeDiff) {
        this._jobCallback((this._queue.pull()!.value as JobType));
      } else {
        if (this._queue.size > 1) {
          this._queue.push(this._queue.pull()!.value);
          this._event.emit(TBL.EVENTS.DONE);
          setTimeout(() => this._event.emit(TBL.EVENTS.PUSH), LIMITS.ALL);
        } else {
          this._event.emit(TBL.EVENTS.DONE);
          setTimeout(() => this._event.emit(TBL.EVENTS.PUSH), this._cache[job.id] - jobTimeDiff);
        }
      }
    } else {
      this._jobCallback((this._queue.pull()!.value as JobType));
    }
  }

  isGroup = (id: number) => id < 0;

}