const sleep = (time: number) => new Promise((_) => setTimeout(_, time))

export const poll = (
  promiseFn: () => Promise<boolean>,
  time: number,
): Promise<null> =>
  promiseFn().then((result) =>
    result ? null : sleep(time).then(() => poll(promiseFn, time)),
  )
