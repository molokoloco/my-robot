import alias from '@rollup/plugin-alias';

module.exports = {
  input: 'three/examples/jsm/nodes',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    alias({
      entries: [
        { find: 'three-nodes', replacement: 'three/examples/jsm/nodes' }
      ]
    })
  ]
};