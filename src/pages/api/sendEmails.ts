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
      sender: { name: "Lucía Martínez", email: "cuidateahora1@gmail.com" },
      to: [{ email, name }],
      subject: `¡Bienvenido/a a "EVENTO YOGA CUÍDATE AHORA"! 🌿🧘‍♀️`,
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
            font-family: Georgia, 'Times New Roman', Times, serif; 
            background-color: #ffffff;  
            color: #000000;                              
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #FFFFFF;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .saludo {
            font-size: 2.5rem;
            font-weight: bold;            
            margin-bottom: 20px;
            color: #c66271;        
            text-align: center;    
        }   
        .subtitle {
            font-size: 1.2rem;            
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
        <h1 class="saludo">¡Hola ${name}</span>! 👋</h1>        
        <p class="subtitle">Tu camino hacia el bienestar y la serenidad ha comenzado. Bienvenido/a a EVENTO YOGA CUÍDATE AHORA, el espacio donde descubrirás cómo alcanzar una plenitud integral y reconectar con tu paz interior a través del yoga y mindfulness.</p>
        <div>
            <p>📅 Fecha del evento: Martes 11 y Jueves 13 de Marzo 2025</p>
            <p>
                ⏰ Hora: 🇪🇸 19:00 Hs - 🇦🇷 15:00 Hs - 🇨🇴 13:00 Hs - 🇲🇽 12:00 Hs - 🇺🇸 13:00 Hs
            </p>
            <p>
                📍 Acceso: Online (el enlace para unirte se enviará pronto)
            </p>
        </div>
        <div>
            <h3>¿Qué te espera en EVENTO YOGA CUÍDATE AHORA? </h3>
            <ul>
                <li>
                    🌸 Profundizar en prácticas avanzadas de yoga para mejorar tu flexibilidad y equilibrio. 
                </li>
                <li>
                    🌱 Técnicas de mindfulness para reducir el estrés y mejorar tu concentración. 
                </li>
                <li>
                    🌟 Sesiones interactivas que te ayudarán a conectar con tu yo interior y mejorar tu calidad de vida.
                </li>
                <li>
                    🙌 Herramientas prácticas para integrar lo aprendido en tu vida diaria y mantener tu bienestar.
                </li>
            </ul>
        </div>
        <h2>
            Este evento no es solo una evento, es una experiencia transformadora. 🚀
        </h2>
        <h3>
            🔔 IMPORTANTE: Para que aproveches al máximo esta oportunidad:
        </h3>
        <ul>
            <li>✅ Únete al grupo privado de WhatsApp para recibir contenido exclusivo y prepararte antes del evento 👉 [Link para unirse] </li>
            <li>✅ Añade el evento a tu calendario para no olvidarlo.</li>
            <li>✅ Estate atento/a a tu correo y a la comunidad de WhatsApp donde te enviaremos más detalles y materiales antes del evento.</li>            
        </ul>
        <p>
            ⚠️ Prepárate para transformar tu enfoque hacia la salud y el bienestar.
        </p>        
        <h2>
            Saludos cordiales, Lucía
        </h2>
        <div class="footer">
            <p>
                © 2025 Made by <span class='font-extrabold'>MindFul Funnels</span> - <span
                  class='font-extrabold'>Cuídate Ahora</span
                >
              </p>
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
