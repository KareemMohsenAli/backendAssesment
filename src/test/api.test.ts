import request from 'supertest';
import app from '../server';

describe('Employee Management System API', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('running');
    });
  });

  describe('Department API', () => {
    it('should create a department', async () => {
      const departmentData = {
        name: 'Test Department'
      };

      const response = await request(app)
        .post('/api/departments')
        .send(departmentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(departmentData.name);
    });

    it('should get all departments', async () => {
      const response = await request(app)
        .get('/api/departments')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Employee API', () => {
    it('should create an employee', async () => {
      const employeeData = {
        name: 'John Doe',
        email: 'john.doe@test.com',
        departmentId: 1,
        salary: 50000
      };

      const response = await request(app)
        .post('/api/employees')
        .send(employeeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(employeeData.name);
    });

    it('should get all employees', async () => {
      const response = await request(app)
        .get('/api/employees')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should export employees as CSV', async () => {
      const response = await request(app)
        .get('/api/employees/export?format=csv')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
    });
  });
});

