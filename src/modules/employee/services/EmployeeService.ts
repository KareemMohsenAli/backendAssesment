import { Employee } from '../models/Employee';
import { Department } from '../../department/models/Department';
import { Pagination } from '../../../utils/pagination/Pagination';
import { PaginationResult } from '../../../utils/pagination/Pagination';
import logger from '../../../shared/logger/logger';
import { createError } from '../../../shared/error/errorHandler';

export interface CreateEmployeeData {
  name: string;
  email: string;
  departmentId: number;
  salary: number;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  departmentId?: number;
  salary?: number;
}

export interface EmployeeQueryOptions {
  page?: number;
  limit?: number;
  departmentId?: number;
  search?: string;
}

export class EmployeeService {
  public static async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    try {
      logger.info('Creating employee', { data });

      // Check if department exists
      const department = await Department.findByPk(data.departmentId);
      if (!department) {
        throw createError('Department not found', 404);
      }

      const employee = await Employee.create(data);
      
      // Fetch the employee with department information
      const employeeWithDepartment = await Employee.findByPk(employee.id, {
        include: [
          {
            association: 'Department',
            required: false,
          },
        ],
      });
      
      logger.info('Employee created successfully', { 
        employeeId: employee.id,
        employeeName: employee.name,
        departmentId: data.departmentId
      });

      return employeeWithDepartment!;
    } catch (error: any) {
      logger.error('Error creating employee', { error: error.message, data });
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Employee with this email already exists', 409);
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw createError('Invalid department reference', 400);
      }
      
      throw error;
    }
  }

  public static async getEmployeeById(id: number): Promise<Employee | null> {
    try {
      logger.info('Fetching employee by ID', { employeeId: id });

      const employee = await Employee.findByPk(id, {
        include: [
          {
            association: 'Department',
            required: false,
          },
        ],
      });
      
      if (!employee) {
        logger.warn('Employee not found', { employeeId: id });
        return null;
      }

      return employee;
    } catch (error: any) {
      logger.error('Error fetching employee by ID', { error: error.message, employeeId: id });
      throw createError('Failed to fetch employee', 500);
    }
  }

  public static async getAllEmployees(options: EmployeeQueryOptions = {}): Promise<PaginationResult<Employee>> {
    try {
      const { page = 1, limit = 10, departmentId, search } = options;
      const { page: validatedPage, limit: validatedLimit } = Pagination.validatePaginationParams(page, limit);
      
      logger.info('Fetching employees', { page: validatedPage, limit: validatedLimit, departmentId, search });

      const offset = Pagination.calculateOffset(validatedPage, validatedLimit);
      
      const whereClause: any = {};
      if (departmentId) {
        whereClause.departmentId = departmentId;
      }
      if (search) {
        whereClause[require('sequelize').Op.or] = [
          { name: { [require('sequelize').Op.like]: `%${search}%` } },
          { email: { [require('sequelize').Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Employee.findAndCountAll({
        where: whereClause,
        include: [
          {
            association: 'Department',
            required: false,
          },
        ],
        limit: validatedLimit,
        offset,
        order: [['name', 'ASC']],
      });

      const result = Pagination.createPaginationResult(rows, {
        page: validatedPage,
        limit: validatedLimit,
        total: count,
      });

      logger.info('Employees fetched successfully', { 
        total: count, 
        returned: rows.length,
        page: validatedPage,
        departmentId,
        search
      });

      return result;
    } catch (error: any) {
      logger.error('Error fetching employees', { error: error.message, options });
      throw createError('Failed to fetch employees', 500);
    }
  }

  public static async updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee | null> {
    try {
      logger.info('Updating employee', { employeeId: id, data });

      const employee = await Employee.findByPk(id);
      if (!employee) {
        logger.warn('Employee not found for update', { employeeId: id });
        return null;
      }

      // Check if department exists (if departmentId is being updated)
      if (data.departmentId) {
        const department = await Department.findByPk(data.departmentId);
        if (!department) {
          throw createError('Department not found', 404);
        }
      }

      await employee.update(data);
      
      // Fetch the updated employee with department information
      const updatedEmployee = await Employee.findByPk(id, {
        include: [
          {
            association: 'Department',
            required: false,
          },
        ],
      });
      
      logger.info('Employee updated successfully', { 
        employeeId: id,
        updatedData: data 
      });

      return updatedEmployee!;
    } catch (error: any) {
      logger.error('Error updating employee', { error: error.message, employeeId: id, data });
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Employee with this email already exists', 409);
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw createError('Invalid department reference', 400);
      }
      
      throw error;
    }
  }

  public static async deleteEmployee(id: number): Promise<boolean> {
    try {
      logger.info('Deleting employee', { employeeId: id });

      const employee = await Employee.findByPk(id);
      if (!employee) {
        logger.warn('Employee not found for deletion', { employeeId: id });
        return false;
      }

      await employee.destroy();
      
      logger.info('Employee deleted successfully', { employeeId: id });
      return true;
    } catch (error: any) {
      logger.error('Error deleting employee', { error: error.message, employeeId: id });
      throw createError('Failed to delete employee', 500);
    }
  }

  public static async getEmployeesByDepartment(departmentId: number, options: EmployeeQueryOptions = {}): Promise<PaginationResult<Employee>> {
    try {
      logger.info('Fetching employees by department', { departmentId, options });

      // Check if department exists
      const department = await Department.findByPk(departmentId);
      if (!department) {
        throw createError('Department not found', 404);
      }

      return this.getAllEmployees({ ...options, departmentId });
    } catch (error: any) {
      logger.error('Error fetching employees by department', { error: error.message, departmentId, options });
      throw error;
    }
  }

  public static async getEmployeeStatistics(): Promise<{
    totalEmployees: number;
    averageSalary: number;
    departmentCounts: Array<{ departmentName: string; count: number }>;
  }> {
    try {
      logger.info('Fetching employee statistics');

      const totalEmployees = await Employee.count();
      
      const averageSalaryResult = await Employee.findOne({
        attributes: [
          [require('sequelize').fn('AVG', require('sequelize').col('salary')), 'averageSalary'],
        ],
        raw: true,
      }) as { averageSalary: string } | null;

      const departmentCounts = await Employee.findAll({
        attributes: [
          [require('sequelize').col('Department.name'), 'departmentName'],
          [require('sequelize').fn('COUNT', require('sequelize').col('Employee.id')), 'count'],
        ],
        include: [
          {
            association: 'Department',
            attributes: [],
            required: true,
          },
        ],
        group: ['Department.id', 'Department.name'],
        raw: true,
      }) as unknown as Array<{ departmentName: string; count: string }>;

      const result = {
        totalEmployees,
        averageSalary: parseFloat(averageSalaryResult?.averageSalary || '0') || 0,
        departmentCounts: departmentCounts.map((item) => ({
          departmentName: item.departmentName,
          count: parseInt(item.count),
        })),
      };

      logger.info('Employee statistics fetched successfully', result);
      return result;
    } catch (error: any) {
      logger.error('Error fetching employee statistics', { error: error.message });
      throw createError('Failed to fetch employee statistics', 500);
    }
  }
}
