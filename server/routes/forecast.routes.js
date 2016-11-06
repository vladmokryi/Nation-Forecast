import * as ForecastController from '../controllers/forecast.controller';
import * as ProviderController from '../controllers/provider.controller';

export default function (router, protectedMiddleware) {
  // Get forecast
  router.route('/forecast').get(ForecastController.getForecasts, ForecastController.populateProviderByIds, ProviderController.allRating, ForecastController.calculate);

  return router;
};
