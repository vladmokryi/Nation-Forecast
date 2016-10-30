import Provider from './models/provider';

export default function () {
  Provider.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    let providers = [];

    providers.push(new Provider({name: 'openweathermap', displayName: 'OpenWeatherMap', link: 'https://openweathermap.org/'}));
    providers.push(new Provider({name: 'apixu', displayName: 'APIXU', link: 'https://www.apixu.com/'}));

    Provider.create(providers, (error) => {
      if (!error) {
        console.log('init data...');
      }
    });
  });
}
