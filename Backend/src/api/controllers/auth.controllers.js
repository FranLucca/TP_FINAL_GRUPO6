import UsuarioModel from "../models/usuario.models.js";

import bcrypt from "bcrypt";

// Vista login
export const vistaLogin = (req, res) => {
    res.render("login", {
        title: "Login Admin",
        about: "Introduzca sus credenciales"
    })
}

// Login usuario admin
export const loginUserAdmin = async (req, res) => {
    try {

        /* Podemos recibir los datos de email y password de login.ejs ya como un objeto
        app.use(express.urlencoded({extended: true}));*/
        const { email, password } = req.body;

        // Evitamos una consulta innecesaria a la BBDD
        if (!email || !password) {
            return res.render("login", {
                title: "Login Admin",
                about: "Introduzca sus credenciales",
                error: "Todos los campos son obligatorios"
            });
        }

        // Traemos solamente el usuario administrador que tenga ese email
        const [rows] = await UsuarioModel.selectAdminUser(email);
        console.log(rows);


        // Si no existe el usuario admin
        if (rows.length === 0) {
            return res.render("login", {
                title: "Login Admin",
                about: "Introduzca sus credenciales",
                error: "No existe usuario admin"
            });
        }

        // En caso de que exista el usuario, lo guardo en la variable user
        const user = rows[0];

        // Comparamos si la contraseña ingresada coincide con el hash guardado en la BBDD
        const match = await bcrypt.compare(password, user.password);
        console.log(match);

        if (match) {
            // Si coinciden los passwords hasheados

            // Guardo la sesion
            req.session.user = {
                id: user.id,
                name: user.nombre,
                email: user.email
            }

            // Guardada la sesion, redirijo al panel de administracion
            return res.redirect("/admin");

        } else {
            // Si no coinciden los passwords hasheados
            return res.render("login", {
                title: "Login Admin",
                about: "Introduzca sus credenciales",
                error: "Contraseña invalida"
            });

        }

    } catch (error) {
        console.log("Error en el login: ", error);

        res.status(500).json({
            message: "Error interno del servidor al hacer login"
        });
    }
}

// Logout admin
export const logoutUserAdmin = (req, res) => {

    // Destruimos la sesion existente
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al destruir la sesion: ", err);
            return res.status(500).json({
                message: "Error al destruir la sesion"
            });
        }

        // Eliminada la sesion, redirigimos a login
        res.redirect("/login");
    });
}
