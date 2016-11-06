import * as UserController from '../controllers/user.controller';

export default function (router, protectedMiddleware) {
  router.post('/users/sign-up', UserController.create);
  return router;
};
