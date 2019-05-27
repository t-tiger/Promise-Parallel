# Promise Paralleled

`Promise Paralleled` is a library aimed at specifying the number of concurrency when executing multiple promise tasks.

Preset function of `Promise.all` is available to handle multiple promise tasks. However, this will start all tasks at once and not allowing to modulate the concurrency.

There are cases to proceed jobs in parallel, such as requesting external APIs, but it should not be a massive parallel number. For these situations, this library can be conveniently used to easily adjust the number of concurrency.

# Feature

This library is very simple and light, not depending on any external libraries (Only 55 lines of TypeScript). Specializes in processing multiple promise tasks with preferred concurrency.

# Install

You can install package via npm command.

```bash
npm install promise-paralleled --save
```

# Usage

There are three functions to handle promise concurrently.

## parallel(promises, concurrency)

```typescript
function parallel<T>(promises: (() => Promise<T>)[], concurrency: number): Promise<T[]>
```

Pass the array of function returning promise as the first argument, the number of concurrency as the second argument.

In order to provide a unified interface, first argument must be a function without arguments. But there are cases promise task must have some arguments, please refer to the following example at that time.

```typescript
import { parallel } from 'promise-paralleled'

const timeoutExecution = (time: number): Promise<number> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};

const promises = [1, 2, 3, 4, 5, 6].map(i => timeoutExecution.bind(null, i * 100));
const concurrency = 2;

parallel(promises, concurrency);
```

As above, by using `bind`, set arguments in advance and convert it into a function object before using this.

Typed definition may loose when using `bind`, but TypeScript version 3.2 or later allows strict type checking.

## parallelWithCallback(values, callback, concurrency)

```typescript
function parallelWithCallback<T, U>(values: U, callback: (value: U) => Promise<T>, concurrency: number): Promise<T[]>
```

It is possible to specify a callback function with some arguments without using `bind`. Array of values are passed as first argument is received by the callback function of second argument, and the number of concurrency is set for third argument.

Example is as follows.

```typescript
import { parallelWithCallback } from 'promise-paralleld'

const values = [1, 2, 3, 4, 5, 6];

parallelWithCallback(values, (val: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val)
    }, val * 100);
  });
}, 2);
```

## serializedParallel(promises, concurrency)

```typescript
function serializedParallel<T>(promises: (() => Promise<T>)[], concurrency: number): Promise<T[]>
```

Usage is exactly the same as `parallel`, but the behavior differs in the following points.

`parallel` executes new jobs one after another as soon as the specified processing space is free. For example, if one job takes 1000ms and other jobs take 200ms, five other jobs will be completed while the first job is completed.

On the other hand, `serializedParallel` doesn't execute next job until the specified number of jobs are completed. In the previous case, when short job is completed, next jobs are not started until the first job finished.

# License

This project is under Apache 2.0 License. See the LICENSE file for the full license text.


