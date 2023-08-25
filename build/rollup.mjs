import { readFileSync } from 'fs'
import typescript from '@rollup/plugin-typescript'

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf8'}))
const className = pkg.name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())

const external = Object.keys(pkg.dependencies || [])
const plugins = [typescript()]

// ------------------------------
// Builds
// ------------------------------
function defaults (config) {
  const defaults = { plugins, external }

  config.output = config.output.map(output => Object.assign(
    {
      sourcemap: false,
      name: className,
    },
    output
  ))

  return Object.assign({}, defaults, config)
}

export default [
  defaults({
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' },
    ],
  }),
]
