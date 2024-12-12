PARA REALIZAR LA INSTALACION DEL PROGRAMA ES NECESARIO PRIMERO:
    ABRIR UNA TERMINAL DE LINEA DE COMANDOS EN LA RUTA DEL PROYECTO.
    PARA SABER SI ESTAS EN LA RUTA CORRECTA, PUEDES USAR LOS COMANDOS
    "dir" EN WINDOWS o "ls" EN LINUX, SI LAS DIRECTORIOS:
        d - db
        d - src
        d - upload
        a - README.md
    SE IMPRIMERON DE ESTA MANERA O SIMILAR, SIGNIFICA QUE ESTAS EN LA
    RUTA CORRECTA.

    AHORA EN LA TERMINAL PON EL SIGUIENTE COMANDO:

        npm init -y
    
    UNA VEZ SE HAYA COMPLETADO PON LOS SIGUIENTES COMANDOS:

        npm install bcryptjs bootswatch cookie-parser ejs express express-myconnection express-session morgan multer mysql mysql2 router zephyr

        npm install nodemon -D

    CON ELLO EL PROYECTO YA DEBERIA ESTAR LISTO PARA DESPLEGARSE EN TU
    ENTORNO LOCAL, SOLO COMPRUEBA QUE EN EL ARCHIVO "package.json",
    LA SECCIÓN DE "scripts" SE VEA ASÍ:
        "scripts": {
            "start": "node src/app.js",
            "dev": "nodemon src/app.js"
        },
    
    ESTO ES MUY IMPORTANTE!

------------------------------------------------------------------------------

AHORA PARA QUE EL PROGRAMA PUEDA CONECTARSE A MYSQL NECESITAMOS IMPORTAR LA BASE DE DATOS:
    PARA ELLO NECESITAMOS TENER MYSQL INSTALADO EN NUESTRO EQUIPO,
    DE PREFERENCIA TENER LA SIGUIENTE RUTA EN EL PATH:
        C:\Program Files\MySQL\MySQL Server 8.0\bin
        PUEDE VARIAR DEPENDIENDO DE LA VERSION DE TU MYSQL.
    EN CASO DE NO TENERLA EN EL PATH, TENDREMOS QUE ESPECIFICAR TODA LA RUTA.

    DENTRO DE LA MISMA TERMINAL EN LA QUE ESTABAMOS ANTERIORMENTE, ENTRAREMOS A
    "db" CON EL COMANDO:

        cd db

    UNA VEZ ADENTRO PONDREMOS EL SIGUIENTE COMANDO:

    "\Program Files\MySQL\MySQL Server 8.0\bin\"mysql -u {tuusuario} -p{tucontraseña} < db.sql

    AHORA RETROCEDEREMOS DE DIRECTORIO CON:

        cd ..

    Y LISTO, SI TODO SALIÓ BIEN AHORA PUEDES DESPLEGAR Y USAR CODECONNECT
    CON EL COMANDO "npm run dev" 