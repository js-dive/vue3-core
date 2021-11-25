import { isArray, isDate, isObject } from './'

/**
 * 比较两个数组是否宽松相等
 * 长度不同一定不相等，不满足宽松相等条件一定不相等
 * @param a
 * @param b
 * @returns
 */
function looseCompareArrays(a: any[], b: any[]) {
  if (a.length !== b.length) return false
  let equal = true
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i])
  }
  return equal
}

/**
 * 比较两个变量是否宽松相等
 * @param a
 * @param b
 * @returns
 */
export function looseEqual(a: any, b: any): boolean {
  // 简单比较
  if (a === b) return true

  // 针对日期的比较
  let aValidType = isDate(a)
  let bValidType = isDate(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false
  }

  // 针对数组的比较
  aValidType = isArray(a)
  bValidType = isArray(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType
      ? looseCompareArrays(a, b) // 递归
      : false
  }

  // 针对对象的比较
  aValidType = isObject(a)
  bValidType = isObject(b)
  if (aValidType || bValidType) {
    /* istanbul ignore if: this if will probably never be called */
    if (!aValidType || !bValidType) {
      return false
    }
    const aKeysCount = Object.keys(a).length
    const bKeysCount = Object.keys(b).length
    if (aKeysCount !== bKeysCount) {
      return false
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key)
      const bHasKey = b.hasOwnProperty(key)
      if (
        (aHasKey && !bHasKey) ||
        (!aHasKey && bHasKey) ||
        !looseEqual(a[key], b[key])
      ) {
        return false
      }
    }
  }
  // 如果不是日期、对象、数组，那这里好像就只能当成字符串来比较了
  return String(a) === String(b)
}

/**
 * 找到数组内与某一项宽松相等的项的索引
 * @param arr
 * @param val
 * @returns
 */
export function looseIndexOf(arr: any[], val: any): number {
  return arr.findIndex(item => looseEqual(item, val))
}
