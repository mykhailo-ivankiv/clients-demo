/**
 * @type {import('@remix-run/dev').AppConfig}
 */
exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  serverModuleFormat: 'cjs',
  tailwind: true,
  browserNodeBuiltinsPolyfill: {
    modules: {
      util: true,
    },
  },
}
