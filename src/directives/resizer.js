import Vue from 'vue';

// 拉伸方向映射
const resizeCursors = {
  north: 'n-resize',
  south: 's-resize',
  west: 'w-resize',
  east: 'e-resize',
  northeast: 'ne-resize',
  northwest: 'nw-resize',
  southwest: 'sw-resize',
  southeast: 'se-resize',
  initial: 'initial'
};

// 拉伸检测区域大小
const RESIZE_THRESHOLD = 8;

// 获取元素位置
function getElementPosition(element) {
  if (element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    };
  }
  return {
    x: 0,
    y: 0
  };
}

// 检测拉伸方向
function detectResizeDirection(rect) {
  const { mouseX, mouseY, x, y, width, height } = rect;
  let direction = 'initial';

  if (mouseX > x + width - RESIZE_THRESHOLD && mouseY > y + height - RESIZE_THRESHOLD) {
    direction = 'southeast';
  } else if (x + RESIZE_THRESHOLD > mouseX && mouseY > y + height - RESIZE_THRESHOLD) {
    direction = 'southwest';
  } else if (y + RESIZE_THRESHOLD > mouseY && mouseX > x + width - RESIZE_THRESHOLD) {
    direction = 'northeast';
  } else if (y + RESIZE_THRESHOLD > mouseY && x + RESIZE_THRESHOLD > mouseX) {
    direction = 'northwest';
  } else if (mouseX > x + width - RESIZE_THRESHOLD && mouseY >= y + RESIZE_THRESHOLD && mouseY <= y + height - RESIZE_THRESHOLD) {
    direction = 'east';
  } else if (x + RESIZE_THRESHOLD > mouseX && mouseY >= y + RESIZE_THRESHOLD && mouseY <= y + height - RESIZE_THRESHOLD) {
    direction = 'west';
  } else if (mouseY > y + height - RESIZE_THRESHOLD && mouseX >= x + RESIZE_THRESHOLD && mouseX <= x + width - RESIZE_THRESHOLD) {
    direction = 'south';
  } else if (y + RESIZE_THRESHOLD > mouseY && mouseX >= x + RESIZE_THRESHOLD && mouseX <= x + width - RESIZE_THRESHOLD) {
    direction = 'north';
  }

  return direction;
}

// 北部拉伸
function resizeNorth(element, rect, deltaY) {
  const { height, offsetTop, maxTop, maxHeight, minHeight, isInside, minTop } = rect;
  const maxHeightLimit = isInside ? Math.min(height + offsetTop, maxHeight) : maxHeight;
  let newHeight = Math.max(Math.min(height - deltaY, maxHeightLimit), minHeight);

  // 计算理想的 newTop，保持 bottom 位置不变
  const idealNewTop = offsetTop + (height - newHeight);

  // 应用边界限制，但优先保持 bottom 位置
  let newTop;
  if (isInside) {
    // 当 isInside 为 true 时，确保不超出父容器边界
    const minTopForBottom = Math.max(0, idealNewTop);
    const maxTopForBottom = Math.min(maxTop, idealNewTop);
    newTop = Math.max(minTopForBottom, Math.min(maxTopForBottom, idealNewTop));
  } else {
    newTop = Math.min(Math.max(idealNewTop, minTop), maxTop);
  }

  element.style.height = newHeight + 'px';
  element.style.top = newTop + 'px';
}

// 南部拉伸
function resizeSouth(element, rect, deltaY) {
  const { height, offsetTop, minHeight, parentEl, maxHeight, isInside } = rect;
  const maxHeightLimit = isInside ? Math.min(parentEl.clientHeight - offsetTop, maxHeight) : maxHeight;
  const newHeight = Math.max(Math.min(height + deltaY, maxHeightLimit, maxHeight), minHeight);

  element.style.height = newHeight + 'px';
}

// 西部拉伸
function resizeWest(element, rect, deltaX) {
  const { width, offsetLeft, maxLeft, maxWidth, minWidth, isInside, minLeft } = rect;
  const maxWidthLimit = isInside ? Math.min(width + offsetLeft, maxWidth) : maxWidth;
  const newWidth = Math.max(Math.min(width - deltaX, maxWidthLimit), minWidth);
  const newLeft = Math.min(Math.max(offsetLeft + (width - newWidth), minLeft), maxLeft);

  element.style.width = newWidth + 'px';
  element.style.left = newLeft + 'px';
}

// 东部拉伸
function resizeEast(element, rect, deltaX) {
  const { width, offsetLeft, parentEl, maxWidth, minWidth, isInside } = rect;
  const maxWidthLimit = isInside ? Math.min(parentEl.clientWidth - offsetLeft, maxWidth) : maxWidth;
  const newWidth = Math.max(Math.min(width + deltaX, maxWidthLimit, maxWidth), minWidth);

  element.style.width = newWidth + 'px';
}

