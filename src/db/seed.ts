import { index, pool } from './index';
import * as schema from './schema';

async function seed() {
  try {
    console.log('Seed started...');

    // 1. Seed Departments
    console.log('Seeding departments...');
    const insertedDepartments = await index
      .insert(schema.departments)
      .values([
        {
          code: 'CS',
          name: 'Computer Science',
          description: 'Department of Computer Science and Engineering',
        },
        {
          code: 'MATH',
          name: 'Mathematics',
          description: 'Department of Mathematics and Statistics',
        },
        {
          code: 'PHYS',
          name: 'Physics',
          description: 'Department of Physics',
        },
      ])
      .returning();

    console.log(`Inserted ${insertedDepartments.length} departments.`);

    const csDept = insertedDepartments.find((d) => d.code === 'CS');
    const mathDept = insertedDepartments.find((d) => d.code === 'MATH');

    if (!csDept || !mathDept) {
      throw new Error('Failed to find created departments for subject seeding');
    }

    // 2. Seed Subjects
    console.log('Seeding subjects...');
    await index.insert(schema.subjects).values([
      {
        departmentId: csDept.id,
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basics of programming using Python',
      },
      {
        departmentId: csDept.id,
        code: 'CS201',
        name: 'Data Structures',
        description: 'Fundamental data structures and algorithms',
      },
      {
        departmentId: mathDept.id,
        code: 'MATH101',
        name: 'Calculus I',
        description: 'Differential and integral calculus',
      },
      {
        departmentId: mathDept.id,
        code: 'MATH201',
        name: 'Linear Algebra',
        description: 'Systems of linear equations and matrices',
      },
    ]);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool closed.');
    }
  }
}

seed();
