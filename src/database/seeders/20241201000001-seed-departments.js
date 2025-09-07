'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      {
        name: 'Engineering',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Human Resources',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Marketing',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Finance',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Sales',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Operations',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('departments', departments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};

