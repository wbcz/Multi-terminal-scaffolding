// 计数器状态
let count = 0;

// 获取 DOM 元素
const countElement = document.getElementById('count');
const decrementButton = document.getElementById('decrement');
const incrementButton = document.getElementById('increment');

// 更新显示
function updateDisplay() {
  countElement.textContent = count;
}

// 事件处理
decrementButton.addEventListener('click', () => {
  count--;
  updateDisplay();
});

incrementButton.addEventListener('click', () => {
  count++;
  updateDisplay();
});

// 初始化显示
updateDisplay();

// 导出全局变量供主应用访问
window.subApp = {
  getCount: () => count,
  setCount: (value) => {
    count = value;
    updateDisplay();
  },
  reset: () => {
    count = 0;
    updateDisplay();
  }
}; 