const express = require("express");
const router = express.Router();
const path = require("path");

const controller = {};

controller.createOrder = (req, res) => {
    const serviceId = req.params.id; // ID del servicio obtenido de la URL
    const buyerId = req.session.user?.id; // ID del comprador desde la sesión
  
    if (!buyerId) {
      return res.status(401).json({ error: "Debes iniciar sesión para comprar un servicio." });
    }
    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error conectando a la base de datos:", err);
        return res.status(500).json({ error: "Error del servidor." });
      }
      const getServiceQuery = "SELECT * FROM services WHERE id = ?";
      conn.query(getServiceQuery, [serviceId], (err, results) => {
        if (err) {
          console.error("Error consultando el servicio:", err);
          return res.status(500).json({ error: "Error al obtener el servicio." });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Servicio no encontrado." });
        }
  
        const service = results[0];
        const sellerId = service.userId;
        const createOrderQuery = `
          INSERT INTO orders (ServiceId, sellerId, buyerId, isCompleted) 
          VALUES (?, ?, ?, ?)
        `;
        conn.query(createOrderQuery, [serviceId, sellerId, buyerId, 0], (err) => {
          if (err) {
            console.error("Error creando la orden:", err);
            return res.status(500).json({ error: "Error al crear la orden." });
          }
  
          const updateServiceQuery = `
            UPDATE services SET isActive = 1, isEnded = 1 WHERE id = ?
          `;
          conn.query(updateServiceQuery, [serviceId], (err) => {
            if (err) {
              console.error("Error actualizando el servicio:", err);
              return res.status(500).json({ error: "Error al actualizar el servicio." });
            }
  
            res.status(200).json({ success: "Servicio comprado con éxito." });
          });
        });
      });
    });
  };

  controller.list = (req, res) => {
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM orders', (err, orders) => {
        res.render('orders', {
          orders: orders
        });
      });
    });
  };

module.exports = controller;
