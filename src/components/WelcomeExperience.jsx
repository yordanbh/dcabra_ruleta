import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ChevronDown,
  Gift,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import raffleConfig from "../config/raffleConfig";

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeExperience({ onComplete, onSkip }) {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const completionRef = useRef(false);

  /*
   * Siempre empezamos la presentación desde arriba.
   * Escape permite saltarla.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSkip]);

  useGSAP(
    () => {
      if (!rootRef.current) return undefined;

      const select = gsap.utils.selector(rootRef);

      const welcomeScene = select("[data-scene='welcome']");
      const opportunityScene = select("[data-scene='opportunity']");
      const processScene = select("[data-scene='process']");
      const prizeScene = select("[data-scene='prize']");
      const finalScene = select("[data-scene='final']");

      const scenes = [
        welcomeScene,
        opportunityScene,
        processScene,
        prizeScene,
        finalScene,
      ];

      const words = select("[data-welcome-word]");
      const welcomeCopy = select("[data-welcome-copy]");
      const scrollHint = select("[data-scroll-hint]");

      /*
       * Estado inicial:
       * solo aparece el logo y el texto pequeño.
       * El título permanece oculto hasta comenzar a hacer scroll.
       */
      gsap.set(scenes, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      gsap.set(welcomeScene, {
        autoAlpha: 1,
      });

      gsap.set(words, {
        yPercent: 130,
        autoAlpha: 0,
      });

      gsap.set(welcomeCopy, {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(progressRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },

        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            gsap.set(progressRef.current, {
              scaleY: self.progress,
            });
          },

          onLeave: () => {
            if (completionRef.current) return;

            completionRef.current = true;
            onComplete();
          },
        },
      });

      timeline
        /*
         * ESCENA 1
         * El título aparece palabra por palabra al hacer scroll.
         */
        .to(words, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.055,
          ease: "power3.out",
        })
        .to(
          welcomeCopy,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.35",
        )
        .to(
          scrollHint,
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.25,
          },
          "<",
        )
        .to({}, { duration: 0.35 })
        .to(welcomeScene, {
          autoAlpha: 0,
          scale: 0.92,
          filter: "blur(12px)",
          duration: 0.5,
          ease: "power2.in",
        })

        /*
         * ESCENA 2
         * Participantes y oportunidad.
         */
        .fromTo(
          opportunityScene,
          {
            autoAlpha: 0,
            y: 70,
            filter: "blur(8px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          },
        )
        .fromTo(
          select("[data-opportunity-item]"),
          {
            autoAlpha: 0,
            y: 25,
          },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to({}, { duration: 0.4 })
        .to(opportunityScene, {
          autoAlpha: 0,
          y: -60,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power2.in",
        })

        /*
         * ESCENA 3
         * Funcionamiento del sorteo.
         */
        .fromTo(
          processScene,
          {
            autoAlpha: 0,
            scale: 0.9,
            filter: "blur(8px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          },
        )
        .fromTo(
          select("[data-process-step]"),
          {
            autoAlpha: 0,
            y: 25,
          },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to({}, { duration: 0.4 })
        .to(processScene, {
          autoAlpha: 0,
          scale: 1.08,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power2.in",
        })

        /*
         * ESCENA 4
         * Presentación del premio.
         */
        .fromTo(
          prizeScene,
          {
            autoAlpha: 0,
            scale: 0.82,
            y: 40,
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
            ease: "back.out(1.35)",
          },
        )
        .fromTo(
          select("[data-prize-image]"),
          {
            autoAlpha: 0,
            scale: 0.85,
            rotate: -3,
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .to({}, { duration: 0.5 })
        .to(prizeScene, {
          autoAlpha: 0,
          scale: 1.1,
          filter: "blur(12px)",
          duration: 0.5,
          ease: "power2.in",
        })

        /*
         * ESCENA 5
         * Cierre de la bienvenida.
         */
        .fromTo(
          finalScene,
          {
            autoAlpha: 0,
            y: 70,
            scale: 0.94,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .fromTo(
          select("[data-final-icon]"),
          {
            autoAlpha: 0,
            scale: 0.5,
            rotate: -15,
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.55,
            ease: "back.out(1.8)",
          },
          "-=0.4",
        )
        .to({}, { duration: 0.45 });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [onComplete],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Presentación del sorteo"
      className="relative h-[600vh] bg-dcabra-primary text-white"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Fondo principal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 welcome-mesh opacity-80" />

          <div className="absolute left-1/2 top-1/2 h-[55rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl" />

          <div className="absolute -left-24 top-[12%] h-64 w-64 rounded-full border border-white/10" />

          <div className="absolute -right-32 bottom-[8%] h-96 w-96 rounded-full border border-dcabra-gold/15" />

          <div className="absolute left-[15%] top-[18%] h-2 w-2 rounded-full bg-dcabra-gold/70" />

          <div className="absolute bottom-[18%] right-[18%] h-1.5 w-1.5 rounded-full bg-white/40" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>

        {/* Barra lateral de progreso */}
        <div
          aria-hidden="true"
          className="absolute right-5 top-1/2 z-20 hidden h-28 w-px -translate-y-1/2 overflow-hidden rounded-full bg-white/15 sm:block"
        >
          <div
            ref={progressRef}
            className="h-full w-full bg-dcabra-gold"
          />
        </div>

        {/* Saltar */}
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white/25 hover:bg-white/15 sm:right-6 sm:top-6"
        >
          Saltar presentación

          <ChevronDown size={14} />
        </button>

        {/* ESCENA 1 */}
        <div
          data-scene="welcome"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <div data-welcome-static className="relative">
            <div className="absolute inset-0 rounded-[1.6rem] bg-dcabra-gold/20 blur-2xl" />

            <img
              src={raffleConfig.logo}
              alt="D'Cabra"
              draggable="false"
              className="relative h-20 w-20 rounded-[1.4rem] border border-white/20 object-cover shadow-2xl sm:h-24 sm:w-24"
            />
          </div>

          <div
            data-welcome-static
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-dcabra-gold/20 bg-dcabra-gold/10 px-3 py-1.5"
          >
            <Sparkles size={13} className="text-dcabra-gold" />

            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-dcabra-gold">
              Una experiencia D&apos;Cabra
            </p>
          </div>

          <h1 className="mt-5 max-w-5xl text-[clamp(2.4rem,7vw,6.5rem)] font-black uppercase leading-[0.93] tracking-[-0.04em]">
            {raffleConfig.welcomeTitle.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden pb-2 pr-[0.2em]"
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
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 opacity-0 sm:text-base"
          >
            Hoy la suerte elegirá a uno de nuestros participantes.
            Todo está preparado para vivir un momento especial.
          </p>
        </div>

        {/* ESCENA 2 */}
        <div
          data-scene="opportunity"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
            <Users size={27} className="text-dcabra-gold" />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-dcabra-gold">
            Todos tienen la misma oportunidad
          </p>

          <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,6vw,5.8rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
            Cada nombre
            <br />
            cuenta
          </h2>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              data-opportunity-item
              className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Participación
              </p>

              <p className="mt-1 font-bold text-white">
                Todos participan
              </p>
            </div>

            <div
              data-opportunity-item
              className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Selección
              </p>

              <p className="mt-1 font-bold text-white">
                Totalmente aleatoria
              </p>
            </div>

            <div
              data-opportunity-item
              className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Resultado
              </p>

              <p className="mt-1 font-bold text-white">
                Un gran ganador
              </p>
            </div>
          </div>
        </div>

        {/* ESCENA 3 */}
        <div
          data-scene="process"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
            <Trophy size={27} className="text-dcabra-gold" />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-dcabra-gold">
            Un momento único
          </p>

          <h2 className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)] font-black uppercase leading-[0.96] tracking-[-0.04em]">
            La suerte está
            <br />
            a punto de girar
          </h2>

          <div className="mt-8 flex w-full max-w-xl flex-col gap-2.5 sm:flex-row">
            {[
              ["01", "Cargamos los participantes"],
              ["02", "La ruleta comienza a girar"],
              ["03", "Conocemos al ganador"],
            ].map(([number, text]) => (
              <div
                key={number}
                data-process-step
                className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-left backdrop-blur-md sm:flex-col sm:text-center"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dcabra-gold/15 text-xs font-black text-dcabra-gold">
                  {number}
                </span>

                <p className="text-xs font-semibold leading-snug text-white/80">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ESCENA 4 */}
        <div
          data-scene="prize"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-dcabra-gold/20 bg-dcabra-gold/10 px-3 py-1.5">
            <Gift size={14} className="text-dcabra-gold" />

            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-dcabra-gold">
              El ganador se llevará
            </p>
          </div>

          <div
            data-prize-image
            className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <img
              src={raffleConfig.prizeImage}
              alt={raffleConfig.prizeName}
              draggable="false"
              className="relative mx-auto max-h-[30vh] min-h-40 w-auto rounded-2xl object-contain shadow-xl sm:max-h-[34vh]"
            />
          </div>

          <h2 className="mt-6 max-w-3xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
            {raffleConfig.prizeName}
          </h2>

          {raffleConfig.prizeDescription && (
            <p className="mt-3 max-w-lg text-sm text-white/65 sm:text-base">
              {raffleConfig.prizeDescription}
            </p>
          )}
        </div>

        {/* ESCENA 5 */}
        <div
          data-scene="final"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center opacity-0"
        >
          <div
            data-final-icon
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dcabra-gold/20 bg-dcabra-gold/10"
          >
            <Sparkles size={30} className="text-dcabra-gold" />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.32em] text-dcabra-gold">
            Todo está preparado
          </p>

          <h2 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]">
            Que comience
            <br />
            el sorteo
          </h2>

          <div className="mt-7 flex items-center gap-2 text-sm font-medium text-white/60">
            <span>Sigue deslizando para ingresar</span>
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </div>

        {/* Indicador inicial */}
        <div
          data-scroll-hint
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-7"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">
            Desliza para descubrir
          </span>

          <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dcabra-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}