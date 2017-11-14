import Forecast from '../models/forecast';
import Provider from '../models/provider';
import serverConfig from '../config';
import fetch from 'node-fetch';
import _ from 'lodash';
import parallel from 'async/parallel';
let parseString = require('xml2js').parseString;

/**
 * Get forecast by coordinates
 * @param req
 * @param res
 * @param next
 */
export function getForecasts(req, res, next) {
  if (req.query && req.query.lat && req.query.lon) {
    let forecastPeriod = req.query.period ? parseInt(req.query.period) : serverConfig.forecastPeriod;

    //check cache
    let range = serverConfig.cache.range,
      lat = parseFloat(req.query.lat),
      lon = parseFloat(req.query.lon),
      date = new Date(+new Date() - serverConfig.cache.period*1000);
    Forecast.find({
      location: {
        '$geoWithin': {
          '$centerSphere': [
            [lon, lat],
            range / 6371
          ]
        }
      },
      createdAt: {$gte: date}
    }).distinct('_id').then(function (forecasts) {
      if (forecasts && forecasts.length && forecasts.length === _.keys(serverConfig.providers).length && forecasts[0] && forecasts[0].list && forecasts[0].list.length >= forecastPeriod) {
        //get cache
        req.forecastsIds = forecasts;
        next();
      } else {
        //new request
        parallel([
          (callback) => {
            getApixu({lat: lat, lon: lon, forecastPeriod: forecastPeriod}, callback);
          },
          (callback) => {
            getOpenweathermap({lat: lat, lon: lon, forecastPeriod: forecastPeriod}, callback);
          },
          (callback) => {
            getDarksky({lat: lat, lon: lon, forecastPeriod: forecastPeriod}, callback);
          },
          (callback) => {
            getWeatherunlocked({lat: lat, lon: lon, forecastPeriod: forecastPeriod}, callback);
          },
        ], (err, results) => {
          req.forecastsIds = _.map(_.remove(results, null), '_id');
          next();
        });
      }
    }).catch(function (err) {
      res.status(500).end();
    });
  } else {
    //bad request
    res.status(400).end();
  }
}

export function populateProviderByIds(req, res, next) {
  Forecast.find({_id: {$in: req.forecastsIds}}).populate('provider').then(forecasts => {
    req.forecasts = forecasts;
    next();
  }).catch(err => {
    res.status(500).end();
  });
}

export function calculate(req, res) {
  if (req.forecasts && req.forecasts.length && req.rating) {
    let list = [];
    let allRating = parseInt(req.rating);
    let forecastPeriod = req.query.period ? parseInt(req.query.period) : serverConfig.forecastPeriod;
    for (let i = 0; i < forecastPeriod; i++) {
      //todo: check date
      let item = {
        date: new Date(req.forecasts[0].list[i].date),
        min: 0,
        max: 0
      };
      _.forEach(req.forecasts, forecast => {
        let day = forecast.list[i];
        item.min += day.min * forecast.provider.rating;
        item.max += day.max * forecast.provider.rating;
      });
      item.min /= allRating;
      item.max /= allRating;
      item.avg = (item.min + item.max) / 2;
      list.push(item);
    }

    //find info
    //openweathermap
    let openweathermap =  _.find(req.forecasts, function (item) {
      return item.provider.name === 'openweathermap';
    });

    res.status(200).send({
      forecast: {
        city: openweathermap.city,
        location: openweathermap.location,
        date: new Date(),
        list
      },
      providers: req.forecasts
    });
  } else {
    res.status(500).end();
  }
}

/**
 * Save a forecast
 * @param data
 * @param callback
 * @returns void
 */
function addForecast(data, callback) {
  const newForecast = new Forecast(data);
  newForecast.save().then(saved => {
    callback(null, saved);
  }).catch(err => {
    callback(err);
  });
}

export function getOpenweathermap(data, callback) {
  Provider.findOne({name: 'openweathermap'}).then(provider => {
    let days = data.forecastPeriod ? parseInt(data.forecastPeriod) : serverConfig.forecastPeriod;
    let apiKey = serverConfig.providers.openweathermap.apiKey;
    let apiUrl = serverConfig.providers.openweathermap.apiUrl;
    let url = apiUrl + `?lat=${data.lat}&lon=${data.lon}&cnt=${days}&mode=json&units=metric&appid=${apiKey}`;
    fetch(url).then(response => response.json()).then(response => {
      let list = [];
      _.forEach(response.list, function (day) {
        list.push({
          date: new Date(+day.dt * 1000),
          min: parseFloat(day.temp.min),
          max: parseFloat(day.temp.max),
          avg: (parseFloat(day.temp.min) + parseFloat(day.temp.max)) / 2,
          weather: day.weather
        });
      });
      let forecast = {
        provider: provider._id,
        city: response.city,
        location: {
          coordinates: [response.city.coord.lon, response.city.coord.lat]
        },
        list,
      };
      addForecast(forecast, callback);
    }).catch((err)=> {
      callback(err);
    });
  }).catch((err)=> {
    callback(err);
  });
}

