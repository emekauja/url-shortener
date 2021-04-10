const express = require('express');
const cors = require('cors')

const app = express()
const PORT = 4000;

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')

})

app.listen(PORT, console.log(`server has started on port ${PORT}`))