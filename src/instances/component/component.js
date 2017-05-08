import { defaultUpdateQueue } from './updateQueue'

export default class DawnComponent {
  constructor (props, context, updater) {
    this.props = props
    this.context = context
    this.refs = null
    this.updater = updater || defaultUpdateQueue
  }

  get isReactComponent () {
    return true
  }

  setState (partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState')
  }

  focusUpdate (callback) {
    this.updater.enqueueFocusUpdate(this, callback, 'focusUpdate')
  }
}