const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/national-forecast',
  port: process.env.PORT || 8000,
};

export default config;
