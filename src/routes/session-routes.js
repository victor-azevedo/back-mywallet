import { Router } from "express";

import { sessionController } from "../controllers/session-controller.js";
import { authValidation } from "../middleware/authValidation-middleware.js";

const sessionRouter = Router();

sessionRouter.use(authValidation).delete("/", sessionController.logout);

export default sessionRouter;