// 拉伸指令
Vue.directive('cube-resizer', {
  bind(el, { modifiers }) {
    const isInside = modifiers.inside;
    let allowedDirections = Object.keys(resizeCursors).filter(dir =>
      modifiers[dir] && dir !== 'initial'
    );

    // 如果没有指定方向，则允许所有方向
    if (allowedDirections.length === 0) {
      allowedDirections = Object.keys(resizeCursors);
    }

    // 标记是否正在操作和初始光标状态
    let isOperating = false;
    let initialCursor = '';

    // 鼠标移动事件处理（用于显示拉伸光标）
    function handleMouseMove(e) {
      // 如果正在操作，不改变光标样式
      if (isOperating) {
        return;
      }

      const rect = Object.assign({
        mouseX: e.pageX,
        mouseY: e.pageY,
        height: el.offsetHeight,
        width: el.offsetWidth
      }, getElementPosition(el));

      const direction = detectResizeDirection(rect);

      if (direction !== 'initial' && allowedDirections.indexOf(direction) !== -1) {
        el.style.cursor = resizeCursors[direction];
        el.setAttribute('isResizer', 'true');
      } else {
        el.setAttribute('isResizer', 'false');
        el.style.cursor = el.getAttribute('dragCursor') || '';
      }
    }

    // 鼠标按下事件处理
    function handleMouseDown(e) {
      // 在鼠标按下的瞬间记录初始光标状态
      const computedStyle = getComputedStyle(el);
      initialCursor = computedStyle.cursor;

      const resizeCursors = ['n-resize', 's-resize', 'w-resize', 'e-resize', 'ne-resize', 'nw-resize', 'sw-resize', 'se-resize'];
      if (!resizeCursors.includes(initialCursor)) {
        return; // 不是拉伸光标，不执行拉伸
      }

      // 使用 offsetTop/offsetLeft 获取相对于 offsetParent 的位置
      const height = el.offsetHeight;
      const width = el.offsetWidth;
      const offsetTop = el.offsetTop;
      const offsetLeft = el.offsetLeft;

      // 获取CSS限制
      const minHeight = Number.parseFloat(getComputedStyle(el).minHeight) || 0;
      const minWidth = Number.parseFloat(getComputedStyle(el).minWidth) || 0;
      const maxHeight = Number.parseFloat(getComputedStyle(el).maxHeight) || Number.MAX_SAFE_INTEGER;
      const maxWidth = Number.parseFloat(getComputedStyle(el).maxWidth) || Number.MAX_SAFE_INTEGER;

      // 计算最大和最小位置限制
      const maxTop = offsetTop + (height - minHeight);
      const maxLeft = offsetLeft + (width - minWidth);
      const minTop = isInside ? 0 : Number.MIN_SAFE_INTEGER;
      const minLeft = isInside ? 0 : Number.MIN_SAFE_INTEGER;

      const rect = Object.assign({
        parentEl: el.offsetParent || document.documentElement,
        mouseX: e.pageX,
        mouseY: e.pageY,
        height,
        width,
        offsetLeft,
        offsetTop,
        minHeight,
        minWidth,
        maxWidth,
        maxHeight,
        maxTop,
        maxLeft,
        isInside,
        minTop,
        minLeft
      }, getElementPosition(el));

      const direction = detectResizeDirection(rect);

      function handleMouseMove(e) {
        const deltaX = e.pageX - rect.mouseX;
        const deltaY = e.pageY - rect.mouseY;

        window.requestAnimationFrame(() => {
          switch (direction) {
            case 'north':
              resizeNorth(el, rect, deltaY);
              break;
            case 'south':
              resizeSouth(el, rect, deltaY);
              break;
            case 'west':
              resizeWest(el, rect, deltaX);
              break;
            case 'east':
              resizeEast(el, rect, deltaX);
              break;
            case 'southeast':
              resizeSouth(el, rect, deltaY);
              resizeEast(el, rect, deltaX);
              break;
            case 'northeast':
              resizeNorth(el, rect, deltaY);
              resizeEast(el, rect, deltaX);
              break;
            case 'northwest':
              resizeNorth(el, rect, deltaY);
              resizeWest(el, rect, deltaX);
              break;
            case 'southwest':
              resizeSouth(el, rect, deltaY);
              resizeWest(el, rect, deltaX);
              break;
          }
        });
      }

      function handleMouseUp() {
        isOperating = false; // 清除操作标志
        document.removeEventListener('mousemove', handleMouseMove, false);
        document.removeEventListener('mouseup', handleMouseUp, false);
        document.body.style.userSelect = '';
      }

      if (direction !== 'initial' && allowedDirections.indexOf(direction) !== -1) {
        isOperating = true; // 设置操作标志，锁定光标样式
        // 锁定当前光标样式，防止在操作过程中改变
        el.style.cursor = `${initialCursor} !important`;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove, false);
      }
      document.addEventListener('mouseup', handleMouseUp, false);
    }

    // 绑定事件
    el.addEventListener('mousemove', handleMouseMove, false);
    el.addEventListener('mousedown', handleMouseDown, false);

    // 保存清理函数
    el._resizerCleanup = () => {
      el.removeEventListener('mousemove', handleMouseMove, false);
      el.removeEventListener('mousedown', handleMouseDown, false);
    };
  },

  unbind(el) {
    // 清理事件监听器
    if (el._resizerCleanup) {
      el._resizerCleanup();
    }
  }
});
