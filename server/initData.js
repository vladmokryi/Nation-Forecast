import Provider from './models/provider';
import _ from 'lodash';

export default function () {
  Provider.find({}, {name: 1}).exec((err, exists) => {
    if (exists && exists.length === 4) {
      return;
    }

    let providers = [];

    _.forEach(['openweathermap', 'apixu', 'darksky', 'weatherunlocked'], function (providerName) {
      let provider = _.find(exists, function (item) {
        return item.name === providerName;
      });
      if (!provider) {
        if (providerName === 'openweathermap') {
          providers.push(new Provider({name: 'openweathermap', displayName: 'OpenWeatherMap', link: 'https://openweathermap.org/'}));
        } else if (providerName === 'apixu') {
          providers.push(new Provider({name: 'apixu', displayName: 'APIXU', link: 'https://www.apixu.com/'}));
        } else if (providerName === 'darksky') {
          providers.push(new Provider({name: 'darksky', displayName: 'Dark Sky', link: 'https://darksky.net/'}));
        } else if (providerName === 'weatherunlocked') {
          providers.push(new Provider({name: 'weatherunlocked', displayName: 'Weather Unlocked', link: 'https://weatherunlocked.com/'}));
        }
      }
    });

    Provider.create(providers, (error) => {
      if (!error) {
        console.log('init data...');
      }
    });
  });
}
