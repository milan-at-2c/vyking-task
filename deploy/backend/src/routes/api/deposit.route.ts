import { Router } from "express";

import { validateRequestBody } from "../../middlewares/requestValidation";
import { CreateDepositSchema } from "../../shared/joi/deposit.schema";

import { depositController } from "./../../controllers";

export const depositRoute = Router();

depositRoute
  .route("/")
  .post(
    validateRequestBody(CreateDepositSchema),
    depositController.createDeposit,
  );

depositRoute.route("/:transactionId").get(depositController.getDepositStatus);

/**
 * @swagger
 * /api/deposit/:
 *   post:
 *     summary: Create a deposit transaction
 *     tags:
 *       - Deposit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepositRequest'
 *     responses:
 *       200:
 *         description: Deposit transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateDepositResponse'
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
 * /api/deposit/{transactionId}:
 *   get:
 *     summary: Get the status of a deposit transaction
 *     tags:
 *       - Deposit
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction
 *     responses:
 *       200:
 *         description: Deposit transaction status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepositStatusResponse'
 *       404:
 *         description: Transaction not found
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
