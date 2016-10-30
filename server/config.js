const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/national-forecast',
  port: process.env.PORT || 8000,
  providers: {
    openweathermap: {
      apiUrl: "http://api.openweathermap.org/data/2.5/forecast/daily",
      apiKey: "b207ffe7c6ab004ce89ad05adb085b9b"
    },
    apixu: {
      apiUrl: "http://api.apixu.com/v1/forecast.json",
      apiKey: "a549977375344f3fb49201620161810"
    }
  },
  actualCachePeriod: 43200000,
  forecastPeriod: 7
};

export default config;
