import { Router } from "express";

import { playerController } from "../../controllers";
import { validateRequestBody } from "../../middlewares/requestValidation";
import { FundPlayerWalletSchema } from "../../shared/joi/player.schema";

export const playerRoute = Router();

playerRoute.route("/").get(playerController.getPlayers);
playerRoute
  .route("/fund-wallet")
  .post(
    validateRequestBody(FundPlayerWalletSchema),
    playerController.fundPlayerWallet,
  );
playerRoute.route("/:playerId/balance").get(playerController.getPlayerBalance);

/**
 * @swagger
 * /api/player/:
 *   get:
 *     summary: Get all players
 *     tags:
 *       - Players
 *     responses:
 *       200:
 *         description: A list of players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/player/fund-wallet:
 *   post:
 *     summary: Fund a player's wallet
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FundPlayerWalletRequest'
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FundPlayerWalletResponse'
 *       400:
 *         description: Bad request
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/player/{playerId}/balance:
 *   get:
 *     summary: Get a player's balance
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the player
 *     responses:
 *       200:
 *         description: Player balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerBalance'
 *       404:
 *         description: Player not found
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
