import Joi from "joi";

export const CreateDepositSchema = Joi.object({
  playerId: Joi.number().min(1).required(),
  amount: Joi.number()
    .custom((value, helpers) => {
      if (value >= Number.MIN_VALUE) {
        return value;
      }
      return helpers.error("Amount must be greater than 0");
    })
    .required(),
});
