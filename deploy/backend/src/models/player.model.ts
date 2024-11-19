import { callQuery } from "./utils/query";

export type Player = {
  id: number;
  name: string;
  walletAddress: string;
  walletPublicKey: string;
  walletPrivateKey: string;
};

export const getAllPlayersQuery = async (): Promise<Player[]> => {
  const selectSQL = `
    SELECT * FROM Player;
  `;

  const values: any[] = [];

  return callQuery<Player[]>(selectSQL, values, true);
};

export const getPlayerByIdQuery = async (id: number): Promise<Player> => {
  const selectSQL = `
    SELECT * FROM Player WHERE id = ?;
  `;

  const values: number[] = [id];

  return callQuery<Player>(selectSQL, values, false);
};
