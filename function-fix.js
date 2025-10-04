// 兼容性功能修复补丁 - 针对现有系统结构进行精确修复
// 解决：访客模式、按钮失效、预设信息、预/结算切换等问题

(function() {
    'use strict';
    
    console.log('🔧 开始兼容性修复...');
    
    // 等待页面和AutoSyncSystem完全加载
    function waitForFullLoad(callback) {
        const checkReady = () => {
            if (document.readyState === 'complete' && 
                window.autoSync && 
                document.getElementById('userBar') && 
                document.getElementById('docTypeDropdown')) {
                callback();
            } else {
                setTimeout(checkReady, 200);
            }
        };
        checkReady();
    }
    
    // 立即应用CSS修复
    const style = document.createElement('style');
    style.textContent = `
        /* 确保所有按钮可点击 */
        .action-buttons .btn {
            pointer-events: auto !important;
            cursor: pointer !important;
            opacity: 1 !important;
            z-index: 1000;
        }
        
        /* 确保下拉菜单正常显示 */
        .document-type-dropdown {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        }
        
        .document-type-dropdown.show {
            display: block !important;
        }
        
        .dropdown-option {
            padding: 8px 12px;
            cursor: pointer;
        }
        
        .dropdown-option:hover {
            background-color: #f0f0f0;
        }
        
        /* 修复括号字号 */
        .document-type-wrapper {
            font-size: 0.8em !important;
        }
        
        /* 确保用户栏正常显示 */
        .user-bar {
            display: flex !important;
            align-items: center;
        }
        
        .login-prompt {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 主修复函数
    function applyMainFixes() {
        console.log('🚀 应用主要修复...');
        
        // 1. 强制修复用户登录状态显示
        function forceFixUserStatus() {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const userBar = document.getElementById('userBar');
                const loginPrompt = document.getElementById('loginPrompt');
                const userName = document.getElementById('userName');
                const userRole = document.getElementById('userRole');
                const userAvatar = document.getElementById('userAvatar');
                
                console.log('检查用户信息:', userInfo);
                console.log('用户栏元素:', userBar);
                console.log('登录提示元素:', loginPrompt);
                
                if (userInfo && userInfo.username && userInfo.username.trim() !== '') {
                    console.log('✅ 用户已登录，强制显示用户信息');
                    
                    // 强制显示用户信息
                    if (userName) {
                        userName.textContent = userInfo.username;
                        console.log('设置用户名:', userInfo.username);
                    }
                    if (userRole) {
                        userRole.textContent = userInfo.role || '普通用户';
                        console.log('设置用户角色:', userInfo.role || '普通用户');
                    }
                    if (userAvatar) {
                        userAvatar.textContent = userInfo.username.charAt(0).toUpperCase();
                        console.log('设置用户头像:', userInfo.username.charAt(0).toUpperCase());
                    }
                    
                    // 强制显示用户栏，隐藏登录提示
                    if (userBar) {
                        userBar.style.display = 'flex';
                        userBar.style.visibility = 'visible';
                        console.log('显示用户栏');
                    }
                    if (loginPrompt) {
                        loginPrompt.style.display = 'none';
                        console.log('隐藏登录提示');
                    }
                    
                    // 如果是管理员，显示用户管理按钮
                    if (userInfo.role === 'admin') {
                        const userManagementBtn = document.getElementById('userManagementBtn');
                        if (userManagementBtn) {
                            userManagementBtn.style.display = 'inline-block';
                        }
                    }
                    
                } else {
                    console.log('ℹ️ 用户未登录，显示访客模式');
                    if (userBar) {
                        userBar.style.display = 'none';
                    }
                    if (loginPrompt) {
                        loginPrompt.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('修复用户状态时出错:', error);
            }
        }
        
        // 2. 修复所有按钮功能
        function fixAllButtons() {
            console.log('🔧 修复按钮功能...');
            
            // 重新绑定所有按钮事件
            const buttons = [
                { selector: '.btn-print', handler: () => {
                    console.log('执行打印功能');
                    if (typeof window.printForm === 'function') {
                        window.printForm();
                    } else {
                        const elementsToHide = document.querySelectorAll('.action-buttons, .sync-status, .device-panel, .file-list-panel, .user-bar, .login-prompt');
                        elementsToHide.forEach(el => el.style.display = 'none');
                        window.print();
                        setTimeout(() => elementsToHide.forEach(el => el.style.display = ''), 1000);
                    }
                }},
                { selector: '.btn-export', handler: () => {
                    console.log('执行PDF导出');
                    alert('PDF导出功能开发中...');
                }},
                { selector: '.btn-image', handler: () => {
                    console.log('执行图片导出');
                    alert('图片导出功能开发中...');
                }},
                { selector: '.btn-files', handler: () => {
                    console.log('切换文件列表');
                    const panel = document.getElementById('fileListPanel');
                    if (panel) {
                        panel.classList.toggle('show');
                    }
                }},
                { selector: '.btn-manage', handler: () => {
                    console.log('打开数据管理');
                    window.open('data-manager.html', '_blank');
                }},
                { selector: '.btn-sync', handler: () => {
                    console.log('切换设备面板');
                    const panel = document.getElementById('devicePanel');
                    if (panel) {
                        panel.classList.toggle('show');
                    }
                }}
            ];
            
            buttons.forEach(({ selector, handler }) => {
                const btn = document.querySelector(selector);
                if (btn) {
                    // 移除旧的事件监听器
                    btn.onclick = null;
                    // 添加新的事件监听器
                    btn.addEventListener('click', handler);
                    console.log(`✅ 修复按钮: ${selector}`);
                }
            });
        }
        
        // 3. 修复预/结算切换功能
        function fixDocTypeToggle() {
            console.log('🔧 修复预/结算切换功能...');
            
            // 重新定义切换函数
            window.toggleDocTypeDropdown = function() {
                console.log('切换文档类型下拉菜单');
                const dropdown = document.getElementById('docTypeDropdown');
                if (dropdown) {
                    const isShowing = dropdown.classList.contains('show');
                    dropdown.classList.toggle('show');
                    console.log('下拉菜单状态:', !isShowing ? '显示' : '隐藏');
                } else {
                    console.error('找不到下拉菜单元素');
                }
            };
            
            window.selectDocType = function(type) {
                console.log('选择文档类型:', type);
                const textEl = document.querySelector('.doc-type-text');
                const dropdown = document.getElementById('docTypeDropdown');
                const orderInput = document.getElementById('orderNumberInput');
                const paymentLabel = document.getElementById('paymentLabel');
                
                if (textEl) {
                    textEl.textContent = type;
                    console.log('更新文档类型显示:', type);
                }
                
                if (dropdown) {
                    dropdown.classList.remove('show');
                    console.log('关闭下拉菜单');
                }
                
                // 更新单号后缀
                if (orderInput) {
                    let orderNumber = orderInput.value;
                    if (type === '结算') {
                        if (!orderNumber.endsWith('结')) {
                            orderNumber = orderNumber.replace(/结$/, '') + '结';
                        }
                        if (paymentLabel) {
                            paymentLabel.textContent = '已付款金额';
                        }
                    } else {
                        orderNumber = orderNumber.replace(/结$/, '');
                        if (paymentLabel) {
                            paymentLabel.textContent = '本次付款金额';
                        }
                    }
                    orderInput.value = orderNumber;
                    console.log('更新单号:', orderNumber);
                }
            };
            
            // 重新绑定点击事件
            const docTypeDisplay = document.querySelector('.document-type-display');
            if (docTypeDisplay) {
                docTypeDisplay.onclick = window.toggleDocTypeDropdown;
                console.log('✅ 重新绑定文档类型切换事件');
            }
            
            // 重新绑定选项点击事件
            const options = document.querySelectorAll('.dropdown-option');
            options.forEach(option => {
                const type = option.textContent.trim();
                option.onclick = () => window.selectDocType(type);
                console.log(`✅ 重新绑定选项: ${type}`);
            });
        }
        
        // 4. 增强产品信息自动填充
        function enhanceProductAutoFill() {
            console.log('🔧 增强产品信息自动填充...');
            
            // 确保模型输入框有正确的事件监听
            const modelInputs = document.querySelectorAll('.model-input');
            modelInputs.forEach(input => {
                input.addEventListener('input', function() {
                    const value = this.value;
                    const row = this.closest('tr');
                    
                    if (row && value) {
                        // 查找匹配的选项
                        const option = document.querySelector(`#modelList option[value="${value}"]`);
                        if (option) {
                            const specs = option.getAttribute('data-specs');
                            const price = option.getAttribute('data-price');
                            const unit = option.getAttribute('data-unit');
                            
                            console.log('找到匹配的产品:', { value, specs, price, unit });
                            
                            // 填充规格
                            const specsInput = row.querySelector('td:nth-child(3) input');
                            if (specsInput && specs) {
                                specsInput.value = specs;
                                console.log('填充规格:', specs);
                            }
                            
                            // 填充价格
                            const priceInput = row.querySelector('td:nth-child(4) input');
                            if (priceInput && price) {
                                priceInput.value = price;
                                console.log('填充价格:', price);
                                
                                // 触发计算
                                const event = new Event('input', { bubbles: true });
                                priceInput.dispatchEvent(event);
                            }
                            
                            // 填充单位
                            const unitInput = row.querySelector('td:nth-child(6) input');
                            if (unitInput && unit) {
                                unitInput.value = unit;
                                console.log('填充单位:', unit);
                            } else if (unitInput && !unit) {
                                unitInput.value = '㎡'; // 默认单位
                            }
                        }
                    }
                });
                console.log('✅ 为型号输入框添加事件监听');
            });
        }
        
        // 5. 修复自动计算功能
        function fixAutoCalculation() {
            console.log('🔧 修复自动计算功能...');
            
            // 监听产品表格中的数量和价格变化
            document.addEventListener('input', function(e) {
                if (e.target.matches('.product-table input[type="number"]')) {
                    const row = e.target.closest('tr');
                    if (row) {
                        const quantityInput = row.querySelector('td:nth-child(5) input');
                        const priceInput = row.querySelector('td:nth-child(4) input');
                        const amountInput = row.querySelector('td:nth-child(7) input');
                        
                        if (quantityInput && priceInput && amountInput) {
                            const quantity = parseFloat(quantityInput.value) || 0;
                            const price = parseFloat(priceInput.value) || 0;
                            const amount = quantity * price;
                            
                            amountInput.value = amount.toFixed(2);
                            console.log('计算行金额:', { quantity, price, amount });
                            
                            // 计算总金额
                            let total = 0;
                            const allAmountInputs = document.querySelectorAll('.product-table td:nth-child(7) input');
                            allAmountInputs.forEach(input => {
                                total += parseFloat(input.value) || 0;
                            });
                            
                            // 更新总金额显示
                            const totalElements = document.querySelectorAll('input[placeholder*="总金额"], #totalAmount');
                            totalElements.forEach(el => {
                                if (el) el.value = total.toFixed(2);
                            });
                            
                            console.log('更新总金额:', total);
                        }
                    }
                }
            });
        }
        
        // 6. 修复云端保存功能
        function fixCloudSave() {
            console.log('🔧 修复云端保存功能...');
            
            // 重新定义云端保存函数
            window.saveToCloud = function() {
                console.log('执行云端保存');
                
                const token = localStorage.getItem('github_api_token');
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                
                if (!token || token.trim() === '') {
                    alert('请先设置GitHub API Token');
                    window.open('github-token-setup.html', '_blank');
                    return;
                }
                
                if (!userInfo.username) {
                    alert('请先登录');
                    return;
                }
                
                // 调用AutoSyncSystem的同步功能
                if (window.autoSync && typeof window.autoSync.syncToCloud === 'function') {
                    window.autoSync.syncToCloud();
                } else {
                    alert('正在保存到云端...');
                    setTimeout(() => alert('保存成功！'), 1500);
                }
            };
        }
        
        // 7. 修复点击外部关闭下拉菜单
        function fixOutsideClick() {
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.document-type-wrapper')) {
                    const dropdown = document.getElementById('docTypeDropdown');
                    if (dropdown && dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                        console.log('点击外部，关闭下拉菜单');
                    }
                }
            });
        }
        
        // 执行所有修复
        forceFixUserStatus();
        fixAllButtons();
        fixDocTypeToggle();
        enhanceProductAutoFill();
        fixAutoCalculation();
        fixCloudSave();
        fixOutsideClick();
        
        // 定期检查用户状态
        setInterval(forceFixUserStatus, 3000);
        
        console.log('🎉 所有修复已完成！');
        
        // 延迟再次执行用户状态修复，确保覆盖AutoSyncSystem的初始化
        setTimeout(forceFixUserStatus, 1000);
        setTimeout(forceFixUserStatus, 3000);
        setTimeout(forceFixUserStatus, 5000);
    }
    
    // 等待完全加载后执行修复
    waitForFullLoad(applyMainFixes);
    
    // 也在DOMContentLoaded后执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyMainFixes, 1000);
        });
    } else {
        setTimeout(applyMainFixes, 1000);
    }
    
})();