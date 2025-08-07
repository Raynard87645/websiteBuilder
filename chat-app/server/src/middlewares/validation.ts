import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    next();
  };
};

// Validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const createRoomSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid('private', 'group').required(),
  participants: Joi.array().items(Joi.number().integer().positive()).optional()
});

export const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});