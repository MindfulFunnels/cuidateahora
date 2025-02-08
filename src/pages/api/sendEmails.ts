import type { APIRoute } from "astro";
import * as dotenv from "dotenv";
import clientData from "../../data/config";

dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = import.meta.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("Clave API de Brevo no está definida");
    }

    const payload = {
      sender: { name: "Lucia Martinez", email: "cuidateahora1@gmail.com" },
      to: [{ email, name }],
      subject: `🧘‍♀️ Descubre el Poder del Yoga: Transforma tu Cuerpo y Mente 🌿✨ - Lucia Martinez`,
      htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    
    <title>Bienvenido a Cuídate Ahora</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #FFEDD8;
            color: #A47148;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #F3D5B5;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #8B5E34;
            margin-bottom: 20px;
        }
        .saludo {
            font-size: 2.5rem;
            font-weight: bold;
            color: #fff;
            margin-bottom: 20px;
        }
        .nombre {
            font-size: 2.5rem;
            font-weight: bold;
            color: #A47148;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #A47148;
            margin-bottom: 20px;
        }
        .cta {
            margin-top: 20px;
        }
        .cta a {
            background-color: #bf8950;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #8B5E34;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="saludo">¡Hola <span class="nombre">${name}</span>!</h1>
        <h1 class="title"> Bienvenido a <br> Cuídate Ahora</h1>
        <p class="subtitle">Tu espacio para el bienestar y el equilibrio.</p>
        <div class="cta">
            <a href="#">Whatsapp</a>
        </div>
        <div class="footer">
            <p>&copy; 2025 Cuídate Ahora - Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
`,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error al enviar correo:", error);
      throw new Error("Error en la API de Brevo");
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ message: "Correo enviado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return new Response(
      JSON.stringify({ error: "Error al enviar el correo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
