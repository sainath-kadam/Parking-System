import Joi from 'joi';

export const checkOutSchema = Joi.object({
  vehicleNumber: Joi.string().trim().required(),

  finalAmount: Joi.number().min(0).optional(),

  driver: Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().length(10).required()
  }).optional()
});
