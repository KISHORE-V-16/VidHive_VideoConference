
'use client'
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import {} from  '../asserts/Insta.jpg';

export const ParticleBgnew = () => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "black",
        },
      },
      fpsLimit: 100,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 8,
          },
          repulse: {
            distance: 100,
            duration: 1,
          },
          bubble: {
            distance: 100,
            size: 1,
            duration: 0.3,
            opacity: 0.5,
            speed: 10
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        bubble: {
          color: "#ffffff",
          distance: 100,
          enable: true,
          opacity: 0.35,
          width: 2,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 250,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
          image: {
            src: '../assets/Insta.jpg',
            width: 160,
            height: 160
          }
        },
        size: {
          value: { min: 5, max: 10 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        style={{zIndex: 100}}
      />
    );
  }

  return <></>;
};