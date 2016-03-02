let config = require('./_development')
if (__DEBUG__) {
  config = require('./_local')
}

export default Object.assign({}, config)
