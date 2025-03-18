import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

const Countdown = ({ deadline }: { deadline: string }) => {
  const calculateTimeLeft = () => {
    // Convertir el deadline a la zona horaria local del visitante

    const eventTime = DateTime.fromISO(deadline, { zone: "Europe/Madrid" }); // Tiempo base en España

    const localTime = eventTime.setZone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const now = DateTime.now(); // Hora actual del visitante
    const diff = localTime.diff(now, ["days", "hours", "minutes", "seconds"]);

    if (diff.toMillis() <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        live: true,
      };
    }

    const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    return {
      days: formatNumber(Math.floor(diff.days)),
      hours: formatNumber(Math.floor(diff.hours)),
      minutes: formatNumber(Math.floor(diff.minutes)),
      seconds: formatNumber(Math.floor(diff.seconds)),
      live: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.live) {
    return (
      <>
        <h2 className='text-4xl font-bold text-accent'>¡Estamos en vivo!</h2>
        <div className='flex flex-col gap-10 justify-center items-center w-full text-5xl font-bold text-accent'>
          <div className='absolute rounded-xl rotate-1 bg-black/10 w-[310px] h-[160px] md:w-[360px] md:h-[260px] lg:w-[410px] lg:h-[360px] xl:w-[710px] xl:h-[360px]'>
            {" "}
          </div>
          <iframe
            src='https://www.youtube.com/embed/sfRyaOwKc4c'
            title='Masterclass martes 18 - Cuídate ahora'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            className='z-10 rounded-xl shadow-lg w-[300px] h-[150px] md:w-[350px] md:h-[250px] lg:w-[400px] lg:h-[300px] xl:w-[700px] xl:h-[350px]'
          ></iframe>
        </div>
      </>
    );
  }

  const unidades = ["Días", "Horas", "Minutos", "Segundos"]; // Traducción de las unidades

  return (
    <div className='flex flex-wrap gap-2 justify-center items-center w-full md:gap-4 lg:gap-6 count-down-main'>
      {["days", "hours", "minutes", "seconds"].map((unit, index) => (
        <div
          key={index}
          className='timer flex flex-col items-center bg-accent/50 border border-secondary rounded-xl shadow-lg py-2 px-4 min-w-[60px] max-w-[80px] md:min-w-[80px] md:max-w-[100px] lg:min-w-[100px] lg:max-w-[120px]'
        >
          <div className='flex justify-center items-center w-full text-center'>
            <h3
              className={`countdown-element ${unit} font-manrope font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFFFFF] tracking-widest`}
            >
              {timeLeft[unit as keyof typeof timeLeft]}
            </h3>
          </div>
          <p className='mt-1 text-xs font-medium tracking-wide uppercase sm:text-sm md:text-base text-whit glow-text'>
            {unidades[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
