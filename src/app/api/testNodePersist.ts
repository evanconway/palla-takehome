import storage from "node-persist";

const keys = {
  counter: "counter",
};

export const storageGetFuncs = async () => {
  // initialize
  await storage.init();
  const counter = await storage.getItem(keys.counter);
  if (counter === undefined) {
    console.log("counter does not exist, setting up");
    const result = await storage.setItem(keys.counter, 0);
    console.log(result);
  }

  const getCounter = async () => {
    const c = await storage.getItem(keys.counter);
    console.log("gettingCounter:", c);
    return await c;
  };

  const incrementCounter = async () => {
    console.log("increasing counter");
    const c = await storage.getItem(keys.counter);
    await storage.setItem(keys.counter, c + 1);
  };

  return { getCounter, incrementCounter };
};
