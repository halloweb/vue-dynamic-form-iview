/**
 * 计算不换行表格中的文字宽度，主要用在table中
 * str: 表格中的字符串
 * fontSize: 字体大小，默认14
 * 返回计算后的宽度结果
 */

// 获取行内字节宽度
export const fontWidthCal = (width, fontSize) => {
  const size = fontSize || 10
  return width * size
}

/**
 * 获取tbody下的tr元素的高度数组
 * 服务于table组件
 */
export const getElChildren = (el, tags) => {
  if (!el) {
    return null
  }
  const children = el.querySelector(tags) && el.querySelector(tags).children
  if (!children) {
    return null
  }
  const heightArr = []
  for (const tr of children) {
    heightArr.push(tr.offsetHeight)
  }
  return heightArr
}

// 计算el的样式
// todo: 样式无法完全带过来，需要在组件中做补偿
export const getElObj = (el, renderClass = '') => {
  const div = document.createElement('div')
  const node = el.cloneNode(true)
  div.style.position = 'absolute'
  div.style.visibility = 'hidden'
  div.style.top = '-1000px'
  div.setAttribute('class', renderClass)
  div.appendChild(node)
  document.body.appendChild(div)

  return new Promise(resolve => {
    return setTimeout(() => {
      resolve(div.offsetWidth)
      div.remove()
    })
  })
}
// 获取滚动条宽度
let cached
export const getScrollWidth = fresh => {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

// 获取目标的上级目标节点

export const getParentNode = (el, func) => {
  let node = el
  let res
  while (node && node.parentElement) {
    if (func(node)) {
      res = node
      break
    }
    node = node.parentElement
  }
  return res
}

// 获取目标的上级目标节点

export const getParentVm = (el, func) => {
  let node = el
  let res
  while (node && node.$parent) {
    if (func(node)) {
      res = node
      break
    }
    node = node.$parent
  }
  return res
}

// 获取目标的上级滚动元素

export const getParentScroller = el => {
  let node = el.parentElement
  while (node && node.parentElement) {
    const overflow = window.getComputedStyle(node).getPropertyValue('overflow')
    if (overflow === 'auto' || overflow === 'scroll') {
      break
    }
    node = node.parentElement
  }
  return node
}

// 回到scroll顶部
let scrollTimer = null
export const scrollToTop = (el, speed = 50) => {
  const scrollEl = getParentScroller(el)
  return (
    scrollEl &&
    (() => {
      cancelAnimationFrame(scrollTimer)
      scrollTimer = requestAnimationFrame(function fn () {
        const oTop = scrollEl.scrollTop
        if (oTop > 0) {
          scrollEl.scrollTop = oTop - speed
          scrollTimer = requestAnimationFrame(fn)
        } else {
          cancelAnimationFrame(scrollTimer)
        }
      })
    })()
  )
}
// 复制文字到剪贴板

export function copyText (text) {
  const input = document.createElement('textarea')
  document.body.append(input)
  input.value = text
  input.select()
  document.execCommand('copy')
  input.remove()
}

export function download (path, name) {
  const a = document.createElement('a')
  a.setAttribute('href', path)
  a.setAttribute('traget', '_blank')
  if (name) {
    a.setAttribute('download', name)
  }
  a.click()
}

export function downloadList (name, fields, data) {
  const str = [fields.map(field => field && field.name).join(',')]
  for (const row of data) {
    str.push(fields.map(field => row[field.code]).join(','))
  }
  downLocalCsv(str.join('\n'), name)
}

export function downLocalCsv (data, name) {
  const blob = new Blob(['\uFEFF' + data], {
    type: 'text/csv;charset=utf-8'
  })
  const url = window.URL.createObjectURL(blob)
  download(url, name + '.csv')
}

// 绑定单次

export function bindEventOnce (event, func, context = window) {
  const callback = function (e) {
    func.call(this, e)
    context.removeEventListener(event, callback)
  }
  context.addEventListener(event, callback)
}
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) { throw new Error('className should not contain space.') }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export function addClass (el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass (el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export function on (element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

export function off (element, event, handler) {
  if (element && event) {
    element.removeEventListener(event, handler, false)
  }
}
