import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/DepartmentService';
import { validate, validateQuery, departmentValidation } from '../../../shared/validation/validation';
import logger from '../../../shared/logger/logger';

export class DepartmentController {
  public static createDepartment = [
    validate(departmentValidation.create),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const department = await DepartmentService.createDepartment(req.body);
        
        res.status(201).json({
          success: true,
          message: 'Department created successfully',
          data: department,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public static getDepartmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id, 10);

      if (isNaN(departmentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid department ID',
        });
        return;
      }

      const department = await DepartmentService.getDepartmentById(departmentId);
      
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        });
        return;
      }

      res.json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getAllDepartments = [
    validateQuery(departmentValidation.query),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { page, limit, search } = req.query;
        
        const result = await DepartmentService.getAllDepartments({
          page: page as unknown as number,
          limit: limit as unknown as number,
          search: search as string,
        });

        res.json({
          success: true,
          data: result.data,
          pagination: result.pagination,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public static updateDepartment = [
    validate(departmentValidation.update),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;
        const departmentId = parseInt(id, 10);

        if (isNaN(departmentId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid department ID',
          });
          return;
        }

        const department = await DepartmentService.updateDepartment(departmentId, req.body);
        
        if (!department) {
          res.status(404).json({
            success: false,
            message: 'Department not found',
          });
          return;
        }

        res.json({
          success: true,
          message: 'Department updated successfully',
          data: department,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public static deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id, 10);

      if (isNaN(departmentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid department ID',
        });
        return;
      }

      const deleted = await DepartmentService.deleteDepartment(departmentId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Department deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public static getDepartmentWithEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id, 10);

      if (isNaN(departmentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid department ID',
        });
        return;
      }

      const department = await DepartmentService.getDepartmentWithEmployees(departmentId);
      
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found',
        });
        return;
      }

      res.json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  };
}
