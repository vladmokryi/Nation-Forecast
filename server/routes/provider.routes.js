import {Router} from 'express';
import * as ProviderController from '../controllers/provider.controller';
const router = new Router();

// Get forecast
router.route('/providers').get(ProviderController.getAll);

export default router;
