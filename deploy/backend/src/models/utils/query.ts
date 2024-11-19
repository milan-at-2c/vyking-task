

import { DBError } from "../../shared/error/DBError";

import { logger } from "./../../config/logger";
import {pool} from "../../index";
import {PoolConnection, RowDataPacket} from "mysql2/promise";

export const callQuery = async <T>(
  sqlQuery: string,
  queryValues: any[],
  getAll: boolean = false,
): Promise<T> => {
  let client: PoolConnection | undefined;
  try {
      client = await  pool.getConnection();
      await client.connect();

    const [result] = await client.execute<RowDataPacket[]>(
      sqlQuery,
      queryValues,
    );

    return getAll ? (result as T) : (result[0] as T);
  } catch (error) {
    logger.error(error);
    throw new DBError(error);
  } finally {
    if (client && "release" in client) {
      client.release();
    }
  }
};
