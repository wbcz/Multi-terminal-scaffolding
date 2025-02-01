// 计数器状态
let count = 0;

// 全局变量
window.globalVar = '初始值';

// 更新显示
function updateDisplay() {
  document.getElementById('count').textContent = count;
  document.getElementById('globalVar').textContent = window.globalVar;
}

// 设置全局变量的方法
window.setGlobalVar = function(value) {
  window.globalVar = value;
  updateDisplay();
  console.log('App1 设置全局变量:', value);
}

// 绑定事件
document.getElementById('decrease').addEventListener('click', () => {
  count--;
  updateDisplay();
  console.log('App1 当前计数:', count);
});

document.getElementById('increase').addEventListener('click', () => {
  count++;
  updateDisplay();
  console.log('App1 当前计数:', count);
});

// 初始化显示
updateDisplay();

// 导出接口供主应用调用
window.subApp1 = {
  getCount: () => count,
  setCount: (value) => {
    count = value;
    updateDisplay();
  },
  getGlobalVar: () => window.globalVar
}; 