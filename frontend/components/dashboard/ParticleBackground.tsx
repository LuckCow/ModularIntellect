import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

const particlesInit = async (main: Engine) => {
  await loadFull(main);
};

const ParticleBackground: React.FC = () => {
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
          fpsLimit: 60,
          smooth: true,
        fullScreen: {
          enable: true,
          zIndex: 1,
        },
        particles: {
          number: {
            value: 150,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#fff',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 1,
            random: false,
            anim: {
              enable: false,
            },
          },
          size: {
            value: {
              min: 0.2,
              max: 1.2,
            },
            random: true,
            anim: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: 5,
            direction: 'bottom',
            random: false,
            straight: true,
            out_mode: 'out',
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
            trail: {
              fillColor: "#000",
              length: 50,
              enable: true
            }
          },
        },
        retina_detect: true,
        background: {
          color: '#111',
          image: '',
          position: '50% 50%',
          repeat: 'no-repeat',
          size: 'cover',
        },
      }}
    />
  );
};

export default ParticleBackground;
