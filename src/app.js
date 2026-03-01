const express = require('express');
const service = require('./services/dbService');

const app = express();
app.use(express.json());

(async () => {
  try {
    const db = require('./config/db');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Verified users table exists');
  } catch (err) {
    console.error('Failed to create users table:', err);
  }
})();

// GET all
app.get('/users', async (req, res) => {
  try {
    const users = await service.selectAll('users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by id
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await service.selectById('users', id);
    if (users.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update by id
app.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await service.updateById('users', id, data);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE by id
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteById('users', id);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST insert
app.post('/users', async (req, res) => {
  try {
    const data = req.body;
    const result = await service.insert('users', data);
    res.status(201).json({ insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET course - list of classes
app.get('/course', (req, res) => {
  res.json([
    { id: 1, title: 'Data Analyst' },
    { id: 2, title: 'Front End Developer' },
    { id: 3, title: 'Back End Developer' },
    { id: 4, title: 'Full Stack Developer' }
  ]);
});

// POST course - create new course
let courseIdCounter = 5;
app.post('/course', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  const newCourse = {
    id: courseIdCounter++,
    title: title
  };
  res.status(201).json({ insertId: newCourse.id, course: newCourse });
});

// GET course by id
app.get('/course/:id', (req, res) => {
  const courses = [
    { id: 1, title: 'Data Analyst' },
    { id: 2, title: 'Front End Developer' },
    { id: 3, title: 'Back End Developer' },
    { id: 4, title: 'Full Stack Developer' }
  ];
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// PUT update course by id
app.put('/course/:id', (req, res) => {
  const courses = [
    { id: 1, title: 'Data Analyst' },
    { id: 2, title: 'Front End Developer' },
    { id: 3, title: 'Back End Developer' },
    { id: 4, title: 'Full Stack Developer' }
  ];
  const id = parseInt(req.params.id);
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  // Update course title if provided
  if (req.body.title) {
    courses[index].title = req.body.title;
  }
  res.json({ affectedRows: 1, course: courses[index] });
});

// PATCH update course by id
app.patch('/course/:id', (req, res) => {
  const courses = [
    { id: 1, title: 'Data Analyst' },
    { id: 2, title: 'Front End Developer' },
    { id: 3, title: 'Back End Developer' },
    { id: 4, title: 'Full Stack Developer' }
  ];
  const id = parseInt(req.params.id);
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  // Update course title if provided
  if (req.body.title) {
    courses[index].title = req.body.title;
  }
  res.json({ affectedRows: 1, course: courses[index] });
});

// DELETE course by id
app.delete('/course/:id', (req, res) => {
  const courses = [
    { id: 1, title: 'Data Analyst' },
    { id: 2, title: 'Front End Developer' },
    { id: 3, title: 'Back End Developer' },
    { id: 4, title: 'Full Stack Developer' }
  ];
  const id = parseInt(req.params.id);
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  // Remove course from array
  courses.splice(index, 1);
  res.json({ affectedRows: 1, message: 'Course deleted successfully' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
