/* eslint-disable linebreak-style */
// Redis functionality
const getUsersOrNull = async (redisClient) => {
  const users = await redisClient.get('users');
  return JSON.parse(users);
};

const getUserByIdOrUndefined = async (id, redisClient) => {
  let users = await redisClient.get('users');
  users = JSON.parse(users);
  let user;
  if (users) {
    user = users[id];
  }
  return user;
};

module.exports = { getUsersOrNull, getUserByIdOrUndefined };
