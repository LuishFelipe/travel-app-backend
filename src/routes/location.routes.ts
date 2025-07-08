import { Router } from "express";
import { locationController } from "../controllers/location.controller";

const router = Router();

router.post('/', locationController.create);
router.get('/', locationController.findAll);
router.get('/:id', locationController.findOne);
router.put('/:id', locationController.update);
router.delete('/:id', locationController.remove);
router.get('/city/:city', locationController.findByCity);
router.get('/region/:region', locationController.findByRegion);
router.get('/country/:country', locationController.findByCountry);
router.get('/description/:description', locationController.findByDescription);

export default router
