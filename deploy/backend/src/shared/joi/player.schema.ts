import Joi from "joi";

export const FundPlayerWalletSchema = Joi.object({
  playerId: Joi.number().min(1).required(),
});
