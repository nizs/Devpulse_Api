import { Router } from "express";
import { auth } from "../../middleware/auth";
import { createIssue, getAllIssues } from "../controllers/issue.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), createIssue);
router.get("/", getAllIssues);


router.get("/:id", () => { })

router.put("/:id", () => { })

router.delete("/:id", () => { })

export default router;