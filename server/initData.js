import Provider from './models/provider';

export default function () {
  Provider.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    let providers = [];

    providers.push(new Provider({name: 'openweathermap'}));
    providers.push(new Provider({name: 'apixu'}));

    Provider.create(providers, (error) => {
      if (!error) {
        console.log('init data...');
      }
    });
  });
}
