const express = require("express");
const router = express.Router();
const db = require("./../../src/app.js");

const controller = {};

controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM categories', (err, categories) => {
      res.render('categories', {
        categories: categories
      });
    });
  });
};

controller.add = (req, res) => {
  const { nombreADD, descripcionADD } = req.body;
  req.getConnection((err, connection) => {
    const query = "INSERT INTO Categories (name, description) VALUES (?, ?)";
    connection.query(query, [nombreADD, descripcionADD], (err, results) => {
      if (err) {
        console.error("Error:", err);
        return res.redirect("/admin/categories?status=error&message=Error al agregar la categoría.");
      }
      res.redirect("/admin/categories?status=success&message=Categoría agregada exitosamente.");
    });
  });
};


controller.edit = (req, res) => {
  const { name } = req.params;
  req.getConnection((err, connection) => {
    const query = "SELECT * FROM Categories WHERE name = ?";
      connection.query(query, [name], (err, results) =>  {
      res.json(results[0]);
    });
  });
};

controller.update = (req, res) => {
  const { name } = req.params;
  const { nombreUPD, descripcionUPD } = req.body;
  req.getConnection((err, connection) => {
    const query = "UPDATE Categories SET name = ?, description = ? WHERE name = ?";
    connection.query(query, [nombreUPD, descripcionUPD, name], (err, results) => {
      if (err) {
        console.error("Error:", err);
        return res.redirect(`/admin/categories?status=error&message=Error al actualizar la categoría.`);
      }

      if (results.affectedRows === 0) {
        return res.redirect(`/admin/categories?status=error&message=Categoría no encontrada para actualizar.`);
      }

      res.redirect("/admin/categories?status=success&message=Categoría actualizada exitosamente.");
    });
  });
};


controller.delete = (req, res) => {
  const { name } = req.params;
  req.getConnection((err, connection) => {
    const query = "DELETE FROM Categories WHERE name = ?";
    connection.query(query, name, (err, results) => {
      if (err) {
        console.error("Error:", err);
        return res.redirect(`/admin/categories?status=error&message=Error al eliminar la categoría.`);
      }

      if (results.affectedRows === 0) {
        return res.redirect(`/admin/categories?status=error&message=Categoría no encontrada para eliminar.`);
      }

      res.redirect("/admin/categories?status=success&message=Categoría eliminada exitosamente.");
    });
  });
};

module.exports = controller;