import { Router } from 'express';
import { DepartmentController } from '../controllers/DepartmentController';

const router = Router();

// Department routes
router.post('/', DepartmentController.createDepartment);
router.get('/', DepartmentController.getAllDepartments);
router.get('/:id', DepartmentController.getDepartmentById);
router.put('/:id', DepartmentController.updateDepartment);
router.delete('/:id', DepartmentController.deleteDepartment);
router.get('/:id/employees', DepartmentController.getDepartmentWithEmployees);

export default router;

