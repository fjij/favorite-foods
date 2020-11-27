const express = require('express');
const db = require('./db');
const app = express();
const port = process.env.PORT | 8000;

app.get('/food', async (_, res) => {
  const query = "SELECT * FROM food";
  const result = await db.query(query);
  res.json(result.rows);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
