// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    examples: { url: "/", static: true, resolve: false },
    src: { url: "/src", static: false, resolve: true },
  },
  plugins: [],
  packageOptions: {},
  devOptions: {},
  buildOptions: {},
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
    manifest: false,
    entrypoints: ['./src/Particles.js'],
    splitting: true,
    treeshake: true,
  },
}
