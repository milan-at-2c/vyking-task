import { callQuery } from "./utils/query";

export type DepositWallet = {
  id: number;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getDepositWalletQuery = async (): Promise<DepositWallet> => {
  const selectSQL = `
  SELECT * FROM DepositWallet;
  `;

  const values: any[] = [];

  return callQuery<DepositWallet>(selectSQL, values, false);
};
