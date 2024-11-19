import { CronJob } from "cron";

import { checkTransactionsHistory } from "./transaction.job";

export const CheckTransactionStatusJob = CronJob.from({
  cronTime: "0 */1 * * * *",
  onTick: async () => {
    await checkTransactionsHistory();
  },
});

export const startCronJobs = () => {
  CheckTransactionStatusJob.start();
};
