import factory from './factory'
import { Component } from 'instances/component/component'
import { isValidElement } from 'instances/element/dawnElement'
import { defaultUpdateQueue } from 'instances/component/updateQueue'

export default factory(Component, isValidElement, defaultUpdateQueue)