export function getApixu(data, callback) {
  Provider.findOne({name: 'apixu'}).then(provider => {
    let days = data.forecastPeriod ? parseInt(data.forecastPeriod) : serverConfig.forecastPeriod;
    let apiKey = serverConfig.providers.apixu.apiKey;
    let apiUrl = serverConfig.providers.apixu.apiUrl;
    let url = apiUrl + `?q=${data.lat},${data.lon}&key=${apiKey}&days=${days}`;
    fetch(url).then(response => response.json()).then(response => {
      let list = [];
      _.forEach(response.forecast.forecastday, function (day) {
        list.push({
          date: new Date(day.date),
          min: parseFloat(day.day.mintemp_c),
          max: parseFloat(day.day.maxtemp_c),
          avg: (parseFloat(day.day.mintemp_c) + parseFloat(day.day.maxtemp_c)) / 2,
          weather: day.day.condition
        });
      });
      let forecast = {
        provider: provider._id,
        city: response.location,
        location: {
          coordinates: [response.location.lon, response.location.lat]
        },
        list,
      };
      addForecast(forecast, callback);
    }).catch((err)=> {
      callback(err)
    });
  }).catch((err)=> {
    callback(err)
  });
}

export function getDarksky(data, callback) {
  Provider.findOne({name: 'darksky'}).then(provider => {
    let forecastPeriod = data.forecastPeriod ? parseInt(data.forecastPeriod) : serverConfig.forecastPeriod;
    let apiKey = serverConfig.providers.darksky.apiKey;
    let apiUrl = serverConfig.providers.darksky.apiUrl;
    let url = apiUrl + apiKey + `/${data.lat},${data.lon}?exclude=currently,minutely,hourly,alerts,flags&units=si`;
    fetch(url).then(response => response.json()).then(response => {
      let list = [];
      _.forEach(response.daily.data, function (day, index) {
        if (index < forecastPeriod) {
          list.push({
            date: new Date(day.time * 1000),
            min: parseFloat(day.temperatureMin),
            max: parseFloat(day.temperatureMax),
            avg: (parseFloat(day.temperatureMin) + parseFloat(day.temperatureMax)) / 2,
            weather: day
          });
        }
      });
      let forecast = {
        provider: provider._id,
        city: {
          timezone: response.timezone,
          offset: response.offset,
        },
        location: {
          coordinates: [response.longitude, response.latitude]
        },
        list,
      };
      addForecast(forecast, callback);
    }).catch((err)=> {
      console.log(err);
      callback(err)
    });
  }).catch((err)=> {
    callback(err)
  });
}

export function getWeatherunlocked(data, callback) {
  Provider.findOne({name: 'weatherunlocked'}).then(provider => {
    let forecastPeriod = data.forecastPeriod ? parseInt(data.forecastPeriod) : serverConfig.forecastPeriod;
    let apiKey = serverConfig.providers.weatherunlocked.apiKey;
    let apiUrl = serverConfig.providers.weatherunlocked.apiUrl;
    let appId = serverConfig.providers.weatherunlocked.appID;

    let url = apiUrl + `${data.lat},${data.lon}?app_id=${appId}&app_key=${apiKey}`;
    fetch(url).then(response => response.json()).then(response => {
      let list = [];
      _.forEach(response.Days, function (day, index) {
        if (index < forecastPeriod) {
          let date = day.date.split('/');
          list.push({
            date: new Date(date[1] + '/' + date[0] + '/' + date[2]),
            min: parseFloat(day.temp_min_c),
            max: parseFloat(day.temp_max_c),
            avg: (parseFloat(day.temp_min_c) + parseFloat(day.temp_max_c)) / 2,
            weather: day
          });
        }
      });
      let forecast = {
        provider: provider._id,
        location: {
          coordinates: [data.lon, data.lat]
        },
        list,
      };
      addForecast(forecast, callback);
    }).catch((err)=> {
      console.log(err);
      callback(err)
    });
  }).catch((err)=> {
    callback(err)
  });
}
