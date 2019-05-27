const parallel = async <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = [];
  let currentIndex = 0;

  await Promise.all(
    Array.from({ length: concurrency }).map(async () => {
      while (true) {
        const index = currentIndex++;
        const promise = promises[index];
        if (!promise) {
          return;
        }
        results[index] = await promise();
      }
    })
  );

  return results;
};

const serializedParallel = async <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = [];
  let currentIndex = 0;

  while (true) {
    const chunks = promises.slice(currentIndex, currentIndex + concurrency);
    if (chunks.length === 0) {
      break;
    }
    Array.prototype.push.apply(
      results,
      await Promise.all(chunks.map(c => c()))
    );
    currentIndex += concurrency;
  }

  return results;
};

const parallelWithCallback = async <T, U>(
  values: U[],
  callback: (value: U) => Promise<T>,
  concurrency: number
): Promise<T[]> => {
  const promises = values.map(v => callback.bind(null, v));
  return await parallel(promises, concurrency);
};

export { parallel, serializedParallel, parallelWithCallback };
