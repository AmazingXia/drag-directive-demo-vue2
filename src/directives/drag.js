import Vue from 'vue';

// 方位修饰符数组
const directions = ['top', 'left', 'bottom', 'right'];

// 拖拽指令
Vue.directive('cube-drag', {
  bind(el, binding) {
    const { value, modifiers } = binding;
    const isInside = modifiers.inside;
    const direction = directions.find(dir => modifiers[dir]);

    // 获取元素相对于父元素的偏移量
    function getOffset(element) {
      if (element) {
        const offsetLeft = element.offsetLeft;
        const offsetTop = element.offsetTop;
        const parentOffset = getOffset(element.offsetParent);
        return {
          x: offsetLeft + parentOffset.x,
          y: offsetTop + parentOffset.y
        };
      }
      return { x: 0, y: 0 };
    }

    // 检查是否在指定区域内
    function isInDragArea(direction, value, rect) {
      const isResizer = el.getAttribute('isResizer');
      const isNotResizer = !isResizer || isResizer === 'false';
      const { mouseX, mouseY, x, y, width, height } = rect;

      if (direction === 'top') {
        return mouseY - y <= value && mouseY > y && isNotResizer;
      }
      if (direction === 'left') {
        return mouseX - x <= value && mouseX > x && isNotResizer;
      }
      if (direction === 'bottom') {
        const distanceFromBottom = height - (mouseY - y);
        return distanceFromBottom <= value && mouseY > y && distanceFromBottom > 0 && isNotResizer;
      }
      if (direction === 'right') {
        const distanceFromRight = width - (mouseX - x);
        return distanceFromRight <= value && mouseX > x && distanceFromRight > 0 && isNotResizer;
      }
      return isNotResizer;
    }

    // 标记是否正在操作和初始光标状态
    let isOperating = false;
    let initialCursor = '';

    // 鼠标移动事件处理（用于显示拖拽光标）
    function handleMouseMove(e) {
      // 如果正在操作，不改变光标样式
      if (isOperating) {
        return;
      }

      // 如果没有方位修饰符，直接显示可拖拽光标
      if (!direction) {
        el.style.cursor = 'move';
        el.setAttribute('dragCursor', 'move');
        return;
      }

      const rect = Object.assign({
        mouseX: e.clientX,
        mouseY: e.clientY,
        height: el.offsetHeight,
        width: el.offsetWidth,
        offsetLeft: el.offsetLeft,
        offsetTop: el.offsetTop
      }, getOffset(el));

      const canDrag = isInDragArea(direction, value, rect);

      if (canDrag) {
        el.style.cursor = 'move';
        el.setAttribute('dragCursor', 'move');
      } else {
        el.style.cursor = '';
        el.setAttribute('dragCursor', '');
      }
    }

    // 鼠标按下事件处理
    function handleMouseDown(e) {
      // 在鼠标按下的瞬间记录初始光标状态
      const computedStyle = getComputedStyle(el);
      initialCursor = computedStyle.cursor;

      // 如果初始鼠标不是 'move'，则不执行拖拽
      if (initialCursor !== 'move') {
        return; // 让拉伸指令处理
      }

      // 如果指定了选择器，检查是否点击在指定元素上
      if (value && typeof value === 'string') {
        const dragElement = el.querySelector(value);
        if (dragElement && !dragElement.contains(e.target)) {
          return;
        }
      }

      const offsetParent = el.offsetParent || document.documentElement;
      const rect = Object.assign({
        mouseX: e.clientX,
        mouseY: e.clientY,
        height: el.offsetHeight,
        width: el.offsetWidth,
        offsetLeft: el.offsetLeft,
        offsetTop: el.offsetTop
      }, getOffset(el));

      const startX = e.clientX;
      const startY = e.clientY;

      // 检查是否可以拖拽
      let canDrag = true;
      if (direction) {
        canDrag = isInDragArea(direction, value, rect);
      }

      function handleMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = deltaX + rect.offsetLeft;
        const newTop = deltaY + rect.offsetTop;

        // 处理inside修饰符的边界限制
        const finalLeft = isInside
          ? Math.min(Math.max(0, newLeft), offsetParent.clientWidth - el.offsetWidth)
          : newLeft;
        const finalTop = isInside
          ? Math.min(Math.max(0, newTop), offsetParent.clientHeight - el.offsetHeight)
          : newTop;

        el.style.left = finalLeft + 'px';
        el.style.top = finalTop + 'px';
      }

      function handleMouseUp() {
        isOperating = false; // 清除操作标志
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove, false);
        document.removeEventListener('mouseup', handleMouseUp, false);
      }

      if (canDrag) {
        isOperating = true; // 设置操作标志，锁定光标样式
        // 锁定当前光标样式，防止在操作过程中改变
        el.style.cursor = initialCursor;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove, false);
        document.addEventListener('mouseup', handleMouseUp, false);
        e.preventDefault();
      }
    }

    // 为指定选择器元素设置拖拽光标
    if (value && typeof value === 'string') {
      const dragElement = el.querySelector(value);
      if (dragElement) {
        dragElement.style.cursor = 'move';
      }
    }

    // 绑定事件
    el.addEventListener('mousedown', handleMouseDown, false);
    el.addEventListener('mousemove', handleMouseMove, false);

    // 保存清理函数
    el._dragCleanup = () => {
      el.removeEventListener('mousedown', handleMouseDown, false);
      el.removeEventListener('mousemove', handleMouseMove, false);
    };
  },

  unbind(el) {
    // 清理事件监听器
    if (el._dragCleanup) {
      el._dragCleanup();
    }
  }
});
