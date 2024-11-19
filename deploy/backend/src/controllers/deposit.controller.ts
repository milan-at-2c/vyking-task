import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../shared/utils/CatchAsync";

import { depositService } from "./../service";

export const createDeposit = catchAsync(async (req: Request, res: Response) => {
  const { playerId, amount } = req.body;

  const transactionInfo = await depositService.createDepositTransaction(
    playerId,
    amount,
  );

  res.status(httpStatus.OK).send({
    success: true,
    content: transactionInfo,
  });
});

export const getDepositStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;

    if (!Number.isInteger(Number(transactionId))) {
      res.status(400).send({
        success: false,
        message: "Invalid id. It must be an integer.",
      });

      return;
    }

    const status = await depositService.getDepositStatus(transactionId);

    res.status(httpStatus.OK).send({
      success: true,
      content: {
        status,
      },
    });
  },
);
