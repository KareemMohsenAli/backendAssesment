import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';

const router = Router();

// Employee routes
router.post('/', EmployeeController.createEmployee);
router.get('/', EmployeeController.getAllEmployees);
router.get('/statistics', EmployeeController.getEmployeeStatistics);
router.get('/export', EmployeeController.exportEmployees);
router.get('/department/:departmentId', EmployeeController.getEmployeesByDepartment);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

export default router;

