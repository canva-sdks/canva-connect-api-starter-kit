type AsyncJobResponse = {
  job: {
    status: "success" | "in_progress" | "failed";
  };
};

/**
 * Polls an async job at set intervals
 */
export const poll = async <T extends AsyncJobResponse>(
  job: () => Promise<T>,
  opts: {
    /**
     * The initial delay time in milliseconds
     * @default 500
     */
    initialDelayMs?: number;
    /**
     * The factor by which to exponentially increase the delay time in
     * @default 1.6
     */
    increaseFactor?: number;
    /**
     * The maximum delay in between consecutive polls
     * @default 5_000
     */
    maxDelayMs?: number;
  } = {},
): Promise<T> => {
  const {
    initialDelayMs = 500,
    increaseFactor = 1.6,
    maxDelayMs = 10 * 1_000,
  } = opts;

  const exponentialDelay = (n: number) =>
    Math.min(initialDelayMs * Math.pow(increaseFactor, n), maxDelayMs);

  const pollJob = async (attempt = 0): Promise<T> => {
    const delayMs = exponentialDelay(attempt);
    const statusResult = await job();

    const status =
      statusResult.job.status.toLocaleLowerCase() as AsyncJobResponse["job"]["status"];

    switch (status) {
      case "success":
      case "failed":
        return statusResult;
      case "in_progress":
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
        return pollJob(attempt + 1);
      default:
        throw new Error(`Unknown job status ${status}`);
    }
  };

  return pollJob();
};
