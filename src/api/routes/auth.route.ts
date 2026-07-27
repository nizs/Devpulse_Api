import { Router } from 'express';
import { signup } from '../controllers/auth.controller';

const router = Router();

router.post("/signup", signup)
router.post("/login", () => { })

router.post("api/issues", () => { })

// router.get("api/issues?sort=newest", () => { })
router.get("api/issues/:id", () => { })

router.put("api/issues/:id", () => { })
router.delete("Sapi/issues/:id", () => { })

export default router;