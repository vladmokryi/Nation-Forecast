const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/national-forecast',
  port: process.env.PORT || 8000,
  providers: {
    openweathermap: {
      apiUrl: process.env.OPENWEATHERMAP_APIURL,
      apiKey: process.env.OPENWEATHERMAP_APIKEY
    },
    apixu: {
      apiUrl: process.env.APIXU_APIURL,
      apiKey: process.env.APIXU_APIKEY
    }
  },
  google: {
    apikey: process.env.GOOGLE_APIKEY
  },
  actualCachePeriod: process.env.ACTUAL_CACHE_PERIOD || 43200000,
  forecastPeriod: process.env.FORECAST_PERIOD || 7
};

export default config;
