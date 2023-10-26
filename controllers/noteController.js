import { Sequelize } from "sequelize";
import { validationResult } from "express-validator";
import Note from "../models/Note.js";

const showNotes = async (req, res) => {
  const notes = await Note.findAll({
    where: { fixed: [null, 0] },
    order: [["createdAt", "DESC"]],
  });

  const notesFixed = await Note.findAll({
    where: { fixed: 1 },
    order: [["createdAt", "ASC"]],
  });

  return res.json({ notes, notesFixed });
};

const createNote = async (req, res) => {
  const { title, note, fixed } = req.body;

  console.log(fixed);

  // validacion del body
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const resDB = {
      title: "Nota Invalida",
      subtitle: "Error al crear nota",
      color: "red",
      boolean: true,
    };
    return res.json(resDB);
  }

  // creacion de la nota
  await Note.create({
    title,
    note,
    fixed: fixed || 0,
  });
  const resDB = {
    title: "Nota Creada",
    subtitle: "Creacion de nota exitosa",
    color: "info",
    boolean: false,
  };
  return res.json(resDB);
};

const note = async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({ where: { id } });

  if (!note) return res.json({ error: true });

  return res.json(note);
};

const editNote = async (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;

  const noteDracker = await Note.findOne({ where: { id } });
  // validar si existe
  if (!noteDracker) {
    const resDB = {
      title: "Nota Invalida",
      subtitle: "Error al actualizar nota",
      color: "error",
      boolean: true,
    };
    return res.json(resDB);
  }

  // validacion del body
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const resDB = {
      title: "Nota Invalida",
      subtitle: "Error al actualizar nota",
      color: "error",
      boolean: true,
    };
    return res.json(resDB);
  }

  noteDracker.update({
    title,
    note,
  });
  await noteDracker.save();

  const resDB = {
    title: "Nota Actualizada",
    subtitle: "Actualizacion exitosa",
    color: "info",
    boolean: false,
  };
  return res.json(resDB);
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  const noteDracker = await Note.findOne({ where: { id } });
  // validar si existe
  if (!noteDracker) return res.json({ error: true });

  // Eliminar nota
  await noteDracker.destroy();

  return res.json({ error: false });
};

const fixedNote = async (req, res) => {
  const { id } = req.params;

  const noteDracker = await Note.findOne({ where: { id } });
  // validar si existe
  if (!noteDracker) return res.json({ error: true });

  // Eliminar nota
  noteDracker.update({ fixed: !noteDracker.fixed });
  await noteDracker.save();

  return res.json({ error: false });
};

const searchNotes = async (req, res) => {
  const { search } = req.body;

  if (!search.trim()) return res.json({ error: true, data: [] });

  const notes = await Note.findAll({
    raw: true,
    where: {
      [Sequelize.Op.or]: {
        title: {
          [Sequelize.Op.like]: "%" + search + "%",
        },
        note: {
          [Sequelize.Op.like]: "%" + search + "%",
        },
      },
    },
  });

  console.log(notes);
};

export {
  createNote,
  showNotes,
  note,
  editNote,
  deleteNote,
  fixedNote,
  searchNotes,
};
