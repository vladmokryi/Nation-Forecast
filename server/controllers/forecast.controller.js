import Forecast from '../models/forecast';
import Provider from '../models/provider';
import serverConfig from '../config';
import fetch from 'node-fetch';
import _ from 'lodash';
import parallel from 'async/parallel';

/**
 * Get forecast by coordinates
 * @param req
 * @param res
 * @param next
 */
export function getForecasts(req, res, next) {
  if (req.query && req.query.lat && req.query.lon) {
    //check cache
    let range = 10,
      lat = parseFloat(req.query.lat),
      lon = parseFloat(req.query.lon);

    var cacheDate = new Date(+new Date() - serverConfig.actualCachePeriod );
    Forecast.find({
      location: {
        '$geoWithin': {
          '$centerSphere': [
            [lon, lat],
            range / 6371
          ]
        }
      },
      createdAt: { $gte: cacheDate }
    }).distinct('_id').then(function (forecasts) {
      if (forecasts && forecasts.length) {
        //get cache
        req.forecastsIds = forecasts;
        next();
      } else {
        //new request
        parallel([
          (callback) => {
            getApixu({lat: lat, lon: lon}, callback);
          },
          (callback) => {
            getOpenweathermap({lat: lat, lon: lon}, callback);
          }
        ], (err, results) => {
          req.forecastsIds = _.map(_.remove(results, null), '_id');
          next();
        });
      }
    }).catch(function () {
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
    for (let i = 0; i < serverConfig.forecastPeriod; i++) {
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
      list.push(item);
    }
    res.status(200).send({calculate: list, forecasts: req.forecasts});
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
    let days = serverConfig.forecastPeriod;
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
    let days = serverConfig.forecastPeriod;
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
