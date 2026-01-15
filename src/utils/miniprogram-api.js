// 模拟小程序API
const mockApp = {
  globalData: {
    sysInfo: {
      windowWidth: 375,
      windowHeight: 667,
      pixelRatio: 2
    }
  }
}

// 模拟getApp
export function getApp() {
  return mockApp
}

// 模拟createSelectorQuery
export function createSelectorQuery() {
  const queryChain = {
    select(selector) {
      this.selector = selector
      return this
    },
    boundingClientRect(callback) {
      // 使用 requestAnimationFrame 确保 DOM 已渲染
      requestAnimationFrame(() => {
        const element = document.querySelector(this.selector)
        if (element) {
          const rect = element.getBoundingClientRect()
          callback({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            right: rect.right,
            bottom: rect.bottom
          })
        } else {
          callback({
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            right: 0,
            bottom: 0
          })
        }
      })
      return this
    },
    exec() {
      return this
    }
  }
  return queryChain
}

