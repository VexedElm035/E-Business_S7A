const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const controller = {};

controller.addService = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM categories", (err, categories) => {
      if (err) return res.status(500).send("Error obteniendo categorías");
      res.render("add", {
        categories: categories,
      });
    });
  });
};

//todo lo del almacenamiento de imagenes -- inicio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage })
//todo lo del almacenamiento de imagenes -- fin

controller.newService = [upload.fields([{ name: "cover", maxCount: 1 },{ name: "images", maxCount: 10 },]),
  (req, res) => {
    let {
      userId,
      title,
      desc,
      shortTitle,
      shortDesc,
      deliveryTime,
      revisionNumber,
      category,
      price,
      features,
    } = req.body;

    let cover = req.files?.cover?.[0]?.path || null;
    let images = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];

    if (!cover) {
      cover = 'uploads/default-cover.jpg';
    }

    let parsedFeatures;
    try {
      parsedFeatures = JSON.stringify(
        Array.isArray(features) ? features : [features]
      );
    } catch (err) {
      return res.status(400).send("Formato incorrecto.");
    }

    let newService = {
      userId: parseInt(userId, 10),
      title,
      desc,
      shortTitle,
      shortDesc,
      deliveryTime: parseInt(deliveryTime, 10),
      revisionNumber: parseInt(revisionNumber, 10),
      categoryId: parseInt(category, 10),
      price: parseFloat(price),
      cover,
      images: JSON.stringify(images),
      features: parsedFeatures,
    };

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send("Error conectando a la base de datos");
      conn.query("INSERT INTO Services SET ?", newService, (err, result) => {
        if (err) {
          console.error("Error al insertar en la base de datos:", err);
          return res.status(500).send("Error insertando el servicio");
        }
        res.redirect("/");
      });
    });
  },
];

module.exports = controller;
