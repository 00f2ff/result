import { Result, settle, settleAll } from "result";

describe("settle", () => {
  it("returns a fulfilled result", async () => {
    const str = "hello";
    const promise = Promise.resolve(str);
    const result: Result<string, Error> = await settle(promise);
    expect(result.isFulfilled()).toBe(true);
    if (result.isFulfilled()) {
      expect(result.value).toBe(str);
    }
  });

  it("returns a fulfilled result of null", async () => {
    const promise = Promise.resolve(null);
    const result: Result<null, Error> = await settle(promise);
    expect(result.isFulfilled()).toBe(true);
    expect(result.isRejected()).toBe(false);
    if (result.isFulfilled()) {
      expect(result.value).toBe(null);
    }
  });

  it("returns a rejected result", async () => {
    const exception = new Error("oh no");
    const promise = Promise.reject(exception);
    const result: Result<string, Error> = await settle(promise);
    expect(result.isRejected()).toBe(true);
    expect(result.isFulfilled()).toBe(false);
    if (result.isRejected()) {
      expect(result.error).toBe(exception);
    }
  });
});

describe("settleAll", () => {
  it("returns a tuple of Fulfilled and Rejected", async () => {
    const resolvingValues = [true, true];
    const resolvingPromises = resolvingValues.map((v) => Promise.resolve(v));
    const rejectingReasons = [new Error("oh no"), new Error("ugh")];
    const rejectingPromises = rejectingReasons.map((r) => Promise.reject(r));

    const [fulfilled, rejected] = await settleAll<boolean, Error>([...resolvingPromises, ...rejectingPromises]);

    expect(fulfilled.length).toBe(resolvingValues.length);
    expect(fulfilled.map((r) => r.value).sort()).toStrictEqual(resolvingValues.sort());

    expect(rejected.length).toBe(rejectingReasons.length);
    expect(rejected.map((r) => r.error).sort()).toStrictEqual(rejectingReasons.sort());
  });

  it("returns a tuple of Fulfilled and Rejected with union types", async () => {
    const resolvingValues = [true, "ok"];
    const resolvingPromises = resolvingValues.map((v) => Promise.resolve(v));
    const rejectingReasons = [new Error("oh no"), false];
    const rejectingPromises = rejectingReasons.map((r) => Promise.reject(r));

    const [fulfilled, rejected] = await settleAll<boolean | string, boolean | Error>([...resolvingPromises, ...rejectingPromises]);

    expect(fulfilled.length).toBe(resolvingValues.length);
    expect(fulfilled.map((r) => r.value).sort()).toStrictEqual(resolvingValues.sort());
    expect(fulfilled.map((r) => r.value)).toContain(resolvingValues[0]);
    expect(fulfilled.map((r) => r.value)).toContain(resolvingValues[1]);
    
    expect(rejected.length).toBe(rejectingReasons.length);
    expect(rejected.map((r) => r.error).sort()).toStrictEqual(rejectingReasons.sort());
    expect(rejected.map((r) => r.error)).toContain(rejectingReasons[0]);
    expect(rejected.map((r) => r.error)).toContain(rejectingReasons[1]);
  })
});