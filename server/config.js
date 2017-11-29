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
    },
    darksky: {
      apiUrl: process.env.DARKSKY_APIURL,
      apiKey: process.env.DARKSKY_APIKEY,
    },
    weatherunlocked: {
      apiKey: process.env.WEATHERUNLOCKED_APIKEY,
      appID: process.env.WEATHERUNLOCKED_APPID,
      apiUrl: process.env.WEATHERUNLOCKED_APIURL
    },
    wunderground: {
      apiKey: process.env.WUNDERGROUND_APIKEY,
      apiUrl: process.env.WUNDERGROUND_APIURL
    }
  },
  google: {
    apikey: process.env.GOOGLE_APIKEY
  },
  cache: {
    period: process.env.CACHE_PERIOD || 21600,
    range: process.env.CACHE_RANGE || 10
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_APIKEY
  },
  contactEmail: process.env.CONTACT_EMAIL,
  forecastPeriod: process.env.FORECAST_PERIOD || 7,
  jwt_token: process.env.JWT_TOKEN || 'forecast',
};

export default config;
