const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/', (req, res) => {
  res.json({ message: 'RACH procedure implemtation' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Start at /api end points for RANDOM ACCESS CHANNEL PROCEDURE ! ! !' });
  });

app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});