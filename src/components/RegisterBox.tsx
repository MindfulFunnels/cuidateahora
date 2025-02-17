import React, { useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import clientData from "../data/config";

const { secureMessage } = clientData;

export default function RegisterBox() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState<string>(""); // Estado para el número de celular
  const [errorMessages, setErrorMessages] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el spinner

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Validar los valores de las referencias
    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";

    if (!name || !email) {
      setErrorMessages("Por favor, rellena todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessages("Por favor, ingresa un email válido");
      return;
    }

    setIsSubmitting(true); // Mostrar el spinner

    const capitalizeFirstLetter = (word: string): string => {
      return word
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    const capitalizedName = capitalizeFirstLetter(name);

    console.log(capitalizedName);

    try {
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: capitalizedName,
          email: email.toLowerCase(),
          phone,
        }),
      });

      if (userRes.ok) {
        const emailRes = await fetch("/api/sendEmails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: capitalizedName,
            email: email.toLowerCase(),
          }),
        });
        if (!emailRes.ok) {
          setErrorMessages(
            "Verifica que tu correo sea correcto y vuelve a intentarlo"
          );
          setIsSubmitting(false); // Ocultar el spinner
          return;
        }
        window.location.href = "/thanks";
      } else {
        window.location.href = "/thanks";
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMessages(
        "Hubo un error al procesar tu solicitud. Intenta nuevamente."
      );
      setIsSubmitting(false);
    }
  };
  return (
    <div className='text-left text-white'>
      {/* <h2 className='text-4xl font-bold text-center text-white ' id='register'>
        Registrate
      </h2> */}
      <form
        className='flex flex-col gap-6 p-6 rounded-lg shadow-lg w-full max-w-[500px] items-center justify-center mx-auto '
        id='register'
      >
        <input
          ref={nameRef}
          type='text'
          id='name'
          name='name'
          required
          placeholder='Tu nombre y apellido*'
          className='w-full p-4 text-lg border rounded-lg border-primary bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-secondary'
        />
        <input
          ref={emailRef}
          type='email'
          id='email'
          name='email'
          required
          placeholder='Tu email*'
          className='w-full p-4 text-lg border rounded-lg border-primary bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-secondary'
        />

        <PhoneInput
          country={"es"}
          value={phone}
          onChange={setPhone}
          inputProps={{
            name: "phone",
            required: false,
          }}
          localization={{
            es: "España",
            ar: "Argentina",
            mx: "México",
            us: "Estados Unidos",
            fr: "Francia",
            br: "Brasil",
            de: "Alemania",
            co: "Colombia",
            cl: "Chile",
            pe: "Perú",
            ve: "Venezuela",
            // Agrega más países según sea necesario
          }}
          placeholder='+123456789'
          enableSearch={true} // Habilitar búsqueda
          containerStyle={{
            width: "100%",
            background: "#c66271", // Fondo uniforme
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #e4b4bb", // Borde con color consistente
            transition: "box-shadow 0.3s ease-in-out", // Suavizar el focus
          }}
          searchPlaceholder='Buscar' // Placeholder del campo de búsqueda
          countryCodeEditable={true} // No permitir editar el prefijo
          inputStyle={{
            width: "100%",
            padding: "16px",
            paddingLeft: "60px", // Deja espacio para mostrar el prefijo
            fontSize: "18px",
            backgroundColor: "#c66271", // Mismo fondo que los inputs
            color: "#FFF", // Texto consistente con el diseño
            border: "none",
            borderRadius: "8px",
            outline: "none",
          }}
          buttonStyle={{
            backgroundColor: "#c66271", // Fondo uniforme
            border: "none",
            borderRight: "1px solid #e4b4bb", // Separador del dropdown
            borderRadius: "8px",
            width: "50px", // Tamaño suficiente para el prefijo
            justifyContent: "left",
          }}
          dropdownStyle={{
            // backgroundColor: "#e4b4bb", // Fondo del dropdown
            color: "#000000", // Texto consistente
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
          }}
          searchStyle={{
            // backgroundColor: "#e4b4bb", // Fondo del campo de búsqueda
            color: "#000000", // Texto del campo de búsqueda
            border: "1px solid #e4b4bb",
            borderRadius: "8px",
            padding: "2px",
          }}
        />
        <p className='text-black text-[10px]'>
          Por favor, ingresa el prefijo de tu país
        </p>
        {errorMessages && (
          <p className='text-red-600 text-[10px] text-center'>
            {errorMessages}
          </p>
        )}

        {isSubmitting ? (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='inline w-10 h-10 text-gray-200 animate-spin-clockwise-infinite dark:text-gray-600 fill-red-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              ></path>
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              ></path>
            </svg>
          </div>
        ) : (
          // <button
          //   type='submit'
          //   className='w-full px-10 py-4 text-lg font-semibold text-white transition-transform duration-300 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105'
          //   onClick={handleSubmit}
          // >
          //   Registrarme
          // </button>
          <button
            type='submit'
            className='w-full px-10 py-4 text-lg font-semibold text-white transition-transform duration-700 from-[#ff0000] to-[#ff5e00] rounded-lg bg-gradient-to-t hover:bg-gradient-to-br hover:from-[#ff5e00] hover:to-[#ff0000] hover:scale-105'
            onClick={handleSubmit}
          >
            Registrarme
          </button>
        )}
        <p className='text-center text-[10px] text-black'>{secureMessage}</p>
      </form>
    </div>
  );
}
