import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import httpStatus from "http-status";

import { logger } from "../config/logger";
import { redis } from "../index";
import { getDepositWalletQuery } from "../models/depositWallet.model";
import { getPlayerByIdQuery } from "../models/player.model";
import {
  getTransactionByIdQuery,
  insertTransactionQuery,
} from "../models/transaction.model";
import { ApiError } from "../shared/error/ApiError";

export const createDepositTransaction = async (
  playerId: number,
  amount: number,
) => {
  try {
    const connection = new Connection(
      "https://api.testnet.solana.com",
      "confirmed",
    );

    const player = await getPlayerByIdQuery(playerId);

    if (!player) {
      throw new ApiError("Player not found", httpStatus.NOT_FOUND);
    }

    const balance = await connection.getBalance(
      new PublicKey(player.walletPublicKey),
    );

    if (balance < amount * LAMPORTS_PER_SOL) {
      throw new ApiError(
        "Insufficient balance in player wallet",
        httpStatus.BAD_REQUEST,
      );
    }

    const depositWallet = await getDepositWalletQuery();

    if (!depositWallet) {
      throw new ApiError("Deposit wallet not found", httpStatus.NOT_FOUND);
    }

    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: new PublicKey(player.walletPublicKey),
    });

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(player.walletPublicKey),
        toPubkey: new PublicKey(depositWallet.walletAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    const walletPrivateKeyArray = player.walletPrivateKey
      .split(",")
      .map(Number);

    const playerKeypair = Keypair.fromSecretKey(
      new Uint8Array(walletPrivateKeyArray),
    );

    transaction.sign(playerKeypair);

    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
    );

    const createdTransaction = await insertTransactionQuery({
      playerId,
      amount: amount * LAMPORTS_PER_SOL,
      status: "pending",
      txId: signature,
    });

    if (!createdTransaction) {
      throw new ApiError(
        "Failed to create deposit transaction",
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      id: createdTransaction.id,
      status: "pending",
    };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }

    throw new ApiError(
      e.message || "Failed to create deposit transaction",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getDepositStatus = async (transactionId: string) => {
  try {
    const redisKey = `transaction:${transactionId}`;
    const status = await redis.get(redisKey);

    const actualStatus = status ? JSON.parse(status) : null;

    if (!actualStatus || !actualStatus.status) {
      throw new ApiError(
        "Transaction not found in cache",
        httpStatus.NOT_FOUND,
      );
    }

    return actualStatus.status;
  } catch (e) {
    logger.error(e);
    try {
      const transaction = await getTransactionByIdQuery(Number(transactionId));

      if (!transaction) {
        throw new ApiError("Transaction not found", httpStatus.NOT_FOUND);
      }

      return transaction.status;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error.message || "Failed to get deposit status",
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};
