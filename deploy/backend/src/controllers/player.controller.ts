import { Request, Response } from "express";
import httpStatus from "http-status";

import { playerService } from "../service";
import { catchAsync } from "../shared/utils/CatchAsync";

export const getPlayers = catchAsync(async (_req: Request, res: Response) => {
  const players = await playerService.getPlayers();

  res.status(httpStatus.OK).send({
    success: true,
    content: players,
  });
});

export const fundPlayerWallet = catchAsync(
  async (req: Request, res: Response) => {
    const { playerId } = req.body;

    await playerService.fundWallet(playerId);

    res.status(httpStatus.OK).send({
      success: true,
      message: "Wallet funded successfully",
    });
  },
);

export const getPlayerBalance = catchAsync(
  async (req: Request, res: Response) => {
    const { playerId } = req.params;

    const balance = await playerService.getPlayerBalance(Number(playerId));

    res.status(httpStatus.OK).send({
      success: true,
      content: {
        balance,
      },
    });
  },
);
