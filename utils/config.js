const {
  PORT = 3000,
  JWT_SECRET = 'dev-secret',
  DB_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_URL,
};
