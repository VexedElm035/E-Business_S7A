const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("./../../src/app.js");

const controller = {};

controller.addCustomer = async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;
  console.log(username)
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden." });
  }
  if (!username || !email || !phone || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }
  try {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).json({ error: "Error conectando a la base de datos." });
      }
      const checkEmailQuery = "SELECT email FROM users WHERE email = ?";
      conn.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
          console.error("Error al verificar el correo:", err);
          return res.status(500).json({ error: "Error verificando el correo electrónico." });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: "El correo electrónico ya está en uso." });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const query = "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)";
        conn.query(query, [username, email, phone, hashedPassword], (err, result) => {
          if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).json({ error: "Error registrando usuario." });
          }
          return res.status(200).json({ success: "Usuario registrado exitosamente." });
        });
      });
    });
  } catch (err) {
    console.error("Error procesando el registro:", err);
    return res.status(500).json({ error: "Error procesando el registro." });
  }
};


controller.authCustomer = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  try {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).json({ error: "Error conectando a la base de datos." });
      }
      const query = "SELECT * FROM users WHERE username = ? OR email = ?";
      conn.query(query, [username, username], async (err, result) => {
        if (err) {
          console.error("Error al consultar en la base de datos:", err);
          return res.status(500).json({ error: "Error consultando usuario." });
        }
        if (result.length === 0) {
          return res.status(401).json({ error: "Usuario no encontrado." });
        }
        const user = result[0];
        if (user.disabled === 1) {
          return res.status(403).json({ error: "El usuario está baneado. Contacta al soporte." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: "Contraseña incorrecta." });
        }
        req.session.user = {
          id: user.id,
          username: user.username,
          isSeller: Boolean(user.isSeller),
        };
        if (!user.img && !user.country && !user.is_seller) {
          return res.status(200).json({
            success: "Inicio de sesión exitoso. Redirigiendo...",
            redirectUrl: "/customers/complement-profile",
          });
        }
        res.status(200).json({
          success: "Inicio de sesión exitoso. Redirigiendo...",
          redirectUrl: "/",
        });
      });
    });
  } catch (err) {
    console.error("Error procesando el inicio de sesión:", err);
    return res.status(500).json({ error: "Error procesando el inicio de sesión." });
  }
};

controller.logoutCustomer = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error cerrando sesión:", err);
      return res.status(500).send("Error cerrando sesión.");
    }
    res.redirect("/");
  });
};

controller.getSignup = (req, res) => {
  res.render('signup');
};

controller.getLogin = (req, res) => {
  res.render('login');
};

controller.complementProfile = (req, res) => {
  const { img, country, isSeller, desc} = req.body;
  const userId = req.session.user.id;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Error conectando a la base de datos");
    const query = "UPDATE users SET img = ?, country = ?, isSeller = ?, description = ? WHERE id = ?";
    conn.query(query, [img, country, isSeller, desc, userId], (err, result) => {
      if (err) {
        console.error("Error actualizando perfil:", err);
        return res.status(500).send("Error actualizando perfil.");
      }
      req.session.user.img = img;
      req.session.user.country = country;
      req.session.user.isSeller = Boolean(isSeller);

      res.redirect("/");
    });
  });
};

//CONTROLADORES DEL ADMIN
controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM users', (err, users) => {
      res.render('users', {
        users: users
      });
    });
  });
};

controller.edit = (req, res) => {
  const {id}  = req.params;
  req.getConnection((err, connection) => {
    const query = "SELECT * FROM users WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
      res.json(results[0]);
    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, hiddenIsDisabled } = req.body;
  let passwordHash = null;
  if (password) {
    passwordHash = bcrypt.hashSync(password, 12);
  }
  const disabledValue = hiddenIsDisabled;
  req.getConnection((err, connection) => {
    const query = `
      UPDATE users 
      SET username = ?, email = ?, password = ?, disabled = ?
      WHERE id = ?
    `;
    connection.query(query, [nombre, email, passwordHash, disabledValue, id], (err, results) => {
      if (err) {
        console.error("Error:", err);
        return res.redirect(`/admin/users?status=error&message=Error al actualizar el usuario.`);
      }
      if (results.affectedRows === 0) {
        return res.redirect(`/admin/users?status=error&message=Usuario no encontrado para actualizar.`);
      }
      res.redirect("/admin/users?status=success&message=Usuario actualizado exitosamente.");
    });
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, connection) => {
    const query = "DELETE FROM users WHERE id = ?";
    connection.query(query, id, (err, results) => {
      if (err) {
        console.error("Error:", err);
        return res.redirect(`/admin/users?status=error&message=Error al eliminar el usuario.`);
      }
      if (results.affectedRows === 0) {
        return res.redirect(`/admin/users?status=error&message=Usuario no encontrado para eliminar.`);
      }
      res.redirect("/admin/users?status=success&message=Usuario eliminado exitosamente.");
    });
  });
};

module.exports = controller;