import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ChevronDown } from "lucide-react";
import raffleConfig from "../config/raffleConfig";

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeExperience({ onComplete, onSkip }) {
  const rootRef = useRef(null);
  const completionRef = useRef(false);

  useGSAP(
    () => {
      const welcome = "[data-scene='welcome']";
      const experience = "[data-scene='experience']";
      const prize = "[data-scene='prize']";
      const finalScene = "[data-scene='final']";

      const words = gsap.utils.toArray("[data-welcome-word]");

      gsap.set([welcome, experience, prize, finalScene], {
        autoAlpha: 0,
      });

      gsap.set(welcome, {
        autoAlpha: 1,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,

          onLeave: () => {
            if (!completionRef.current) {
              completionRef.current = true;
              onComplete();
            }
          },
        },
      });

      timeline
        // Primera escena
        .fromTo(
          words,
          {
            yPercent: 120,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.025,
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .fromTo(
          "[data-welcome-copy]",
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.4,
          },
        )
        .to(welcome, {
          autoAlpha: 0,
          scale: 0.88,
          filter: "blur(10px)",
          duration: 0.5,
        })

        // Segunda escena
        .fromTo(
          experience,
          {
            autoAlpha: 0,
            y: 80,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
          },
        )
        .to(experience, {
          autoAlpha: 0,
          y: -70,
          filter: "blur(8px)",
          duration: 0.5,
        })

        // Escena del premio
        .fromTo(
          prize,
          {
            autoAlpha: 0,
            scale: 0.75,
          },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
        )
        .to(prize, {
          autoAlpha: 0,
          scale: 1.12,
          filter: "blur(10px)",
          duration: 0.5,
        })

        // Escena final
        .fromTo(
          finalScene,
          {
            autoAlpha: 0,
            y: 80,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
          },
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [onComplete],
    },
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[500vh] bg-dcabra-primary text-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 welcome-mesh" />

        {/* Escena 1: bienvenida */}
        <div
          data-scene="welcome"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <img
            src={raffleConfig.logo}
            alt="D'Cabra"
            className="mb-7 h-24 w-24 rounded-2xl object-cover shadow-2xl"
          />

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-dcabra-gold">
            Una experiencia D'Cabra
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-none md:text-7xl">
            {raffleConfig.welcomeTitle.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden pr-[0.22em] pb-2"
              >
                <span
                  data-welcome-word
                  className="inline-block opacity-0"
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-welcome-copy
            className="mt-6 max-w-xl text-white/70 opacity-0"
          >
            Hoy la suerte elegirá a uno de nuestros participantes.
          </p>
        </div>

        {/* Escena 2: mensaje */}
        <div
          data-scene="experience"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-dcabra-gold">
            Todos tienen la misma oportunidad
          </p>

          <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight md:text-7xl">
            Una ruleta.
            <br />
            Una oportunidad.
            <br />
            Un gran ganador.
          </h2>
        </div>

        {/* Escena 3: premio */}
        <div
          data-scene="prize"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-dcabra-gold">
            El ganador se llevará
          </p>

          <div className="mt-6 rounded-[2rem] bg-white/10 p-6 backdrop-blur-md">
            <img
              src={raffleConfig.prizeImage}
              alt={raffleConfig.prizeName}
              className="mx-auto max-h-60 rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <h2 className="mt-6 text-3xl font-black uppercase md:text-5xl">
            {raffleConfig.prizeName}
          </h2>

          <p className="mt-3 text-white/70">
            {raffleConfig.prizeDescription}
          </p>
        </div>

        {/* Escena 4: final */}
        <div
          data-scene="final"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-dcabra-gold">
            Todo está preparado
          </p>

          <h2 className="mt-5 text-5xl font-black uppercase md:text-8xl">
            Que comience
            <br />
            el sorteo
          </h2>

          <p className="mt-6 text-white/65">
            Sigue deslizando para ingresar a la ruleta.
          </p>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="absolute right-5 top-5 z-20 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md"
        >
          Saltar presentación
        </button>
      </div>
    </section>
  );
}
