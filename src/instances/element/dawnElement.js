import { hasValidRef, hasValidKey } from 'utils/elements'
import { hasOwn } from 'utils/shared'
import DawnElementOwner from './dawnElementOwner'

export const DAWN_ELEMENT_TYPE = Symbol('dawnElementType')

export const RESERVED_PROPS = {
  ref: true,
  key: true
}

export default function DawnElement (type, key, ref, owner, props) {
  const element = {
    $$typeof: DAWN_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,

    props: props,

    _owner: owner
  }

  Object.freeze(element.props)
  Object.freeze(element)

  return element
}

DawnElement.createElement = function (type, config, children) {
  let ref = null
  let key = null
  const props = {}

  if (config) {
    if (hasValidRef(config)) {
      ref = config.ref
    }
    if (hasValidKey(config)) {
      key = '' + config.key
    }

    Object.keys(config).filter(key => {
      return hasOwn(config, key) && !hasOwn(RESERVED_PROPS, key)
    }).forEach(key => {
      props[key] = config[key]
    })
  }

  const childrenLength = arguments.length - 2
    if (childrenLength === 1) {
      props.children = children
    } else if (childrenLength > 1) {
      const childrenArray = new Array(childrenLength)
      for (let i = 0; i < childrenLength; ++i) {
        childrenArray[i] = arguments[i + 2]
      }
      Object.freeze(childrenArray)
      props.children = childrenArray
    }

    if (type && type.defaultProps) {
      const defaultProps = type.defaultProps
      Object.keys(defaultProps).filter(key => {
        return hasOwn(props, key)
      }).forEach(key => {
        props[key] = defaultProps[key]
      })
    }

    return DawnElement(type, key, ref, DawnElementOwner.current, props)
}

DawnElement.isValidElement = function (object) {
  return object && typeof object === 'object' && object.$$typeof === DAWN_ELEMENT_TYPE
}