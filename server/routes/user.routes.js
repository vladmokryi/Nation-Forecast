import * as UserController from '../controllers/user.controller';

export default function (router, protectedMiddleware) {
  router.post('/users/sign-up', UserController.create);
  router.get('/user', protectedMiddleware, UserController.get);
  router.post('/user/favorite', protectedMiddleware, UserController.addFavoriteLocation);
  return router;
};
