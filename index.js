/* eslint-disable linebreak-style */
const expressLib = require('express');
const redisLib = require('redis');
const rdcontroller = require('./rdcontroller/rdcontroller');

const app = expressLib();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Connecting to redis server
const redisClient = redisLib.createClient();
redisClient.connect();
redisClient.on('connect', () => {
  console.log('Connected to redis server');
});

// Imitation of databdase
const db = {
  1: ['Andy', 'Wilson', 18],
  2: ['Emmy', 'Lacster', 12],
  3: ['Daisy', 'Muller', 48],
};
// Setting server side

// Get users list
app.get('/api/users', async (req, res) => {
  const users = await rdcontroller.getUsersOrNull(redisClient);
  if (users) {
    // Send datas from cache
    res.status(200).json(users);
  } else {
    // Send from database if not exist in cahce
    res.send(db);
    // Set to redis with timer 600s
    redisClient.setEx('users', 600, JSON.stringify(db));
  }
});

// Get single user
app.get('/api/user/:id', async (req, res) => {
  console.log(db[1]);
  const user = await rdcontroller.getUserByIdOrUndefined(req.params.id, redisClient);
  if (user) res.send(user);
  else {
    res.send(db[req.params.id]);
    redisClient.setEx('users', 600, JSON.stringify(db));
  }
});

app.listen(PORT, () => {
  console.log(`Serving at port ${PORT}`);
});

// Close sockets to redis
process.on('SIGINT', () => {
  redisClient.disconnect();
  process.exit();
  console.log('Disconnecting from redis');
});
