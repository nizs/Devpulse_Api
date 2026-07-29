import { Router } from 'express';
import { login, refresh, signup } from '../controllers/auth.controller';

const router = Router();

router.post("/signup", signup)
router.post("/login", login)

router.get("/refresh", refresh)

router.post("/issues", () => { })

// router.get("api/issues?sort=newest", () => { })
router.get("/issues/:id", () => { })

router.put("/issues/:id", () => { })
router.delete("/issues/:id", () => { })

export default router;