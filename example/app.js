const express = require('express');
const fs = require('node:fs');

const app = express();

app.get('/categories', (req, res) => {
    const data = fs.readFileSync('data.json', 'utf-8');
      const jsonData = JSON.parse(data);
      res.json(jsonData);
});
app.get('/categories', (req, res) => {
    res.send('Categories read');
});

app.post('/categories', (req, res) => {
    res.send('Categories created');
}); 
app.patch('/categories', (req, res) => {
    res.send('Categories updated');
});
app.delete('/categories', (req, res) => {
    res.send('Categories deleted');
});
app.listen(3004, () => {
    console.log('Server is running on port 3006');
});