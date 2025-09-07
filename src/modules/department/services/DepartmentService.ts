import { Department } from '../models/Department';
import { Pagination } from '../../../utils/pagination/Pagination';
import { PaginationResult } from '../../../utils/pagination/Pagination';
import logger from '../../../shared/logger/logger';
import { createError } from '../../../shared/error/errorHandler';

export interface CreateDepartmentData {
  name: string;
}

export interface UpdateDepartmentData {
  name?: string;
}

export interface DepartmentQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export class DepartmentService {
  public static async createDepartment(data: CreateDepartmentData): Promise<Department> {
    try {
      logger.info('Creating department', { data });

      const department = await Department.create(data);
      
      logger.info('Department created successfully', { 
        departmentId: department.id,
        departmentName: department.name 
      });

      return department;
    } catch (error: any) {
      logger.error('Error creating department', { error: error.message, data });
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Department with this name already exists', 409);
      }
      
      throw createError('Failed to create department', 500);
    }
  }

  public static async getDepartmentById(id: number): Promise<Department | null> {
    try {
      logger.info('Fetching department by ID', { departmentId: id });

      const department = await Department.findByPk(id);
      
      if (!department) {
        logger.warn('Department not found', { departmentId: id });
        return null;
      }

      return department;
    } catch (error: any) {
      logger.error('Error fetching department by ID', { error: error.message, departmentId: id });
      throw createError('Failed to fetch department', 500);
    }
  }

  public static async getAllDepartments(options: DepartmentQueryOptions = {}): Promise<PaginationResult<Department>> {
    try {
      const { page = 1, limit = 10, search } = options;
      const { page: validatedPage, limit: validatedLimit } = Pagination.validatePaginationParams(page, limit);
      
      logger.info('Fetching departments', { page: validatedPage, limit: validatedLimit, search });

      const offset = Pagination.calculateOffset(validatedPage, validatedLimit);
      
      const whereClause: any = {};
      if (search) {
        whereClause.name = {
          [require('sequelize').Op.like]: `%${search}%`,
        };
      }

      const { count, rows } = await Department.findAndCountAll({
        where: whereClause,
        limit: validatedLimit,
        offset,
        order: [['name', 'ASC']],
      });

      const result = Pagination.createPaginationResult(rows, {
        page: validatedPage,
        limit: validatedLimit,
        total: count,
      });

      logger.info('Departments fetched successfully', { 
        total: count, 
        returned: rows.length,
        page: validatedPage 
      });

      return result;
    } catch (error: any) {
      logger.error('Error fetching departments', { error: error.message, options });
      throw createError('Failed to fetch departments', 500);
    }
  }

  public static async updateDepartment(id: number, data: UpdateDepartmentData): Promise<Department | null> {
    try {
      logger.info('Updating department', { departmentId: id, data });

      const department = await Department.findByPk(id);
      if (!department) {
        logger.warn('Department not found for update', { departmentId: id });
        return null;
      }

      await department.update(data);
      
      logger.info('Department updated successfully', { 
        departmentId: id,
        updatedData: data 
      });

      return department;
    } catch (error: any) {
      logger.error('Error updating department', { error: error.message, departmentId: id, data });
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createError('Department with this name already exists', 409);
      }
      
      throw createError('Failed to update department', 500);
    }
  }

  public static async deleteDepartment(id: number): Promise<boolean> {
    try {
      logger.info('Deleting department', { departmentId: id });

      const department = await Department.findByPk(id);
      if (!department) {
        logger.warn('Department not found for deletion', { departmentId: id });
        return false;
      }

      await department.destroy();
      
      logger.info('Department deleted successfully', { departmentId: id });
      return true;
    } catch (error: any) {
      logger.error('Error deleting department', { error: error.message, departmentId: id });
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw createError('Cannot delete department with associated employees', 400);
      }
      
      throw createError('Failed to delete department', 500);
    }
  }

  public static async getDepartmentWithEmployees(id: number): Promise<Department | null> {
    try {
      logger.info('Fetching department with employees', { departmentId: id });

      const department = await Department.findByPk(id, {
        include: [
          {
            association: 'Employees',
            required: false,
          },
        ],
      });

      if (!department) {
        logger.warn('Department not found', { departmentId: id });
        return null;
      }

      return department;
    } catch (error: any) {
      logger.error('Error fetching department with employees', { error: error.message, departmentId: id });
      throw createError('Failed to fetch department with employees', 500);
    }
  }
}
