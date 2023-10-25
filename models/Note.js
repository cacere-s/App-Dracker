import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Note = db.define('notes', {
    title: {
        type: DataTypes.STRING
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fixed: DataTypes.BOOLEAN
})

export default Note