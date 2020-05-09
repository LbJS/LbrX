
/**
 * @returns {import('rollup').RollupOptions}
 */
export function getRollupBaseOptions() {
  return {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      sourcemapPathTransform: (str) => str.substring(3),
    },
    external: [
      'rxjs',
      'rxjs/operators'
    ],
    plugins: []
  }
}
