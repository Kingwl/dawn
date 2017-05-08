export function hasOwn (object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

export function warn (text, instance) {
  console.warn(`${text} in instance ${instance}`)
}