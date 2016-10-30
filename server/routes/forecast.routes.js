import {Router} from 'express';
import * as ForecastController from '../controllers/forecast.controller';
import * as ProviderController from '../controllers/provider.controller';
const router = new Router();

// Get forecast
router.route('/forecast').get(ForecastController.getForecasts, ForecastController.populateProviderByIds, ProviderController.allRating, ForecastController.calculate);

export default router;
