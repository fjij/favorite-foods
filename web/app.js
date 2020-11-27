const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));
mountRoutes(app);

const port = process.env.PORT | 8000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})

module.exports = app;
