import { callQuery } from "./utils/query";

export type Transaction = {
  id: number;
  playerId: number;
  amount: number;
  status: string;
  txId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateTransaction = {
  playerId: number;
  amount: number;
  status: string;
  txId: string;
};

export const insertTransactionQuery = async (
  transaction: CreateTransaction,
) => {
  const insertSQL = `
    INSERT INTO Transaction (playerId, amount, status, txId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

  const values = [
    transaction.playerId,
    transaction.amount,
    transaction.status,
    transaction.txId,
  ];

  await callQuery(insertSQL, values);

  const fetchSQL = `
    SELECT * FROM Transaction
    WHERE id = LAST_INSERT_ID();
  `;

  return callQuery<Transaction>(fetchSQL, []);
};

export const getTransactionByIdQuery = async (
  id: number,
): Promise<Transaction> => {
  const selectSQL = `
    SELECT * FROM Transaction WHERE id = ?
    `;

  const values = [id];

  return callQuery(selectSQL, values);
};

export const getAllPendingTransactionsQuery = async (): Promise<
  Transaction[]
> => {
  const selectSQL = `
    SELECT * FROM Transaction WHERE status = 'pending'
    `;

  const values: any[] = [];

  return callQuery<Transaction[]>(selectSQL, values, true);
};

export const updateTransactionStatusQuery = async (
  id: number,
  status: string,
) => {
  const updateSQL = `
    UPDATE Transaction SET status = ?, updatedAt = NOW() WHERE id = ?
    `;

  const values = [status, id];

  return callQuery(updateSQL, values);
};
