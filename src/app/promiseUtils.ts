export async function runForAtLeast<T>(
  toRun: () => Promise<T>,
  timer: number
): Promise<T> {
  const atLeastPromise = sleepFor(timer);
  return new Promise((resolve, reject) => {
    Promise.allSettled([toRun(), atLeastPromise]).then((result) => {
      if (result[0].status === 'fulfilled') {
        resolve(result[0].value);
      }
      reject(result[0].status);
    });
  });
}

async function sleepFor(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('sleepFor');
    }, timeout);
  });
}
