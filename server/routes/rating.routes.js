import {Router} from 'express';
import * as RatingController from '../controllers/rating.controller';

export default function (router, protectedMiddleware) {
  // Get forecast
  router.route('/ratings')
    .get(protectedMiddleware, RatingController.getRatingsByUser)
    .post(protectedMiddleware, RatingController.setRating);

  return router;
};
