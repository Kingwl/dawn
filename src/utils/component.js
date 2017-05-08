import { hasOwn } from './shared'

const DEFINE_MANY = 'DEFINE_MANY'
const DEFINE_MANY_MERGED = 'DEFINE_MANY_MERGED'
const DEFINE_ONCE = 'DEFINE_ONCE'

export const DawnClassInterface = {
  mixins: DEFINE_MANY,
  propTypes: DEFINE_MANY,

  getDefaultProps: DEFINE_MANY_MERGED,
  getInitialState: DEFINE_MANY_MERGED,

  render: DEFINE_ONCE,

  componentWillMount: DEFINE_MANY,
  componentDidMount: DEFINE_MANY,
  componentWillReceiveProps: DEFINE_MANY,
  shouldComponentUpdate: DEFINE_MANY,
  componentWillUpdate: DEFINE_MANY,
  componentDidUpdate: DEFINE_MANY,
  componentWillUnmount: DEFINE_MANY
}

export const RESERVED_SPEC_KEYS = {
  displayName: function (Constructor, displayName) {
    Constructor.displayName = displayName
  },
  mixins: function (Constructor, mixins) {
    if (mixins) {
      for (let i = 0, l = mixins.length; i < l; ++i) {
        mixSpecIntoComponent(Constructor, mixins[i])
      }
    }
  },
  getDefaultProps: function (Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps)
    } else {
      Constructor.getDefaultProps = getDefaultProps
    }
  },
  propTypes: function (Constructor, propTypes) {
    Constructor.propTypes = Object.assign({}, Constructor.propTypes, propTypes)
  }
}

export const isMountedMixin = {
  componentDidMount: function () {
    this.__isMounted = true
  },
  componentWillUnmount: function () {
    this.__isMounted = false
  }
}

export const DawnClassMixin = {
  replaceState: function(newState, callback) {
    this.updater.enqueueReplaceState(this, newState, callback)
  },
  isMounted: function () {
    return !!this.__isMounted
  }
}

export function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) return

  const proto = Constructor.prototype

  const MIXINS_KEY = 'mixins'
  if (hasOwn(spec, MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, MIXINS_KEY)
  }

  Object.keys(spec).filter(key => hasOwn(spec, key) && name !== MIXINS_KEY).forEach(key => {
    const property = spec[key]
    const isAlreadyDefined = hasOwn(spec, key)
    
    if (hasOwn(RESERVED_SPEC_KEYS, key)) {
      RESERVED_SPEC_KEYS[key](Constructor, property)
    } else {
      const isClassMethod = hasOwn(DawnClassInterface, key)
      const isFunction = typeof property === 'function'

      if (isAlreadyDefined) {
        const specPolicy = DawnClassInterface[key]
        if (specPolicy === DEFINE_MANY_MERGED) {
          proto[key] = createMergedResultFunction(proto[key], property)
        } else if (specPolicy === DEFINE_MANY) {
          proto[key] = createChainedFunction(proto[key], property)
        }
      } else {
        proto[key] = property
      }
    }
  })
}

export function createMergedResultFunction(one, two) {
  return function () {
    const a = one.apply(this, arguments)
    const b = two.apply(this, arguments)
    return Object.assign({}, a, b)
  }
}

export function createChainedFunction (one, two) {
  return function () {
    one.apply(this, arguments)
    two.apply(this, arguments)
  }
}
