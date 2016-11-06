import {Router} from 'express';
import * as ProviderController from '../controllers/provider.controller';

export default function (router, protectedMiddleware) {
  // Get forecast
  router.route('/providers').get(ProviderController.getAll);

  return router;
};
