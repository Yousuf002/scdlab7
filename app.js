const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


const tasks = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Finish and submit the project proposal by the deadline.",
    dueDate: "2024-03-20",
    category: "Work",
    priority: "High",
    completed: false,
    userId: 1
  },
  {
    id: 2,
    title: "Grocery Shopping",
    description: "Buy essential groceries for the week.",
    dueDate: "2024-03-15",
    category: "Errands",
    priority: "Medium",
    completed: false,
    userId: 1
  },
  {
    id: 3,
    title: "Exercise",
    description: "Go for a 30-minute jog in the evening.",
    dueDate: "2024-03-18",
    category: "Personal",
    priority: "Low",
    completed: false,
    userId: 2
  }
];
const users = [];

app.use(bodyParser.json());

// Middleware for user authentication
function authenticateUser(req, res, next) {
  const { userId } = req.headers;

  if (!userId || !users.find(user => user.id === userId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = users.find(user => user.id === userId);
  next();
}

// Task Categorization
app.put('/tasks/:taskId/category/:newCategory', authenticateUser, (req, res) => {
  const { taskId, newCategory } = req.params;
  const task = tasks.find(task => task.id == taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.category = newCategory;
  res.json(task);
});

// Task Status
app.put('/tasks/:taskId/complete', authenticateUser, (req, res) => {
  const { taskId } = req.params;
  const task = tasks.find(task => task.id == taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = true;
  res.json(task);
});

// View Tasks
app.get('/tasks', authenticateUser, (req, res) => {
  const { sortBy } = req.query;

  let sortedTasks = tasks.filter(task => task.userId === req.user.id);

  if (sortBy) {
    switch (sortBy) {
      case 'dueDate':
        sortedTasks = sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'category':
        sortedTasks = sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'completionStatus':
        sortedTasks = sortedTasks.sort((a, b) => a.completed - b.completed);
        break;
      default:
        break;
    }
  }

  res.json(sortedTasks);
});

// Priority Levels
app.put('/tasks/:taskId/priority/:newPriority', authenticateUser, (req, res) => {
  const { taskId, newPriority } = req.params;
  const task = tasks.find(task => task.id == taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.priority = newPriority;
  res.json(task);
});

// User Authentication
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  const newUser = {
    id: users.length + 1,
    username,
    password,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
