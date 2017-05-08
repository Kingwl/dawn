import { DawnClassMixin, mixSpecIntoComponent, isMountedMixin, DawnClassInterface } from 'utils/component'
import DawnComponent from 'instances/component/component'
import { defaultUpdateQueue } from 'instances/component/updateQueue'

export default function factory (component, isValidElement, updateQueue) {
  const injectedMixins = []

  const DawnClassComponent = function () {}
  Object.assign(DawnClassComponent.prototype, DawnComponent.prototype, DawnClassMixin)

  function createClass(spec) {
    const Constructor = function (props, updater) {
      this.props = props
      this.refs = null
      this.updater = updater || defaultUpdateQueue

      this.state = this.getInitialState ? this.getInitialState() : null
    }

    Constructor.prototype = new DawnClassComponent()
    Constructor.prototype.constructor = Constructor

    mixSpecIntoComponent(Constructor, isMountedMixin)
    mixSpecIntoComponent(Constructor, spec)

    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps()
    }

    Object.keys(DawnClassInterface).filter(key => !Constructor.prototype[key]).forEach(key => {
      Constructor.prototype[key] = null
    })

    return Constructor
  }

  return createClass
}