// Taken from P5 website: https://p5js.org/examples/simulate-particles.html

import React, { useState } from "react";
import Sketch from "react-p5/";
import "../styles/p5sketch.scss";

function ParticleSystem({ userName }) {
  // an array to add multiple particles
  // let particles = [];
  const [particles, setParticles] = useState([]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    // this class describes the properties of a single particle.
    class Particle {
      // setting the co-ordinates, radius and the
      // speed of a particle in both the co-ordinates axes.
      constructor() {
        this.x = p5.random(0, p5.width);
        this.y = p5.random(0, p5.height);
        this.r = p5.random(1, 8);
        this.xSpeed = p5.random(-2, 2);
        this.ySpeed = p5.random(-1, 1.5);
        this.color = p5.color(
          p5.random(0, 255),
          p5.random(0, 255),
          p5.random(0, 255)
        );
      }

      // creation of a particle.
      createParticle() {
        const randomR = p5.random(0, 255);
        const randomG = p5.random(0, 255);
        const randomB = p5.random(0, 255);

        const rgbString =
          "rgb(" + randomR + ", " + randomG + ", " + randomB + "";
        p5.noStroke();
        p5.fill(this.color);
        p5.circle(this.x, this.y, this.r);
      }

      // setting the particle in motion.
      moveParticle() {
        if (this.x < 0 || this.x > p5.width) this.xSpeed *= -1;
        if (this.y < 0 || this.y > p5.height) this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
      }

      // this function creates the connections(lines)
      // between particles which are less than a certain distance apart
      joinParticles(particles) {
        particles.forEach((element) => {
          let dis = p5.dist(this.x, this.y, element.x, element.y);
          if (dis < 85) {
            p5.stroke("rgba(255,255,255,0.04)");
            // p5.line(this.x, this.y, element.x, element.y);
          }
        });
        // setParticles(particles);
      }
    }

    // createCanvas(720, 400);
    let newParticles = [];
    for (let i = 0; i < p5.width / 10; i++) {
      newParticles.push(new Particle());
    }
    setParticles((prevState) => [...prevState, ...newParticles]);
  };

  const draw = (p5) => {
    p5.background("#0f0f0f");
    p5.textSize(((p5.width + p5.height) * 0.4) / userName.length);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.stroke("rgba(220,220,220,0.6)");
    // letterFill.p5.setAlpha(120);
    p5.fill("rgba(220,220,220,0.1)");
    p5.text(userName, p5.width / 2, p5.height / 2);
    for (let i = 0; i < particles.length; i++) {
      //   const randomR = p5.random(0, 255);
      //   const randomG = p5.random(0, 255);
      //   const randomB = p5.random(0, 255);

      //   p5.fill(randomR, randomG, randomB, 0.5);
      particles[i].createParticle();
      particles[i].moveParticle();
      //   particles[i].joinParticles(particles.slice(i));
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}

export default ParticleSystem;
