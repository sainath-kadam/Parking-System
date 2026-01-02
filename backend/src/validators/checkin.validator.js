import Joi from 'joi';

export const checkInSchema = Joi.object({
  vehicleNumber: Joi.string().trim().required(),
  vehicleType: Joi.string().trim().required(),

  ratePerHour: Joi.number().positive().required(),
  graceMinutes: Joi.number().min(0).default(0),

  owner: Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().length(10).required()
  }).required(),

  driver: Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.string().length(10).required()
  }).required()
});
