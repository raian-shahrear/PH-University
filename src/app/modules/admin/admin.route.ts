import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);
router.get('/:adminId', AdminControllers.getSingleAdmin);
router.patch(
  '/:adminId',
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
