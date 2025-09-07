'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        department_id: 1, // Engineering
        salary: 75000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department_id: 1, // Engineering
        salary: 80000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department_id: 2, // Human Resources
        salary: 60000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        department_id: 3, // Marketing
        salary: 65000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'David Brown',
        email: 'david.brown@company.com',
        department_id: 4, // Finance
        salary: 70000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Lisa Davis',
        email: 'lisa.davis@company.com',
        department_id: 5, // Sales
        salary: 55000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tom Anderson',
        email: 'tom.anderson@company.com',
        department_id: 6, // Operations
        salary: 62000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Emily Taylor',
        email: 'emily.taylor@company.com',
        department_id: 1, // Engineering
        salary: 85000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Robert Miller',
        email: 'robert.miller@company.com',
        department_id: 2, // Human Resources
        salary: 58000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Amanda Garcia',
        email: 'amanda.garcia@company.com',
        department_id: 3, // Marketing
        salary: 68000.00,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('employees', employees);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};

