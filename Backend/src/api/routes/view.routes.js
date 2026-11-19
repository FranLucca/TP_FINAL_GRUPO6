import { Router } from "express";
import { vistaAdmin } from "../controllers/view.controllers.js";

const router = Router();

// VISTA ADMIN PANEL
router.get("/", vistaAdmin);

export default router;