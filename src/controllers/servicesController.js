const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const controller = {};

controller.getAllServices = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Error de conexión a la base de datos");

    const query = `
      SELECT s.*, u.id AS userId, u.username AS userName
      FROM services s
      LEFT JOIN users u ON s.userId = u.id
    `;

    conn.query(query, (err, services) => {
      if (err) return res.status(500).send("Error obteniendo servicios");

      res.render("services", { services: services });
    });
  });
};


controller.getServices = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Error de conexión a la base de datos");

    const query = `
      SELECT s.*, u.id AS userId, u.username AS userName
      FROM services s
      LEFT JOIN users u ON s.userId = u.id
      WHERE s.isactive = 0 AND s.isended = 0
    `;

    conn.query(query, (err, services) => {
      if (err) return res.status(500).send("Error obteniendo servicios");

      res.render("catalogue", { services: services });
    });
  });
};


controller.getMyServices = (req, res) => {
  if (!req.session.user || !req.session.user.isSeller) {
    return res.redirect("/customers/login");
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Error conectando a la base de datos");

    const query = "SELECT * FROM services WHERE userId = ?";
    conn.query(query, [req.session.user.id], (err, services) => {
      if (err) return res.status(500).send("Error obteniendo servicios");
      const activeServices = services.filter(service => service.isactive == 0 && service.isended == 0);
      const inactiveServices = services.filter(service => service.isactive == 1 || service.isended == 1);
      res.render("myServices", {
        activeServices: activeServices,
        inactiveServices: inactiveServices,
      });
    });
  });
};

controller.getServiceDetail = (req, res) => {
  const serviceId = req.params.id;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Error conectando a la base de datos");
    const query = "SELECT * FROM services WHERE id = ?";
    conn.query(query, [serviceId], (err, result) => {
      if (err) return res.status(500).send("Error obteniendo el servicio");
      if (result.length === 0) return res.status(404).send("Servicio no encontrado");
      res.json(result[0]);
    });
  });
};


controller.getSe = (req, res) => {
  const serviceId = req.params.id;
  req.getConnection((err, conn) => {
    
    const query = `
      SELECT s.*, u.id AS userId, u.username AS userName
      FROM services s
      LEFT JOIN users u ON s.userId = u.id WHERE s.id = ?
    `;
    conn.query(query, [serviceId], (err, results) => {
      const service = results[0];
      res.render("service", { service });
    });
  });
};

// Renderizar el formulario con categorías
controller.addService = (req, res) => {
  if (!req.session.user || !req.session.user.isSeller) {
    return res.redirect("/customers/login");
  }
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM categories", (err, categories) => {
      if (err) return res.status(500).send("Error obteniendo categorías");
      res.render("add", {
        userId: req.session.user.id,
        categories: categories,
      });
    });
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

controller.newService = [
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  (req, res) => {
    let {
      userId,
      title,
      description,
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
      cover = 'uploads/default-cover.jpg'; //esa imagen no existe
    }

    let parsedFeatures;
    try {
      parsedFeatures = JSON.stringify(
        Array.isArray(features) ? features : [features]
      );
    } catch (err) {
      return res.status(400).send("Formato incorrecto en las características.");
    }

    let newService = {
      userId: parseInt(userId, 10),
      title,
      description,
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