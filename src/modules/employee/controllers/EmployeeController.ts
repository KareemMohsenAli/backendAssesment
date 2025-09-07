import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { validate, validateQuery, employeeValidation } from '../../../shared/validation/validation';
import { ExportService } from '../../../utils/export/ExportService';
import logger from '../../../shared/logger/logger';

export class EmployeeController {
  public static createEmployee = [
    validate(employeeValidation.create),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        console.log(req.body);
        const employee = await EmployeeService.createEmployee(req.body);
        
        res.status(201).json({
          success: true,
          message: 'Employee created successfully',
          data: employee,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public static getEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employeeId = parseInt(id, 10);

      if (isNaN(employeeId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      const employee = await EmployeeService.getEmployeeById(employeeId);
      
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
        return;
      }

      res.json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getAllEmployees = [
    validateQuery(employeeValidation.query),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { page, limit, departmentId, search } = req.query;
        
        const result = await EmployeeService.getAllEmployees({
          page: page as unknown as number,
          limit: limit as unknown as number,
          departmentId: departmentId as unknown as number,
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

  public static updateEmployee = [
    validate(employeeValidation.update),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params;
        const employeeId = parseInt(id, 10);

        if (isNaN(employeeId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid employee ID',
          });
          return;
        }

        const employee = await EmployeeService.updateEmployee(employeeId, req.body);
        
        if (!employee) {
          res.status(404).json({
            success: false,
            message: 'Employee not found',
          });
          return;
        }

        res.json({
          success: true,
          message: 'Employee updated successfully',
          data: employee,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public static deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employeeId = parseInt(id, 10);

      if (isNaN(employeeId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      const deleted = await EmployeeService.deleteEmployee(employeeId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public static getEmployeesByDepartment = [
    validateQuery(employeeValidation.query),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { departmentId } = req.params;
        const deptId = parseInt(departmentId, 10);
        const { page, limit, search } = req.query;

        if (isNaN(deptId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid department ID',
          });
          return;
        }

        const result = await EmployeeService.getEmployeesByDepartment(deptId, {
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

  public static getEmployeeStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await EmployeeService.getEmployeeStatistics();

      res.json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  };

  public static exportEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { format = 'csv', departmentId } = req.query;
      const deptId = departmentId ? parseInt(departmentId as string, 10) : undefined;

      if (format !== 'csv' && format !== 'pdf') {
        res.status(400).json({
          success: false,
          message: 'Invalid export format. Supported formats: csv, pdf',
        });
        return;
      }

      // Get employees data
      const employeesResult = await EmployeeService.getAllEmployees({
        departmentId: deptId,
        limit: 10000, // Large limit for export
      });

      if (employeesResult.data.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No employees found to export',
        });
        return;
      }

      // Export employees
      const filePath = await ExportService.exportEmployees(employeesResult.data, {
        format: format as 'csv' | 'pdf',
        departmentId: deptId,
      });

      const filename = filePath.split('/').pop() || 'employees-export';
      const mimeType = format === 'csv' ? 'text/csv' : 'application/pdf';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      res.download(filePath, filename, (err) => {
        if (err) {
          logger.error('Error downloading file', { error: err.message, filePath });
        } else {
          // Clean up the file after download
          setTimeout(() => {
            ExportService.deleteExportFile(filePath);
          }, 5000);
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
