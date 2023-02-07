# Result

Safely handle asynchronous errors with `Result`. Inspired by [neverthrow](https://github.com/supermacro/neverthrow)'s core `ResultAsync` types, but is intended for use in sequential imperative statements using `async/await`, rather than functional pipelining.

Akin to Rust's [`std::result`](https://doc.rust-lang.org/std/result/) and Scala's [`scala.util.Either`](https://www.scala-lang.org/api/2.13.6/scala/util/Either.html). Uses ES2020's [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) under the hood and mostly follows its naming convention. 

## Installation

```
npm i @00f2ff/result
```

## API

`E` defaults to `Error`.

### `settle<T, E>`

Settles a promise into `Result<T, E>` that can be narrowed to `Fulfilled<T, E>` or `Rejected<T, E>`.

```ts
const result: Result<boolean, Error> = await settle(Promise.resolve(true));
if (result.isFulfilled()) { 
  console.log(result.value); // true
}
```

```ts
const result: Result<boolean, Error> = await settle(Promise.reject(new Error("oh no"));
if (result.isRejected()) { 
  console.log(result.error); // Error("oh no")
}
```

### `settleAll<T, E>`

Settles an array of promises into a tuple of `[Fulfilled<T, E>[], Rejected<T, E>[]]`. 

```ts
const resolvingPromises = [Promise.resolve(true), Promise.resolve("hello")];
const rejectingPromises = [Promise.reject(new Error("oh no"), Promise.reject(new DbError("ruh roh"))];

const [fulfilled, rejected] = await settleAll<boolean | string, Error | DbError>([...resolvingPromises, ...rejectingPromises]);
```

## Test

```
npm run test
```
