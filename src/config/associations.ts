import { Department } from '../modules/department/models/Department';
import { Employee } from '../modules/employee/models/Employee';

// Define associations
export const setupAssociations = (): void => {
  // Department has many Employees
  Department.hasMany(Employee, {
    foreignKey: 'departmentId',
    as: 'Employees',
  });

  // Employee belongs to Department
  Employee.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'Department',
  });
};

