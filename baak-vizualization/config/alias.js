
const path = require('path')

const p = x => path.resolve(__dirname, '..', x)

const app = {
  'react-native': 'react-native-web',
  'app': p('src'),
  'assets': p('src/assets'),
  'components': p('src/components'),
  'containers': p('src/containers'),
  'core': p('src/core'),
  'libs': p('src/libs'),
  'ducks': p('src/redux/modules'),
  'pages': p('src/pages'),
  'styled': p('src/components/styled'),
  'styles': p('src/styles'),
  'types': p('src/types'),
  'vars': p('src/vars'),
}

module.exports = app