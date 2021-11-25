import { makeMap } from './makeMap'

export { makeMap }
export * from './patchFlags'
export * from './shapeFlags'
export * from './slotFlags'
export * from './globalsWhitelist'
export * from './codeframe'
export * from './normalizeProp'
export * from './domTagConfig'
export * from './domAttrConfig'
export * from './escapeHtml'
export * from './looseEqual'
export * from './toDisplayString'

/**
 * 全局恒定的空对象（只读）
 */
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}
/**
 * 全局恒定的空数组（只读）
 */
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : []

/**
 * 全局恒定的空函数
 */
export const NOOP = () => {}

/**
 * Always return false.
 * 一个总是返回false的函数
 */
export const NO = () => false

/**
 * 判断是不是监听器属性（类似onClick）
 * `on`后方第一个字符，若为英文字母则必须为大写
 */
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)

/**
 * 判断键是否是一个vModel的监听器
 * @param key
 * @returns
 */
export const isModelListener = (key: string) => key.startsWith('onUpdate:')

export const extend = Object.assign

/**
 * 删除数组中的一项
 * @param arr
 * @param el
 */
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    // splice其实比较耗费性能，删了数组中某项，其它关联项索引都会变
    arr.splice(i, 1)
  }
}

/**
 * hasOwnProperty
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

/**
 * Array、Map、Set的判断
 */
export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date => val instanceof Date
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

/**
 * Promise的判断
 * @param val
 * @returns
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * Object原型上的toString函数
 */
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  // 从类型标签中获取中括号内第二部分的内容
  return toTypeString(value).slice(8, -1)
}

/**
 * 判断一个对象是不是纯对象
 * @param val
 * @returns
 */
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

/**
 * 判断一个key是不是整数
 * @param key
 * @returns
 */
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

/**
 * 判断是否为保留Prop？
 */
export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)
/**
 * 缓存函数 类似单例模式，若已创建则直接返回，若未创建则创建后返回
 * @param fn
 * @returns
 */
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}

const camelizeRE = /-(\w)/g
/**
 * 把连字符命名转换为驼峰命名
 * @private
 */
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

const hyphenateRE = /\B([A-Z])/g
/**
 * 把驼峰命名转换为连字符命名
 * @private
 */
export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)

/**
 * 把字符串首字符转换为大写
 * @private
 */
export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
)

/**
 * 在把字符串首字符改为大写，并在前面加on，使得这个变量成为事件监听器
 * @private
 */
export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : ``
)

// compare whether a value has changed, accounting for NaN.
/**
 * 判断两个值是否相同，包括NaN在内
 * @param value
 * @param oldValue
 * @returns
 */
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

// `Object.is` 与 `===`行为几乎一致，除了两个例外
// Object.is = (x, y) => {
//   if (x === y) {
//     // 例外1：+0 !== -0
//     return x !== 0 || 1 / x === 1 / y;
//   }
//   // 例外2：NaN === NaN
//   return x !== x && y !== y;
// }
/**
 * 触发数组内所有函数
 * @param fns
 * @param arg
 */
export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}

/**
 * 为数组中某个key赋值
 * @param obj
 * @param key
 * @param value
 */
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}

/**
 * 把一个值转换为小数。实在转换不了就原样返回
 * @param val
 * @returns
 */
export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

let _globalThis: any
/**
 * 返回全局变量
 * @returns
 */
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
