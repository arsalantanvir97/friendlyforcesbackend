const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
var path = require('path')
const logger = require('morgan')
const query = require('./config/db.js')
const authRoutes = require('./routes/authRoutes.js')
const getHiredRoutes = require('./routes/getHiredRoutes.js')

const multer = require('multer')

const { fileFilter, fileStorage } = require('./multer.js')

dotenv.config()

const app = express()
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(logger('dev'))

query('SELECT 1 + 1 AS result', (error) => {
  if (error) {
    console.error('Error connecting to the database:', error.message)
  } else {
    console.log('Database connected successfully')
    // Add your routes here
  }
})

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: '_image',
      maxCount: 1,
    },
    {
      name: 'vid',
      maxCount: 1,
    },
    {
      name: 'doc',
      maxCount: 1,
    },
  ])
)

app.use('/api/auth', authRoutes)
app.use('/api/getHired', getHiredRoutes)

app.get('/uploads/:name', (req, res) => {
  // const myURL  = new URL(req.url)
  // console.log(myURL.host);

  res.sendFile(path.join(__dirname, `./uploads/${req.params.name}`))
})

app.get('/', (req, res) => {
  res.send('API is running....')
})

app.listen(process.env.PORT, console.log('Server running on port 5000'))
