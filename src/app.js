const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql2");
const path = require("path");
const myConnection = require("express-myconnection");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const { cards } = require("./../db/tempdata.js");

// Configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  myConnection(mysql, {
    host: "localhost",
    user: "root",
    password: "root",
    database: "codeconnect",
  })
);
app.use(
  session({
    secret: "secret", // clave secreta para firmar las cookies
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Rutas
app.get("/", (req, res) => {
  res.render("index", { cards });
});
const adminRoutes = require("./routes/admin");
const servicesRoutes = require("./routes/services");
const customersRoutes = require("./routes/customers");
const ordersRoutes = require("./routes/orders");

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/admin", adminRoutes);
app.use("/services", servicesRoutes);
app.use("/myservices", servicesRoutes);
app.use("/servicedetail/:id", servicesRoutes);
app.use("/customers", customersRoutes);
app.use("/complement", customersRoutes);
app.use("/login", customersRoutes);
app.use("/signup", customersRoutes);
app.use("/orders", ordersRoutes);

app.listen(app.get("port"), () => {
  console.log(`Servidor iniciado en http://localhost:${app.get("port")}`);
});