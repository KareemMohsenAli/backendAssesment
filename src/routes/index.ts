import { Router } from 'express';
import departmentRoutes from '../modules/department/routes/departmentRoutes';
import employeeRoutes from '../modules/employee/routes/employeeRoutes';

const router = Router();

// API routes
router.use('/api/departments', departmentRoutes);
router.use('/api/employees', employeeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;

