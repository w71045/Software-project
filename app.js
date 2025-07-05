const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const userProfilesRouter = require('./routes/userProfiles');
const recipesRouter = require('./routes/recipes');


app.use(express.json());

app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/user-profiles', userProfilesRouter);

app.get('/', (req, res) => {
  res.send('DietCanvas API is running');
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const userProfilesRouter = require('./routes/userProfiles');
const recipesRouter = require('./routes/recipes');


app.use(express.json());

app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/user-profiles', userProfilesRouter);

app.get('/', (req, res) => {
  res.send('DietCanvas API is running');
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(4000, () => console.log('Server running on port 4000'));

}


}
