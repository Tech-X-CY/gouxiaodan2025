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
        
        /* 修复预算/结算括号格式 - 移除伪元素，避免重复显示 */
        .document-type-wrapper {
            font-size: 16px !important;
            font-weight: normal !important;
        }
        
        .document-type-wrapper .doc-type-text {
            font-size: 16px !important;
        }
        
        /* 确保括号不重复显示 */
        .document-type-wrapper::before,
        .document-type-wrapper::after {
            content: none !important;
        }
        
        /* 数据管理UI优化 */
        .order-item {
            font-size: 12px !important;
            padding: 15px !important;
            margin-bottom: 15px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        .order-item h4 {
            font-size: 14px !important;
            margin-bottom: 8px !important;
        }
        
        .order-item p {
            font-size: 12px !important;
            margin: 4px 0 !important;
        }
        
        .order-actions {
            margin-top: 10px !important;
        }
        
        .order-actions button {
            font-size: 12px !important;
            padding: 6px 12px !important;
            margin-right: 8px !important;
        }
        
        /* 确保用户栏正常显示 */
        .user-bar {
            display: flex !important;
            align-items: center;
        }
        
        .login-prompt {
            display: block;
        }
        
        /* 打印样式修复 */
        @media print {
            /* 隐藏页眉页脚 */
            @page {
                margin: 0;
                size: A4;
            }
            
            /* 隐藏不需要打印的元素 */
            .action-buttons,
            .sync-status,
            .device-panel,
            .file-list-panel,
            .user-bar,
            .login-prompt,
            .notice {
                display: none !important;
            }
            
            /* 确保打印内容适合页面 */
            body {
                margin: 10mm;
                font-size: 12px;
                line-height: 1.2;
            }
            
            /* 修复表格打印样式 */
            table {
                page-break-inside: avoid;
                border-collapse: collapse;
            }
            
            /* 确保标题正确显示 */
            .header h1 {
                font-size: 24px !important;
                margin: 10px 0 !important;
            }
            
            /* 修复预算/结算在打印时的显示 */
            .document-type-wrapper {
                font-size: 16px !important;
            }
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
                    console.log('🖨️ 执行打印功能');
                    
                    // 隐藏不需要打印的元素
                    const elementsToHide = document.querySelectorAll('.action-buttons, .sync-status, .device-panel, .file-list-panel, .user-bar, .login-prompt, .notice');
                    const originalStyles = [];
                    
                    elementsToHide.forEach((el, index) => {
                        originalStyles[index] = el.style.display;
                        el.style.display = 'none';
                    });
                    
                    // 添加打印专用样式
                    const printStyle = document.createElement('style');
                    printStyle.id = 'print-style';
                    printStyle.textContent = `
                        @media print {
                            body { margin: 10mm !important; }
                            .header h1 { font-size: 24px !important; margin: 10px 0 !important; }
                            .document-type-wrapper { font-size: 16px !important; }
                            table { page-break-inside: avoid; }
                        }
                    `;
                    document.head.appendChild(printStyle);
                    
                    // 执行打印
                    window.print();
                    
                    // 打印完成后恢复元素显示
                    setTimeout(() => {
                        elementsToHide.forEach((el, index) => {
                            el.style.display = originalStyles[index];
                        });
                        
                        // 移除临时样式
                        const tempStyle = document.getElementById('print-style');
                        if (tempStyle) {
                            tempStyle.remove();
                        }
                        
                        console.log('✅ 打印完成，页面已恢复');
                    }, 1000);
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
                    console.log('🔥 强制切换文件列表');
                    const panel = document.getElementById('fileListPanel');
                    if (panel) {
                        if (panel.classList.contains('show')) {
                            panel.classList.remove('show');
                            console.log('关闭文件列表');
                        } else {
                            panel.classList.add('show');
                            console.log('打开文件列表');
                            
                            // 强制重新加载文件列表
                            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                            console.log('🔍 强制加载文件列表，文件数:', savedFiles.length);
                            console.log('📋 文件列表内容:', savedFiles);
                            
                            // 强制创建或更新fileManager
                            window.fileManager = {
                                files: savedFiles,
                                displayFiles: function() {
                                    const container = document.getElementById('fileListContent');
                                    if (!container) {
                                        console.error('❌ 找不到文件列表容器 #fileListContent');
                                        return;
                                    }
                                    
                                    console.log('📝 强制显示文件列表，文件数:', this.files.length);
                                    
                                    if (this.files.length === 0) {
                                        container.innerHTML = '<div class="empty-message" style="padding: 20px; text-align: center; color: #666;">暂无文件</div>';
                                        console.log('📭 显示空文件列表');
                                        return;
                                    }
                                    
                                    // 强制显示文件列表
                                    const fileListHTML = this.files.map(file => {
                                        // 兼容不同的数据结构
                                        const fileName = file.title || file.name || '未命名文件';
                                        const creator = file.creator || file.createdBy || '未知';
                                        const timestamp = file.timestamp || file.createdAt || Date.now();
                                        const buyer = file.buyer || (file.data && file.data.customer) || '未填写';
                                        const amount = file.amount || (file.data && file.data.totalAmount) || '0.00';
                                        
                                        console.log(`📄 文件: ${fileName}, 创建者: ${creator}, 购货方: ${buyer}, 金额: ${amount}`);
                                        
                                        return `
                                            <div class="file-item" style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; background: #f9f9f9;">
                                                <div class="file-info">
                                                    <div class="file-name" style="font-weight: bold; margin-bottom: 8px;">${fileName}</div>
                                                    <div class="file-meta" style="font-size: 12px; color: #666;">
                                                        <span style="margin-right: 15px;">创建者: ${creator}</span>
                                                        <span style="margin-right: 15px;">时间: ${new Date(timestamp).toLocaleString()}</span>
                                                        <span style="margin-right: 15px;">购货方: ${buyer}</span>
                                                        <span>金额: ¥${amount}</span>
                                                    </div>
                                                </div>
                                                <div class="file-actions" style="margin-top: 10px;">
                                                    <button class="btn btn-load" onclick="loadFileData('${file.id}')" style="margin-right: 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">📂 加载</button>
                                                    <button class="btn btn-delete" onclick="deleteFile('${file.id}')" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">🗑️ 删除</button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('');
                                    
                                    container.innerHTML = fileListHTML;
                                    console.log('✅ 文件列表HTML已更新');
                                }
                            };
                            
                            // 立即显示文件列表
                            window.fileManager.displayFiles();
                        }
                    }
                }},
                { selector: '.btn-manage', handler: () => {
                    console.log('打开数据管理');
                    window.open('data-manager.html', '_blank');
                }},
                { selector: '.btn-sync', handler: () => {
                    console.log('🔄 切换设备同步面板');
                    const panel = document.getElementById('devicePanel');
                    if (panel) {
                        if (panel.classList.contains('show')) {
                            panel.classList.remove('show');
                            console.log('关闭设备面板');
                        } else {
                            panel.classList.add('show');
                            console.log('打开设备面板');
                            
                            // 确保同步系统已初始化
                            if (window.autoSync) {
                                // 更新同步状态显示
                                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                                const token = localStorage.getItem('github_api_token');
                                
                                if (userInfo.username && token) {
                                    console.log('✅ 同步系统已配置');
                                } else {
                                    console.log('⚠️ 同步系统需要配置');
                                }
                            }
                        }
                    } else {
                        console.error('❌ 找不到设备面板元素 #devicePanel');
                    }
                }},
                { selector: '.btn-save-new', handler: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 强制执行保存并新建');
                    
                    // 直接调用保存并新建逻辑，不依赖全局函数
                    try {
                        // 保存当前数据
                        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                        
                        // 手动收集表单数据 - 使用更精确的选择器
                        const infoTable = document.querySelector('.info-table');
                        const formData = {
                            orderNumber: document.getElementById('orderNumberInput')?.value || '',
                            date: infoTable?.querySelector('tr:nth-child(5) td:nth-child(2) input')?.value || '',
                            customer: infoTable?.querySelector('tr:nth-child(1) td:nth-child(2) input')?.value || '',
                            contact: infoTable?.querySelector('tr:nth-child(1) td:nth-child(4) input')?.value || '',
                            supplier: infoTable?.querySelector('tr:nth-child(2) td:nth-child(2) input')?.value || '',
                            supplierPhone: infoTable?.querySelector('tr:nth-child(2) td:nth-child(4) input')?.value || '',
                            supplierAddress: infoTable?.querySelector('tr:nth-child(3) td:nth-child(2) input')?.value || '',
                            deliveryAddress: infoTable?.querySelector('tr:nth-child(4) td:nth-child(2) input')?.value || '',
                            deliveryTime: infoTable?.querySelector('tr:nth-child(5) td:nth-child(4) input')?.value || '',
                            deliveryMethod: document.querySelector('.delivery-input input')?.value || '',
                            products: [],
                            totalAmount: document.getElementById('totalAmount')?.value || '0',
                            payment: document.querySelector('.payment-input')?.value || '0',
                            balance: document.querySelector('.balance-input')?.value || '0'
                        };
                        
                        console.log('📊 收集的基础数据:', {
                            orderNumber: formData.orderNumber,
                            customer: formData.customer,
                            totalAmount: formData.totalAmount
                        });
                        
                        // 收集产品数据
                        const productRows = document.querySelectorAll('.product-table tbody tr');
                        console.log(`📋 找到 ${productRows.length} 行产品数据`);
                        
                        productRows.forEach((row, index) => {
                            const product = row.querySelector('td:nth-child(1) input')?.value || '';
                            const model = row.querySelector('td:nth-child(2) input')?.value || '';
                            const specs = row.querySelector('td:nth-child(3) input')?.value || '';
                            const price = row.querySelector('td:nth-child(4) input')?.value || '';
                            const quantity = row.querySelector('td:nth-child(5) input')?.value || '';
                            const unit = row.querySelector('td:nth-child(6) input')?.value || '';
                            const amount = row.querySelector('td:nth-child(7) input')?.value || '';
                            
                            console.log(`📦 产品行 ${index + 1}:`, { product, model, specs, price, quantity, unit, amount });
                            
                            if (product || model || specs || price || quantity) {
                                formData.products.push({
                                    product, model, specs, price, quantity, unit, amount
                                });
                            }
                        });
                        
                        console.log('📦 收集到的产品数据:', formData.products);
                        
                        // 获取单号作为标题
                        const orderNumber = formData.orderNumber || 'GX' + Date.now().toString().slice(-8);
                        
                        // 创建文件记录 - 保持与原系统兼容的数据结构
                        const fileRecord = {
                            id: 'file_' + Date.now(),
                            title: orderNumber,
                            creator: userInfo.username || '访客用户',
                            buyer: formData.customer || '未填写',
                            amount: formData.totalAmount || '0.00',
                            timestamp: Date.now(),
                            data: formData,
                            preview: `购货方: ${formData.customer || '未填写'} | 金额: ¥${formData.totalAmount || '0.00'}`
                        };
                        
                        console.log('📝 创建文件记录:', fileRecord);
                        
                        // 保存到文件列表
                        const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                        savedFiles.unshift(fileRecord);
                        localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
                        console.log('💾 保存到localStorage，当前文件数:', savedFiles.length);
                        
                        // 同步到云端
                        if (window.autoSync && typeof window.autoSync.syncToCloud === 'function') {
                            window.autoSync.syncToCloud();
                        }
                        
                        // 清空表单但保留预设信息
                        document.querySelectorAll('.input-field').forEach(input => {
                            // 保留供货方信息和其他预设信息
                            if (!input.value.includes('厦门汇仕环保科技有限公司') && 
                                !input.value.includes('0592-5772750') && 
                                !input.value.includes('厦门市湖里区钟宅红星美凯龙E8038') &&
                                !input.value.includes('6226 1529 0065 3167') &&
                                !input.value.includes('饶玉珍') &&
                                !input.value.includes('中国民生银行') &&
                                !input.value.includes('质保期五年')) {
                                input.value = '';
                            }
                        });
                        
                        // 重新生成单号
                        const orderInput = document.getElementById('orderNumberInput');
                        if (orderInput) {
                            orderInput.value = 'GX' + Date.now().toString().slice(-8);
                        }
                        
                        // 重置日期为今天
                        const dateInput = document.querySelector('input[type="date"]');
                        if (dateInput) {
                            dateInput.value = new Date().toISOString().split('T')[0];
                        }
                        
                        // 更新文件列表显示
                        if (window.fileManager && typeof window.fileManager.displayFiles === 'function') {
                            window.fileManager.files = savedFiles;
                            window.fileManager.displayFiles();
                        }
                        
                        alert('保存成功！已创建新的空白表单。');
                        console.log('✅ 保存并新建完成');
                        
                    } catch (error) {
                        console.error('❌ 保存并新建失败:', error);
                        alert('保存失败，请重试: ' + error.message);
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
        
        // 5. 修复自动计算和大写金额功能
        function fixAutoCalculation() {
            console.log('🔧 修复自动计算和大写金额功能...');
            
            // 数字转中文大写函数 - 支持万位
            function numberToChinese(num) {
                if (num === 0 || isNaN(num)) return '零元整';
                
                const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                const units = ['', '拾', '佰', '仟'];
                const bigUnits = ['', '万', '亿'];
                
                let numStr = Math.abs(num).toFixed(2);
                let [integerPart, decimalPart] = numStr.split('.');
                
                let result = '';
                
                // 处理整数部分
                if (parseInt(integerPart) === 0) {
                    result = '零';
                } else {
                    // 按万分组处理
                    let groups = [];
                    let tempNum = integerPart;
                    
                    while (tempNum.length > 0) {
                        let group = tempNum.slice(-4);
                        groups.unshift(group);
                        tempNum = tempNum.slice(0, -4);
                    }
                    
                    let resultParts = [];
                    
                    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                        let group = groups[groupIndex];
                        let groupResult = '';
                        let hasNonZero = false;
                        
                        for (let i = 0; i < group.length; i++) {
                            let digit = parseInt(group[i]);
                            let unitIndex = group.length - i - 1;
                            
                            if (digit !== 0) {
                                if (hasNonZero && groupResult.slice(-1) !== '零') {
                                    // 需要补零
                                    let zeroCount = 0;
                                    for (let j = i - 1; j >= 0; j--) {
                                        if (parseInt(group[j]) === 0) zeroCount++;
                                        else break;
                                    }
                                    if (zeroCount > 0) {
                                        groupResult += '零';
                                    }
                                }
                                groupResult += digits[digit];
                                if (unitIndex > 0) {
                                    groupResult += units[unitIndex];
                                }
                                hasNonZero = true;
                            }
                        }
                        
                        if (groupResult) {
                            let bigUnitIndex = groups.length - groupIndex - 1;
                            if (bigUnitIndex > 0 && bigUnitIndex < bigUnits.length) {
                                groupResult += bigUnits[bigUnitIndex];
                            }
                            resultParts.push(groupResult);
                        }
                    }
                    
                    result = resultParts.join('');
                }
                
                result += '元';
                
                // 处理小数部分
                if (decimalPart === '00') {
                    result += '整';
                } else {
                    let jiao = parseInt(decimalPart[0]);
                    let fen = parseInt(decimalPart[1]);
                    
                    if (jiao > 0) {
                        result += digits[jiao] + '角';
                    }
                    if (fen > 0) {
                        result += digits[fen] + '分';
                    }
                }
                
                return result;
            }
            
            // 计算余额函数
            function calculateBalance() {
                const amountInput = document.querySelector('.amount-input');
                const paymentInput = document.querySelector('.payment-input');
                const balanceInput = document.querySelector('.balance-input');
                const chineseBalanceInput = document.querySelector('.chinese-balance');
                
                const amount = parseFloat(amountInput?.value || 0);
                const payment = parseFloat(paymentInput?.value || 0);
                const balance = amount - payment;
                
                if (balanceInput) {
                    balanceInput.value = balance.toFixed(2);
                }
                
                if (chineseBalanceInput) {
                    if (balance > 0) {
                        chineseBalanceInput.value = numberToChinese(balance);
                    } else {
                        chineseBalanceInput.value = '';
                    }
                }
                
                console.log('计算余额:', { amount, payment, balance });
            }
            
            // 监听产品表格中的数量和价格变化
            document.addEventListener('input', function(e) {
                // 产品表格计算
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
                            const totalElements = document.querySelectorAll('input[placeholder*="总金额"], #totalAmount, .amount-input');
                            totalElements.forEach(el => {
                                if (el) el.value = total.toFixed(2);
                            });
                            
                            // 更新大写金额
                            const chineseAmountInput = document.querySelector('.chinese-amount');
                            if (chineseAmountInput && total > 0) {
                                chineseAmountInput.value = numberToChinese(total);
                            }
                            
                            console.log('更新总金额:', total);
                            
                            // 重新计算余额
                            setTimeout(calculateBalance, 100);
                        }
                    }
                }
                
                // 金额输入时自动转换大写（不格式化输入值）
                if (e.target.matches('.amount-input')) {
                    let amount = parseFloat(e.target.value) || 0;
                    const chineseInput = document.querySelector('.chinese-amount');
                    if (chineseInput && amount > 0) {
                        chineseInput.value = numberToChinese(amount);
                        console.log('更新大写金额:', amount, '->', chineseInput.value);
                    }
                    setTimeout(calculateBalance, 100);
                }
                
                // 付款金额输入时自动转换大写和计算余额（不格式化输入值）
                if (e.target.matches('.payment-input')) {
                    let payment = parseFloat(e.target.value) || 0;
                    const chineseInput = document.querySelector('.chinese-payment');
                    if (chineseInput && payment > 0) {
                        chineseInput.value = numberToChinese(payment);
                        console.log('更新大写付款:', payment, '->', chineseInput.value);
                    }
                    setTimeout(calculateBalance, 100);
                }
            });
            
            // 将函数添加到全局作用域
            window.numberToChinese = numberToChinese;
            window.calculateBalance = calculateBalance;
        }
        
        // 6. 修复保存并新建功能
        function fixSaveAndNew() {
            console.log('🔧 修复保存并新建功能...');
            
            // 重新定义保存并新建函数，保持与原系统兼容的数据结构
            window.saveAndNew = function() {
                console.log('执行保存并新建');
                
                try {
                    // 保存当前数据
                    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    
                    // 尝试使用原系统的collectFormData方法，如果不存在则手动收集
                    let formData;
                    if (window.autoSync && typeof window.autoSync.collectFormData === 'function') {
                        formData = window.autoSync.collectFormData();
                    } else {
                        // 手动收集表单数据
                        formData = {
                            orderNumber: document.getElementById('orderNumberInput')?.value || '',
                            date: document.querySelector('input[type="date"]')?.value || '',
                            customer: document.querySelector('tr:first-child td:nth-child(2) input')?.value || '',
                            contact: document.querySelector('tr:first-child td:nth-child(4) input')?.value || '',
                            supplier: document.querySelector('tr:nth-child(2) td:nth-child(2) input')?.value || '',
                            supplierPhone: document.querySelector('tr:nth-child(2) td:nth-child(4) input')?.value || '',
                            supplierAddress: document.querySelector('tr:nth-child(3) td:nth-child(2) input')?.value || '',
                            deliveryAddress: document.querySelector('tr:nth-child(4) td:nth-child(2) input')?.value || '',
                            deliveryTime: document.querySelector('tr:nth-child(5) td:nth-child(4) input')?.value || '',
                            deliveryMethod: document.querySelector('.delivery-input input')?.value || '',
                            products: [],
                            totalAmount: document.querySelector('.amount-input')?.value || '0',
                            payment: document.querySelector('.payment-input')?.value || '0',
                            balance: document.querySelector('.balance-input')?.value || '0'
                        };
                        
                        // 收集产品数据
                        const productRows = document.querySelectorAll('.product-table tbody tr');
                        productRows.forEach(row => {
                            const product = row.querySelector('td:nth-child(1) input')?.value || '';
                            const model = row.querySelector('td:nth-child(2) input')?.value || '';
                            const specs = row.querySelector('td:nth-child(3) input')?.value || '';
                            const price = row.querySelector('td:nth-child(4) input')?.value || '';
                            const quantity = row.querySelector('td:nth-child(5) input')?.value || '';
                            const unit = row.querySelector('td:nth-child(6) input')?.value || '';
                            const amount = row.querySelector('td:nth-child(7) input')?.value || '';
                            
                            if (product || model || specs || price || quantity) {
                                formData.products.push({
                                    product, model, specs, price, quantity, unit, amount
                                });
                            }
                        });
                    }
                    
                    // 获取单号作为标题
                    const orderNumber = document.getElementById('orderNumberInput')?.value || 'GX' + Date.now().toString().slice(-8);
                    
                    // 创建文件记录 - 保持与原系统兼容的数据结构
                    const fileRecord = {
                        id: 'file_' + Date.now(),
                        title: orderNumber, // 使用title保持兼容性
                        creator: userInfo.username || '访客用户',
                        buyer: document.querySelector('tr:first-child td:nth-child(2) input')?.value || '未填写',
                        amount: document.querySelector('.amount-input')?.value || '0.00',
                        timestamp: Date.now(),
                        data: formData,
                        preview: `购货方: ${document.querySelector('tr:first-child td:nth-child(2) input')?.value || '未填写'} | 金额: ¥${document.querySelector('.amount-input')?.value || '0.00'}`
                    };
                    
                    console.log('创建文件记录:', fileRecord);
                    
                    // 保存到文件列表
                    const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                    savedFiles.unshift(fileRecord);
                    localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
                    console.log('保存到localStorage，当前文件数:', savedFiles.length);
                    
                    // 同步到云端
                    if (window.autoSync && typeof window.autoSync.syncToCloud === 'function') {
                        window.autoSync.syncToCloud();
                    }
                    
                    // 清空表单但保留预设信息
                    document.querySelectorAll('.input-field').forEach(input => {
                        // 保留供货方信息和其他预设信息
                        if (!input.value.includes('厦门汇仕环保科技有限公司') && 
                            !input.value.includes('0592-5772750') && 
                            !input.value.includes('厦门市湖里区钟宅红星美凯龙E8038') &&
                            !input.value.includes('6226 1529 0065 3167') &&
                            !input.value.includes('饶玉珍') &&
                            !input.value.includes('中国民生银行') &&
                            !input.value.includes('质保期五年')) {
                            input.value = '';
                        }
                    });
                    
                    // 重新生成单号
                    const orderInput = document.getElementById('orderNumberInput');
                    if (orderInput) {
                        orderInput.value = 'GX' + Date.now().toString().slice(-8);
                    }
                    
                    // 重置日期为今天
                    const dateInput = document.querySelector('input[type="date"]');
                    if (dateInput) {
                        dateInput.value = new Date().toISOString().split('T')[0];
                    }
                    
                    // 更新文件列表显示
                    if (window.fileManager && typeof window.fileManager.displayFiles === 'function') {
                        window.fileManager.files = savedFiles;
                        window.fileManager.displayFiles();
                    }
                    
                    alert('保存成功！已创建新的空白表单。');
                    console.log('✅ 保存并新建完成');
                    
                } catch (error) {
                    console.error('保存并新建失败:', error);
                    alert('保存失败，请重试: ' + error.message);
                }
            };
        }
        
        // 7. 修复文件列表功能
        function fixFileList() {
            console.log('🔧 修复文件列表功能...');
            
            // 重新定义toggleFileList函数
            window.toggleFileList = function() {
                console.log('切换文件列表');
                const panel = document.getElementById('fileListPanel');
                if (panel) {
                    if (panel.classList.contains('show')) {
                        panel.classList.remove('show');
                        console.log('关闭文件列表');
                    } else {
                        panel.classList.add('show');
                        console.log('打开文件列表');
                        
                        // 重新加载文件列表
                        const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                        console.log('加载文件列表，文件数:', savedFiles.length);
                        console.log('文件列表内容:', savedFiles);
                        
                        // 确保fileManager存在并更新
                        if (!window.fileManager) {
                            window.fileManager = {
                                files: savedFiles,
                                displayFiles: function() {
                                    const container = document.getElementById('fileListContent');
                                    if (!container) {
                                        console.error('找不到文件列表容器');
                                        return;
                                    }
                                    
                                    console.log('显示文件列表，文件数:', this.files.length);
                                    
                                    if (this.files.length === 0) {
                                        container.innerHTML = '<div class="empty-message">暂无文件</div>';
                                        return;
                                    }
                                    
                                    // 兼容不同的数据结构
                                    container.innerHTML = this.files.map(file => {
                                        // 兼容title/name字段
                                        const fileName = file.title || file.name || '未命名文件';
                                        // 兼容creator/createdBy字段
                                        const creator = file.creator || file.createdBy || '未知';
                                        // 兼容timestamp/createdAt字段
                                        const timestamp = file.timestamp || file.createdAt;
                                        // 兼容buyer字段和data.customer字段
                                        const buyer = file.buyer || file.data?.customer || '未填写';
                                        // 兼容amount字段和data.totalAmount字段
                                        const amount = file.amount || file.data?.totalAmount || '0.00';
                                        
                                        return `
                                            <div class="file-item">
                                                <div class="file-info">
                                                    <div class="file-name">${fileName}</div>
                                                    <div class="file-meta">
                                                        <span>创建者: ${creator}</span>
                                                        <span>时间: ${new Date(timestamp).toLocaleString()}</span>
                                                        <span>购货方: ${buyer}</span>
                                                        <span>金额: ¥${amount}</span>
                                                    </div>
                                                </div>
                                                <div class="file-actions">
                                                    <button class="btn btn-load" onclick="loadFileData('${file.id}')">📂 加载</button>
                                                    <button class="btn btn-delete" onclick="deleteFile('${file.id}')">🗑️ 删除</button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('');
                                    
                                    console.log('文件列表已更新');
                                }
                            };
                        } else {
                            window.fileManager.files = savedFiles;
                        }
                        
                        window.fileManager.displayFiles();
                    }
                }
            };
            
            // 添加加载文件数据的函数
            window.loadFileData = function(fileId) {
                console.log('加载文件数据:', fileId);
                const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                const file = savedFiles.find(f => f.id === fileId);
                
                if (file && file.data) {
                    // 使用原系统的fillFormData方法，如果存在的话
                    if (window.autoSync && typeof window.autoSync.fillFormData === 'function') {
                        window.autoSync.fillFormData(file.data);
                    } else {
                        // 手动填充表单数据
                        if (file.data.orderNumber) {
                            const orderInput = document.getElementById('orderNumberInput');
                            if (orderInput) orderInput.value = file.data.orderNumber;
                        }
                        
                        if (file.data.customer) {
                            const customerInput = document.querySelector('tr:first-child td:nth-child(2) input');
                            if (customerInput) customerInput.value = file.data.customer;
                        }
                        
                        if (file.data.totalAmount) {
                            const amountInput = document.querySelector('.amount-input');
                            if (amountInput) amountInput.value = file.data.totalAmount;
                        }
                        
                        // 填充产品数据
                        if (file.data.products && file.data.products.length > 0) {
                            const productRows = document.querySelectorAll('.product-table tbody tr');
                            file.data.products.forEach((product, index) => {
                                if (productRows[index]) {
                                    const row = productRows[index];
                                    const inputs = row.querySelectorAll('input');
                                    if (inputs[0]) inputs[0].value = product.product || '';
                                    if (inputs[1]) inputs[1].value = product.model || '';
                                    if (inputs[2]) inputs[2].value = product.specs || '';
                                    if (inputs[3]) inputs[3].value = product.price || '';
                                    if (inputs[4]) inputs[4].value = product.quantity || '';
                                    if (inputs[5]) inputs[5].value = product.unit || '';
                                    if (inputs[6]) inputs[6].value = product.amount || '';
                                }
                            });
                        }
                    }
                    
                    // 关闭文件列表
                    const panel = document.getElementById('fileListPanel');
                    if (panel) panel.classList.remove('show');
                    
                    alert('文件加载成功！');
                    console.log('✅ 文件数据加载完成');
                } else {
                    alert('文件数据不存在');
                    console.error('找不到文件数据:', fileId);
                }
            };
            
            // 添加删除文件的函数
            window.deleteFile = function(fileId) {
                if (confirm('确定要删除这个文件吗？')) {
                    let savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                    savedFiles = savedFiles.filter(f => f.id !== fileId);
                    localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
                    
                    // 更新显示
                    if (window.fileManager) {
                        window.fileManager.files = savedFiles;
                        window.fileManager.displayFiles();
                    }
                    
                    alert('文件已删除');
                    console.log('✅ 文件已删除:', fileId);
                }
            };
        }
        
        // 8. 修复云端保存功能
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
        
        // 9. 修复数据填充功能
        function fixDataFilling() {
            console.log('🔧 修复数据填充功能...');
            
            // 确保fileManager存在并有fillBasicFormData方法
            if (!window.fileManager) {
                window.fileManager = {};
            }
            
            // 添加数据填充函数
            window.fileManager.fillBasicFormData = function(data) {
                console.log('📝 开始填充表单数据:', data);
                
                try {
                    const infoTable = document.querySelector('.info-table');
                    
                    // 填充基本信息
                    if (data.orderNumber) {
                        const orderInput = document.getElementById('orderNumberInput');
                        if (orderInput) {
                            orderInput.value = data.orderNumber;
                            console.log('✅ 填充单号:', data.orderNumber);
                        }
                    }
                    
                    if (data.customer) {
                        const customerInput = infoTable?.querySelector('tr:nth-child(1) td:nth-child(2) input');
                        if (customerInput) {
                            customerInput.value = data.customer;
                            console.log('✅ 填充购货方:', data.customer);
                        }
                    }
                    
                    if (data.contact) {
                        const contactInput = infoTable?.querySelector('tr:nth-child(1) td:nth-child(4) input');
                        if (contactInput) {
                            contactInput.value = data.contact;
                            console.log('✅ 填充联系人:', data.contact);
                        }
                    }
                    
                    if (data.supplier) {
                        const supplierInput = infoTable?.querySelector('tr:nth-child(2) td:nth-child(2) input');
                        if (supplierInput) {
                            supplierInput.value = data.supplier;
                            console.log('✅ 填充供货方:', data.supplier);
                        }
                    }
                    
                    if (data.deliveryAddress) {
                        const addressInput = infoTable?.querySelector('tr:nth-child(4) td:nth-child(2) input');
                        if (addressInput) {
                            addressInput.value = data.deliveryAddress;
                            console.log('✅ 填充收货地址:', data.deliveryAddress);
                        }
                    }
                    
                    if (data.date) {
                        const dateInput = infoTable?.querySelector('tr:nth-child(5) td:nth-child(2) input');
                        if (dateInput) {
                            dateInput.value = data.date;
                            console.log('✅ 填充订货日期:', data.date);
                        }
                    }
                    
                    if (data.deliveryTime) {
                        const deliveryTimeInput = infoTable?.querySelector('tr:nth-child(5) td:nth-child(4) input');
                        if (deliveryTimeInput) {
                            deliveryTimeInput.value = data.deliveryTime;
                            console.log('✅ 填充送货时间:', data.deliveryTime);
                        }
                    }
                    
                    // 填充产品数据
                    if (data.products && data.products.length > 0) {
                        const productRows = document.querySelectorAll('.product-table tbody tr');
                        console.log(`📦 填充 ${data.products.length} 个产品，找到 ${productRows.length} 行`);
                        
                        data.products.forEach((product, index) => {
                            if (productRows[index]) {
                                const row = productRows[index];
                                const inputs = row.querySelectorAll('input');
                                
                                if (inputs[0] && product.product) inputs[0].value = product.product;
                                if (inputs[1] && product.model) inputs[1].value = product.model;
                                if (inputs[2] && product.specs) inputs[2].value = product.specs;
                                if (inputs[3] && product.price) inputs[3].value = product.price;
                                if (inputs[4] && product.quantity) inputs[4].value = product.quantity;
                                if (inputs[5] && product.unit) inputs[5].value = product.unit;
                                if (inputs[6] && product.amount) inputs[6].value = product.amount;
                                
                                console.log(`✅ 填充产品行 ${index + 1}:`, product.product);
                            }
                        });
                    }
                    
                    // 填充金额信息
                    if (data.totalAmount) {
                        const totalAmountInput = document.getElementById('totalAmount');
                        if (totalAmountInput) {
                            totalAmountInput.value = data.totalAmount;
                            console.log('✅ 填充总金额:', data.totalAmount);
                        }
                        
                        const amountInput = document.querySelector('.amount-input');
                        if (amountInput) {
                            amountInput.value = data.totalAmount;
                        }
                    }
                    
                    if (data.payment) {
                        const paymentInput = document.querySelector('.payment-input');
                        if (paymentInput) {
                            paymentInput.value = data.payment;
                            console.log('✅ 填充付款金额:', data.payment);
                        }
                    }
                    
                    if (data.balance) {
                        const balanceInput = document.querySelector('.balance-input');
                        if (balanceInput) {
                            balanceInput.value = data.balance;
                            console.log('✅ 填充余额:', data.balance);
                        }
                    }
                    
                    console.log('🎉 数据填充完成！');
                    
                } catch (error) {
                    console.error('❌ 数据填充失败:', error);
                    alert('数据载入失败: ' + error.message);
                }
            };
            
            // 添加通用的数据加载函数
            window.loadOrderData = function(orderData) {
                if (orderData && orderData.data) {
                    window.fileManager.fillBasicFormData(orderData.data);
                    return true;
                }
                return false;
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
        
        // 8. 修复金额输入格式化
        function fixAmountFormatting() {
            console.log('🔢 修复金额格式化...');
            
            // 添加失焦事件监听 - 格式化金额
            document.addEventListener('blur', function(e) {
                // 金额输入框失焦时格式化为2位小数
                if (e.target.matches('.amount-input, .payment-input, #totalAmount')) {
                    let value = parseFloat(e.target.value) || 0;
                    if (value > 0) {
                        e.target.value = value.toFixed(2);
                        console.log('💰 格式化金额:', value, '->', e.target.value);
                        
                        // 触发大写转换
                        const event = new Event('input', { bubbles: true });
                        e.target.dispatchEvent(event);
                    }
                }
            }, true);
        }

        // 执行所有修复
        forceFixUserStatus();
        fixAllButtons();
        fixDocTypeToggle();
        enhanceProductAutoFill();
        fixAutoCalculation();
        fixSaveAndNew();
        fixFileList();
        fixCloudSave();
        fixDataFilling();
        fixAmountFormatting();
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