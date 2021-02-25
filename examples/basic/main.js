import Particles from "../../src/Particles";

const node = document.getElementById("particles");

const particles = new Particles(node, {
  particles: {
    amount: 100, // number
    color: "#fff", // string
    createStrategy: "random", // 'random'
  },
  renderer: {
    transparentBackground: false, // boolean
    backgroundColor: "#186cb6", // string
    width: window.innerWidth, // string
    height: window.innerHeight, // string
  },
});
