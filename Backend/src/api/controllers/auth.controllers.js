import UsuarioModel from "../models/usuario.models.js"; // Importa el modelo que contiene las consultas a la tabla de usuarios

import bcrypt from "bcrypt"; // Importa bcrypt, biblioteca utilizada para comparar y generar hashes de contraseñas

// VISTA LOGIN
export const vistaLogin = (req, res) => { // Controlador que recibe la solicitud y responde mostrando la vista de inicio de sesión
    res.render("login", { // Renderiza la vista login.ejs y le envía los datos necesarios
        title: "Login Admin", // Envía el título que utilizará la vista
        about: "Introduzca sus credenciales" // Envía el texto descriptivo de la pantalla
    })
}

// LOGIN USUARIO ADMIN
export const loginUserAdmin = async (req, res) => { // Controlador asíncrono que procesa el inicio de sesión del administrador
    try {

        /* Podemos recibir los datos de email y password de login.ejs ya como un objeto
        app.use(express.urlencoded({extended: true}));*/
        const { email, password } = req.body; // Obtiene y desestructura el email y la contraseña enviados desde el formulario

        // EVITAMOS UNA CONSULTA INNECESARIA A LA BBDD
        if (!email || !password) { // Comprueba si alguno de los campos está vacío o no fue enviado
            return res.render("login", { // Vuelve a mostrar la vista de login con un mensaje de error
                title: "Login Admin", // Envía nuevamente el título de la pantalla
                about: "Introduzca sus credenciales", // Envía el texto descriptivo
                error: "Todos los campos son obligatorios" // Envía el mensaje que informa que deben completarse los campos
            });
        }

        // TRAEMOS SOLAMENTE EL USUARIO ADMINISTRADOR QUE TENGA ESE EMAIL
        const [rows] = await UsuarioModel.selectAdminUser(email); // Ejecuta la consulta del modelo para buscar el usuario por email y espera su resultado
        console.log(rows); // Muestra en la consola los resultados obtenidos de la consulta

        // SI NO EXISTE EL USUARIO ADMIN
        if (rows.length === 0) { // Comprueba si la consulta no encontró ningún usuario
            return res.render("login", { // Vuelve a mostrar la vista de inicio de sesión
                title: "Login Admin", // Envía el título de la pantalla
                about: "Introduzca sus credenciales", // Envía el texto descriptivo
                error: "No existe usuario admin" // Informa que no existe un usuario registrado con ese email
            });
        }

        // EN CASO DE QUE EXISTA EL USUARIO, LO GUARDO EN LA VARIABLE USER
        const user = rows[0]; // Obtiene el primer usuario del resultado de la consulta

        // COMPARAMOS SI LA CONTRASEÑA INGRESADA COINCIDE CON EL HASH GUARDADO EN LA BBDD
        const match = await bcrypt.compare(password, user.password); // Compara la contraseña ingresada con el hash almacenado en la base de datos
        console.log(match); // Muestra en la consola true o false según coincidan las contraseñas

        if (match) { // Comprueba si la contraseña ingresada coincide con la almacenada

            // SI COINCIDEN LOS PASSWORDS HASHEADOS

            // GUARDO LA SESION
            req.session.user = { // Crea un objeto dentro de la sesión para identificar al usuario autenticado
                id: user.id, // Guarda el identificador del usuario
                name: user.nombre, // Guarda el nombre del usuario
                email: user.email // Guarda el email del usuario
            }

            // GUARDADA LA SESION, REDIRIJO AL PANEL DE ADMINISTRACION
            return res.redirect("/admin"); // Redirige al administrador al panel de administración

        } else {
            // SI NO COINCIDEN LOS PASSWORDS HASHEADOS
            return res.render("login", { // Vuelve a mostrar la pantalla de inicio de sesión
                title: "Login Admin", // Envía el título de la pantalla
                about: "Introduzca sus credenciales", // Envía el texto descriptivo
                error: "Contraseña invalida" // Informa que la contraseña ingresada no es válida
            });

        }

    } catch (error) {
        console.log("Error en el login: ", error); // Muestra en la consola el error ocurrido durante el inicio de sesión

        res.status(500).json({ // Responde con el código HTTP 500, que indica un error interno del servidor
            message: "Error interno del servidor al hacer login" // Envía un mensaje describiendo el error
        });
    }
}

