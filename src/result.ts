
interface Common<T, E> {
    isFulfilled(): this is Fulfilled<T, E>

    isRejected(): this is Rejected<T, E>
}

export class Fulfilled<T, E> implements Common<T, E> {
    readonly value: T;

    constructor(readonly result: PromiseFulfilledResult<T>) {
        this.value = result.value;
    }

    isFulfilled(): this is Fulfilled<T, E> {
        return true;
    }

    isRejected(): this is Rejected<T, E> {
        return false;
    }
}

export class Rejected<T, E> implements Common<T, E> {
    readonly error: E;

    constructor(readonly result: PromiseRejectedResult) {
        this.error = result.reason;
    }

    isFulfilled(): this is Fulfilled<T, E> {
        return false;
    }

    isRejected(): this is Rejected<T, E> {
        return true;
    }
}

export type Result<T, E> = Fulfilled<T, E> | Rejected<T, E>

function isPromiseFulfilledResult<T>(promiseSettledResult: PromiseSettledResult<T>): promiseSettledResult is PromiseFulfilledResult<T> {
    return (promiseSettledResult as PromiseFulfilledResult<T>).status === "fulfilled";
}

/**
 * 
 * @type T resolved promise value type
 * @type E rejected promise error type. `Error` is provided as a sensible default
 * @param promises 
 * @returns promise wrapping a tuple of Results. 0 --> Fulfilled, 1 --> Rejected
 */
export async function settleAll<T, E = Error>(promises: Promise<T>[]): Promise<[Fulfilled<T, E>[], Rejected<T, E>[]]> {
  const results: PromiseSettledResult<T>[] = await Promise.allSettled(promises);
  return results.reduce((acc, result) => {
    if (isPromiseFulfilledResult<T>(result)) {
        acc[0] = [...acc[0], new Fulfilled<T, E>(result)]
    } else {
        acc[1] = [...acc[1], new Rejected<T, E>(result)]
    }
    return acc
  }, 
  [Array<Fulfilled<T, E>>(), Array<Rejected<T, E>>()]);
}

/**
 * 
 * @type T resolved promise value type
 * @type E rejected promise error type. `Error` is provided as a sensible default
 * @param promise
 * @returns promise wrapping a result
 */
export async function settle<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    return (await settleAll<T, E>([promise])).flat()[0];
}