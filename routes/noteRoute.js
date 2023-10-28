import express from "express";
import { body } from "express-validator";
import { showNotes, createNote, note, editNote, deleteNote, fixedNote, searchNotes } from "../controllers/noteController.js";


const router = express.Router();

router.get("/", showNotes);

router.post(
  "/create",
  body("note").isLength({ min: 5 }).withMessage("Titulo invalido"),
  createNote
);

router.get("/note/:id", note);

router.put(
  "/update/:id",
  body("note").isLength({ min: 5 }).withMessage("Titulo invalido"),
  editNote
);

router.put('/fixed/:id', fixedNote);

router.delete('/delete/:id', deleteNote)

router.post('/search/note', searchNotes)

export default router;
