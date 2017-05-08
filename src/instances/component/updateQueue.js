import { warn } from 'utils/shared'

function noopWarn(callerName, instance) {
  warn(`invalid caller ${callerName} in`, instance)
}

export default class updateQueue {
  get isMounted () {
    return false
  }

  enqueueForceUpdate (instance, callback, callerName) {
    noopWarn(callerName, instance)
  }

  enqueueReplaceState (instance, completeState, callback, callerName) {
    noopWarn(callerName, instance)
  }

  enqueueSetState (instance, partialState, callback, callerName) {
    noopWarn(callerName, instance)
  }
}

export const defaultUpdateQueue = new updateQueue()