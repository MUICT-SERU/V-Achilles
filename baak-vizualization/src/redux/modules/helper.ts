type IPayload<T> = {
  type: string,
  payload?: T | any,
}

type ICreator<T> = (args?: T) => IPayload<T>

/**
 * Creates an action creator.
 * Will also put each arguments into the payload, if any.
 * @param {string} type - action type
 * @param {...string} [argNames] - action argument names
 * @return {function} Returns the Action Creator Function
 */
export function Creator<T>(type: string, ...argNames: any[]): ICreator<T> {
if (argNames.length > 0) {
  return (...args: any[]): IPayload<T> => {
  const payload: T | any = {}

  argNames.forEach((arg, index) => {
    payload[argNames[index]] = args[index]
  })

  return { type, payload }
  }
}

return (payload?: T): IPayload<T> => (payload ? { type, payload } : { type })
}