<template>
  <div class='background'>
    <canvas ref='canvas'></canvas>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

const MIN_SPEED: number = 0.1;
const MAX_SPEED: number = 1;
const FLARE_COUNT: number = 8;
const PARTICLE_COUNT: number = 48;

class Flare {
  private x: number = 0;
  private y: number = 0;
  private size: number = 0;
  private speedX: number = 0;
  private speedY: number = 0;
  private canvas: Background;

  constructor(_canvas: Background) {
    this.canvas = _canvas;

    this.x = ~~(Math.random() * _canvas.sizeX)
    this.y = ~~(Math.random() * _canvas.sizeY);
    this.speedX = MIN_SPEED + Math.round(Math.random() * (MAX_SPEED - MIN_SPEED))
    this.speedY = MIN_SPEED + Math.round(Math.random() * (MAX_SPEED - MIN_SPEED));
    this.size = 5 * 100;
  }

  update(delta: number): void {
    this.x += this.speedX * delta / 10;
    this.y += this.speedY * delta / 10;

    if (this.x > this.canvas.sizeX) {
      this.speedX *= -1;
      this.x = this.canvas.sizeX
    }

    if (this.x < 0) {
      this.speedX *= -1;
      this.x = 0;
    }

    if (this.y > this.canvas.sizeY) {
      this.speedY *= -1;
      this.y = this.canvas.sizeY;
    }

    if (this.y < 0) {
      this.speedY *= -1;
      this.y = 0;
    }

    this.draw();
  }

  draw(): void {
    const gradient = this.canvas.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, "#1495db55");
    gradient.addColorStop(1, "transparent");

    this.canvas.context.fillStyle = gradient;

    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x, this.y, this.size, 0, 3600);
    this.canvas.context.fill();
    this.canvas.context.closePath();
  }
}

class Particle {
  private x: number = 0;
  private y: number = 0;
  private size: number = 4;
  private speedX: number = 0;
  private speedY: number = 0;
  private canvas: Background;
  private opacity: number = 1;
  
  private pulsating: boolean = true;

  constructor(_canvas: Background) {
    this.canvas = _canvas;

    this.x = Math.random() * _canvas.sizeX;
    this.y = Math.random() * _canvas.sizeY;
    this.speedX = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED) / 2;
    this.speedY = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED) / 2;

    this.pulsating = Boolean(~~(Math.random() * 1));
    this.opacity = (Math.random() * 1000 - 1) / 1000;
    this.size = ~~(Math.random() * 8);
  }

  update(delta: number): void {
    this.x += this.speedX * delta / 10;
    this.y += this.speedY * delta / 10;

    if (this.x > this.canvas.sizeX || this.x < 0 || this.y > this.canvas.sizeY || this.y < 0) {
      this.x = Math.random() * this.canvas.sizeX;
      this.y = Math.random() * this.canvas.sizeY;

      this.pulsating = Boolean(~~(Math.random() * 1));
      this.size = ~~(Math.random() * 8);
    }

    if (this.pulsating) {
      this.opacity -= 0.01;
      if (this.opacity <= 0.1) {
        this.pulsating = false;
      }
    } else {
      this.opacity += 0.02;
      if (this.opacity >= 1) {
        this.pulsating = true;
      }
    }

    this.draw();
  }

  draw(): void {
    this.canvas.context.fillStyle = `rgba(255, 255, 255, ${this.opacity - 0.3333})`;

    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x, this.y, this.size, 0, 3600);
    this.canvas.context.fill();
    this.canvas.context.closePath();
  }
}

class Background {
  public sizeX = 0;
  public sizeY = 0;
  public context: CanvasRenderingContext2D;

  private canvas: HTMLCanvasElement;
  private flares: Flare[] = [];
  private particles: Particle[] = [];

  constructor(element: HTMLCanvasElement) {
    this.canvas = element;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.refreshSize();

    for (let i = 0; i < FLARE_COUNT; i++)
      this.flares.push(new Flare(this));

    for (let i = 0; i < PARTICLE_COUNT; i++)
      this.particles.push(new Particle(this));

    new ResizeObserver(() => {
      this.refreshSize();
    }).observe(element);
  }

  refreshSize(): void {
    this.sizeX = this.canvas.clientWidth;
    this.sizeY = this.canvas.clientHeight;
    this.context.canvas.width = this.sizeX;
    this.context.canvas.height = this.sizeY;
  }

  update(delta: number): void {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.save();
      for (const flare of this.flares)
        flare.update(delta);
    this.context.restore();

    this.context.save();
      for (const particle of this.particles)
        particle.update(delta);
    this.context.restore();
  }
}

export default Vue.extend({
  data: () => ({
    exists: true
  }),
  mounted() {
    let last: number = new Date().getTime();

    const bg: Background = new Background(this.$refs.canvas as HTMLCanvasElement);

    const update = (): void => {
      if (!this.exists) return;

      const now: number = new Date().getTime();

      bg.update(now - last);
      last = now;

      window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  },
  beforeDestroy() {
    this.exists = false;
  }
});
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: -1;

  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.background::before {
  content: '';
  background: url('../../assets/images/background.jpg') no-repeat center/cover;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.015;
}

@media (prefers-reduced-motion) {
  .background canvas {
    display: none;
  }
}
</style>