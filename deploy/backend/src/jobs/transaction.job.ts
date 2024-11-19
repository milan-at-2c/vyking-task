import { Connection } from "@solana/web3.js";

import { logger } from "../config/logger";
import { redis } from "../index";
import {
  getAllPendingTransactionsQuery,
  updateTransactionStatusQuery,
} from "../models/transaction.model";

export const checkTransactionsHistory = async () => {
  logger.info("[CRON] Starting transaction status check...");

  let connection: Connection;
  try {
    const transactions = await getAllPendingTransactionsQuery();
    if (transactions.length === 0) {
      logger.info("[CRON] No pending transactions found.");
      return;
    }

    connection = new Connection("https://api.testnet.solana.com", "confirmed");

    const promises = transactions.map(async (transaction) => {
      const { id, txId, status: currentStatus } = transaction;
      const redisKey = `transaction:${id}`;

      logger.info(`[CRON] Checking transaction status for txId: ${txId}`);

      try {
        const statusResponse = await connection.getSignatureStatus(txId, {
          searchTransactionHistory: true,
        });

        const newStatus =
          statusResponse?.value?.confirmationStatus || "pending";

        if (statusResponse?.value?.err) {
          logger.error(
            new Error(
              `[CRON] Transaction failed for txId: ${txId}. Error: ${statusResponse.value.err}`,
            ),
          );
          await redis.set(
            redisKey,
            JSON.stringify({ status: "failed" }),
            "EX",
            600,
          );
          await updateTransactionStatusQuery(id, "failed");
          return;
        }

        if (newStatus !== currentStatus) {
          logger.info(
            `[CRON] Transaction status updated for txId: ${txId} from ${currentStatus} to ${newStatus}`,
          );
          await redis.set(redisKey, JSON.stringify({ status: newStatus }));
          await updateTransactionStatusQuery(id, newStatus);
        } else {
          logger.info(
            `[CRON] Transaction status for txId: ${txId} remains ${currentStatus}`,
          );
          await redis.set(
            redisKey,
            JSON.stringify({ status: currentStatus }),
            "EX",
            600,
          );
        }
      } catch (err) {
        logger.error(
          new Error(
            `[CRON] Failed to check status for txId: ${txId}. Error: ${err.message}`,
          ),
        );
      }
    });

    await Promise.all(promises);

    logger.info("[CRON] Completed transaction status check.");
  } catch (err) {
    logger.error(
      new Error(
        `[CRON] Unexpected error during transaction status check: ${err.message}`,
      ),
    );
  }
};