// LOGOUT ADMIN
export const logoutUserAdmin = (req, res) => { // Controlador que se encarga de cerrar la sesión del administrador

    // DESTRUIMOS LA SESION EXISTENTE
    req.session.destroy((err) => { // Destruye la sesión actual y ejecuta una función cuando termina la operación
        if (err) { // Comprueba si ocurrió un error al intentar destruir la sesión
            console.log("Error al destruir la sesion: ", err); // Muestra el error en la consola
            return res.status(500).json({ // Envía una respuesta HTTP 500 si no se pudo destruir la sesión
                message: "Error al destruir la sesion" // Informa que ocurrió un error al cerrar la sesión
            });
        }

        // ELIMINADA LA SESION, REDIRIGIMOS A LOGIN
        res.redirect("/login"); // Redirige al usuario a la pantalla de inicio de sesión
    });
}

// VISTA SIGNUP
export const vistaSignUp = (req, res) => { // Controlador que muestra la pantalla de registro de administradores
    res.render("signUp", { // Renderiza la vista signUp.ejs y le envía los datos necesarios
        title: "SignUp Admin", // Envía el título de la pantalla de registro
        about: "Introduzca sus credenciales" // Envía el texto descriptivo de la pantalla
    })
}

// REGISTRAR USUARIO ADMIN
export const signUpUserAdmin = async (req, res) => { // Controlador asíncrono que procesa el registro de un nuevo administrador
    try {

        const { nombre, email, password } = req.body; // Obtiene y desestructura los datos enviados desde el formulario de registro

        if (!nombre || !email || !password) { // Comprueba si alguno de los campos obligatorios está vacío o no fue enviado
            return res.render("signUp", { // Vuelve a mostrar la pantalla de registro con un mensaje de error
                title: "SignUp Admin", // Envía el título de la pantalla
                about: "Introduzca sus credenciales", // Envía el texto descriptivo
                error: "Todos los campos son obligatorios" // Informa que deben completarse todos los campos
            });
        }

        // TRAEMOS SOLAMENTE EL USUARIO ADMINISTRADOR QUE TENGA ESE EMAIL
        const [rows] = await UsuarioModel.selectAdminUser(email); // Consulta si ya existe un usuario registrado con el email ingresado
        console.log(rows); // Muestra en la consola el resultado de la consulta

        // SI EXISTE EL USUARIO ADMIN
        if (rows.length > 0) { // Comprueba si la consulta encontró uno o más usuarios
            return res.render("signUp", { // Vuelve a mostrar la pantalla de registro
                title: "SignUp Admin", // Envía el título de la pantalla
                about: "Email ya registrado", // Envía un texto indicando que el email ya está registrado
                error: "Usuario ya existente con este email" // Informa que no se puede registrar otro usuario con el mismo email
            });
        }

        // HASHEAMOS LA CONTRASEÑA
        const passwordHasheada = await bcrypt.hash(password, 10); // Genera un hash de la contraseña utilizando bcrypt y un factor de costo de 10

        await UsuarioModel.createAdminUser(nombre, email, passwordHasheada); // Ejecuta el método del modelo para insertar el nuevo usuario en la base de datos

        res.redirect("/admin"); // Redirige al panel de administración después de registrar el usuario

    } catch (error) {
        console.log("Error en el registro: ", error); // Muestra en la consola el error ocurrido durante el registro

        res.status(500).json({ // Responde con el código HTTP 500 si ocurre un error interno
            message: "Error interno del servidor al hacer el registro" // Envía un mensaje describiendo el error
        });
    }
}
