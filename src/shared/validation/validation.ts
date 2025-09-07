import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';

// Validation schemas
export const employeeValidation = {
  create: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    email: z.string().email('Invalid email format'),
    departmentId: z.number().int().positive('Department ID must be a positive integer'),
    salary: z.number().positive('Salary must be a positive number'),
  }),
  update: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    departmentId: z.number().int().positive('Department ID must be a positive integer').optional(),
    salary: z.number().positive('Salary must be a positive number').optional(),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    departmentId: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
  }),
};

export const departmentValidation = {
  create: z.object({
    name: z.string().min(2, 'Department name must be at least 2 characters').max(100, 'Department name must not exceed 100 characters'),
  }),
  update: z.object({
    name: z.string().min(2, 'Department name must be at least 2 characters').max(100, 'Department name must not exceed 100 characters').optional(),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
  }),
};

// Global validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        logger.warn('Validation error', { 
          errors: errorMessages, 
          body: req.body,
          url: req.url,
          method: req.method 
        });
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      
      logger.error('Validation middleware error', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

// Query validation middleware
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        logger.warn('Query validation error', { 
          errors: errorMessages, 
          query: req.query,
          url: req.url,
          method: req.method 
        });
        
        res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: errorMessages,
        });
        return;
      }
      
      logger.error('Query validation middleware error', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};
