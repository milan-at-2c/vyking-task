import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import httpStatus from "http-status";

import {
  getAllPlayersQuery,
  getPlayerByIdQuery,
  Player,
} from "../models/player.model";
import { ApiError } from "../shared/error/ApiError";

export const getPlayers = async (): Promise<Player[]> => getAllPlayersQuery();

export const fundWallet = async (playerId: number) => {
  const connection = new Connection(
    "https://api.testnet.solana.com",
    "confirmed",
  );

  const player = await getPlayerByIdQuery(playerId);

  if (!player) {
    throw new ApiError("Player not found", httpStatus.NOT_FOUND);
  }

  const airdropSignature = await connection.requestAirdrop(
    new PublicKey(player.walletPublicKey),
    2.5 * LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature, "confirmed");
  console.log(
    `Wallet funded successfully. Airdrop signature: ${airdropSignature}`,
  );
};

export const getPlayerBalance = async (playerId: number): Promise<number> => {
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

  return balance;
};
