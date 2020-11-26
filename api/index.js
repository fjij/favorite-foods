const express = require('express');
const app = express()
const port = process.env.PORT | 8000

app.get('/', (_, res) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
