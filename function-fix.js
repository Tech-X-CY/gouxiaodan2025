// 兼容性功能修复补丁 - 针对现有系统结构进行精确修复
// 解决：访客模式、按钮失效、预设信息、预/结算切换、文件加载、保存功能等问题

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
        
        /* 数据管理UI优化 - 针对实际HTML结构 */
        .data-table {
            font-size: 12px !important;
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 15px 0 !important;
        }
        
        .data-table th {
            font-size: 12px !important;
            padding: 12px 8px !important;
            background: #f8f9fa !important;
            border: 1px solid #dee2e6 !important;
            font-weight: 600 !important;
        }
        
        .data-table td {
            font-size: 11px !important;
            padding: 10px 8px !important;
            border: 1px solid #dee2e6 !important;
            vertical-align: middle !important;
        }
        
        .data-table button {
            font-size: 10px !important;
            padding: 4px 8px !important;
            margin-right: 4px !important;
            border-radius: 3px !important;
        }
        
        /* 模态框内容优化 */
        #modalContent {
            max-height: 70vh !important;
            overflow-y: auto !important;
            padding: 20px !important;
        }
        
        /* 卡片样式优化 */
        .card {
            padding: 20px !important;
            margin: 15px !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            background: white !important;
        }
        
        .card h3 {
            font-size: 16px !important;
            margin-bottom: 15px !important;
        }
        
        .card .stat-number {
            font-size: 24px !important;
            font-weight: bold !important;
            color: #007bff !important;
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
                
                if (userInfo && userInfo.username && userInfo.username.trim() !== '') {
                    console.log('✅ 用户已登录，强制显示用户信息');
                    
                    // 强制显示用户信息
                    if (userName) {
                        userName.textContent = userInfo.username;
                    }
                    if (userRole) {
                        userRole.textContent = userInfo.role || '普通用户';
                    }
                    if (userAvatar) {
                        userAvatar.textContent = userInfo.username.charAt(0).toUpperCase();
                    }
                    
                    // 强制显示用户栏，隐藏登录提示
                    if (userBar) {
                        userBar.style.display = 'flex';
                        userBar.style.visibility = 'visible';
                    }
                    if (loginPrompt) {
                        loginPrompt.style.display = 'none';
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
            
            // 强制绑定设备同步按钮
            const syncButton = document.querySelector('.btn-sync');
            if (syncButton) {
                // 移除现有的onclick属性
                syncButton.removeAttribute('onclick');
                
                // 添加新的事件监听器
                syncButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔄 设备同步按钮被点击');
                    
                    // 直接调用原有的 toggleDevicePanel 函数
                    if (typeof window.toggleDevicePanel === 'function') {
                        window.toggleDevicePanel();
                        console.log('✅ 调用原有 toggleDevicePanel 函数');
                    } else {
                        // 如果原函数不存在，手动实现
                        const panel = document.getElementById('devicePanel');
                        if (panel) {
                            panel.classList.toggle('show');
                            console.log('切换设备面板显示状态');
                        }
                    }
                });
                
                console.log('✅ 设备同步按钮事件绑定成功');
            }

            // 重新绑定其他按钮
            const buttons = [
                { selector: '.btn-print', handler: () => {
                    console.log('🖨️ 执行打印功能');
                    const elementsToHide = document.querySelectorAll('.action-buttons, .sync-status, .device-panel, .file-list-panel, .user-bar, .login-prompt, .notice');
                    const originalStyles = [];
                    
                    elementsToHide.forEach((el, index) => {
                        originalStyles[index] = el.style.display;
                        el.style.display = 'none';
                    });
                    
                    window.print();
                    
                    setTimeout(() => {
                        elementsToHide.forEach((el, index) => {
                            el.style.display = originalStyles[index];
                        });
                    }, 1000);
                }},
                { selector: '.btn-files', handler: () => {
                    console.log('📁 切换文件列表');
                    const panel = document.getElementById('fileListPanel');
                    if (panel) {
                        panel.classList.toggle('show');
                        if (panel.classList.contains('show')) {
                            // 强制刷新文件列表
                            refreshFileList();
                        }
                    }
                }},
                { selector: '.btn-save', handler: () => {
                    console.log('☁️ 保存到云端');
                    saveToCloud();
                }},
                { selector: '.btn-data', handler: () => {
                    console.log('打开数据管理');
                    window.open('./data-manager.html', '_blank');
                }}
            ];

            buttons.forEach(btn => {
                const elements = document.querySelectorAll(btn.selector);
                elements.forEach(el => {
                    el.removeEventListener('click', btn.handler);
                    el.addEventListener('click', btn.handler);
                });
            });
        }

        // 3. 修复预/结算切换功能
        function fixDocTypeToggle() {
            console.log('🔄 修复预/结算切换...');
            
            const wrapper = document.querySelector('.document-type-wrapper');
            const dropdown = document.getElementById('docTypeDropdown');
            
            if (wrapper && dropdown) {
                wrapper.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                    console.log('切换下拉菜单显示状态');
                });

                // 下拉选项点击事件
                const options = dropdown.querySelectorAll('.dropdown-option');
                options.forEach(option => {
                    option.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const text = this.textContent.trim();
                        const textElement = wrapper.querySelector('.doc-type-text');
                        if (textElement) {
                            textElement.textContent = text;
                        }
                        dropdown.classList.remove('show');
                        console.log('选择了:', text);
                    });
                });
            }
        }

        // 4. 修复自动计算功能
        function fixAutoCalculation() {
            console.log('🧮 修复自动计算...');
            
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
                const totalAmountInput = document.querySelector('.amount-input, #totalAmount');
                const paymentInput = document.querySelector('.payment-input');
                const balanceInput = document.querySelector('.balance-input');
                
                if (totalAmountInput && paymentInput && balanceInput) {
                    const totalAmount = parseFloat(totalAmountInput.value) || 0;
                    const payment = parseFloat(paymentInput.value) || 0;
                    const balance = totalAmount - payment;
                    
                    balanceInput.value = balance.toFixed(2);
                    console.log('计算余额:', totalAmount, '-', payment, '=', balance);
                }
            }

            // 添加失焦事件监听 - 格式化金额
            document.addEventListener('blur', function(e) {
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

            // 添加输入事件监听
            document.addEventListener('input', function(e) {
                // 金额输入时自动转换大写（不格式化输入值）
                if (e.target.matches('.amount-input')) {
                    let amount = parseFloat(e.target.value) || 0;
                    const chineseInput = document.querySelector('.chinese-amount');
                    if (chineseInput && amount > 0) {
                        chineseInput.value = numberToChinese(amount);
                    }
                    setTimeout(calculateBalance, 100);
                }
                
                // 付款金额输入时自动转换大写和计算余额（不格式化输入值）
                if (e.target.matches('.payment-input')) {
                    let payment = parseFloat(e.target.value) || 0;
                    const chineseInput = document.querySelector('.chinese-payment');
                    if (chineseInput && payment > 0) {
                        chineseInput.value = numberToChinese(payment);
                    }
                    setTimeout(calculateBalance, 100);
                }
            });
        }

        // 5. 统一保存功能
        function unifiedSave(openNew = false) {
            console.log('💾 执行统一保存功能，新建:', openNew);
            
            try {
                // 收集表单数据
                const formData = collectFormData();
                
                if (!formData) {
                    alert('数据收集失败，请检查表单内容');
                    return false;
                }
                
                // 生成文件ID和名称
                const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                const orderNumber = formData.orderNumber || ('TX' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + 'HS' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
                
                // 创建文件记录
                const fileRecord = {
                    id: fileId,
                    name: `购销单_${orderNumber}_${new Date().toLocaleDateString()}`,
                    title: `购销单_${orderNumber}`,
                    creator: formData.creator,
                    createdBy: formData.creator,
                    buyer: formData.customer,
                    amount: formData.totalAmount,
                    timestamp: Date.now(),
                    createdAt: Date.now(),
                    data: formData
                };
                
                // 保存到localStorage
                const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                savedFiles.push(fileRecord);
                localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
                
                console.log('✅ 文件保存成功:', fileRecord);
                
                // 更新文件列表显示
                refreshFileList();
                
                // 如果需要新建，清空表单
                if (openNew) {
                    setTimeout(() => {
                        clearForm();
                        alert('保存成功！已创建新的空白表单。');
                    }, 500);
                } else {
                    alert('保存成功！');
                }
                
                return true;
                
            } catch (error) {
                console.error('保存失败:', error);
                alert('保存失败: ' + error.message);
                return false;
            }
        }

        // 收集表单数据函数
        function collectFormData() {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                
                // 基本信息表格
                const infoTable = document.querySelector('.info-table');
                
                const data = {
                    // 用户信息
                    creator: userInfo.username || '未知用户',
                    
                    // 基本信息
                    customer: infoTable?.querySelector('tr:nth-child(1) td:nth-child(2) input')?.value || '',
                    contact: infoTable?.querySelector('tr:nth-child(1) td:nth-child(4) input')?.value || '',
                    supplier: infoTable?.querySelector('tr:nth-child(2) td:nth-child(2) input')?.value || '',
                    deliveryAddress: infoTable?.querySelector('tr:nth-child(4) td:nth-child(2) input')?.value || '',
                    date: infoTable?.querySelector('tr:nth-child(5) td:nth-child(2) input')?.value || '',
                    deliveryTime: infoTable?.querySelector('tr:nth-child(5) td:nth-child(4) input')?.value || '',
                    
                    // 产品数据
                    products: [],
                    
                    // 金额信息
                    totalAmount: document.querySelector('.amount-input, #totalAmount')?.value || '0.00',
                    payment: document.querySelector('.payment-input')?.value || '0.00',
                    balance: document.querySelector('.balance-input')?.value || '0.00',
                    
                    // 订单号
                    orderNumber: 'TX' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + 'HS' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
                    
                    // 时间戳
                    timestamp: Date.now()
                };
                
                // 收集产品数据
                const productRows = document.querySelectorAll('.product-table tbody tr');
                productRows.forEach((row, index) => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length >= 7) {
                        const product = {
                            product: inputs[0]?.value || '',
                            model: inputs[1]?.value || '',
                            specs: inputs[2]?.value || '',
                            price: inputs[3]?.value || '',
                            quantity: inputs[4]?.value || '',
                            unit: inputs[5]?.value || '',
                            amount: inputs[6]?.value || ''
                        };
                        
                        // 只保存有内容的产品行
                        if (product.product || product.model || product.specs) {
                            data.products.push(product);
                        }
                    }
                });
                
                console.log('📋 收集到的表单数据:', data);
                return data;
                
            } catch (error) {
                console.error('数据收集失败:', error);
                return null;
            }
        }

        // 刷新文件列表
        function refreshFileList() {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            
            // 更新文件计数显示
            const fileCountElements = document.querySelectorAll('.file-count');
            fileCountElements.forEach(el => {
                el.textContent = savedFiles.length;
            });
            
            // 更新最后保存时间显示
            if (savedFiles.length > 0) {
                const lastFile = savedFiles[savedFiles.length - 1];
                const lastSaveElements = document.querySelectorAll('.last-save');
                lastSaveElements.forEach(el => {
                    const lastSaveTime = new Date(lastFile.timestamp || lastFile.createdAt).toLocaleDateString();
                    el.textContent = lastSaveTime;
                });
            }
            
            // 如果文件列表面板是打开的，重新生成列表
            const panel = document.getElementById('fileListPanel');
            const container = document.getElementById('fileListContent');
            
            if (panel && panel.classList.contains('show') && container) {
                if (savedFiles.length === 0) {
                    container.innerHTML = '<div class="empty-message" style="padding: 20px; text-align: center; color: #666;">暂无文件</div>';
                } else {
                    const fileListHTML = savedFiles.map(file => {
                        const fileName = file.title || file.name || '未命名文件';
                        const creator = file.creator || file.createdBy || '未知';
                        const buyer = file.buyer || (file.data && file.data.customer) || '未填写';
                        const amount = file.amount || (file.data && file.data.totalAmount) || '0.00';
                        const timestamp = new Date(file.timestamp || file.createdAt).toLocaleString();
                        
                        return `
                            <div class="file-item" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: white;">
                                <h4 style="margin: 0 0 10px 0; color: #333;">${fileName}</h4>
                                <p style="margin: 5px 0; color: #666; font-size: 14px;">创建者: ${creator} | 购货方: ${buyer}</p>
                                <p style="margin: 5px 0; color: #666; font-size: 14px;">金额: ¥${amount} | 时间: ${timestamp}</p>
                                <div style="margin-top: 10px;">
                                    <button onclick="loadFile('${file.id}')" style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-right: 8px;">📂 加载</button>
                                    <button onclick="deleteFile('${file.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">🗑️ 删除</button>
                                </div>
                            </div>
                        `;
                    }).join('');
                    
                    container.innerHTML = fileListHTML;
                }
            }
            
            console.log('📊 文件列表已刷新，总文件数:', savedFiles.length);
        }

        // 加载文件函数
        function loadFile(fileId) {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            const file = savedFiles.find(f => f.id === fileId);
            
            if (file && file.data) {
                fillFormData(file.data);
                alert('文件加载成功！');
            } else {
                alert('文件不存在或数据损坏！');
            }
        }

        // 填充表单数据函数
        function fillFormData(data) {
            try {
                console.log('🎯 开始填充表单数据:', data);
                
                // 基本信息表格
                const infoTable = document.querySelector('.info-table');
                
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
                    const totalAmountInput = document.querySelector('.amount-input, #totalAmount');
                    if (totalAmountInput) {
                        totalAmountInput.value = data.totalAmount;
                        console.log('✅ 填充总金额:', data.totalAmount);
                        
                        // 触发大写转换
                        const event = new Event('input', { bubbles: true });
                        totalAmountInput.dispatchEvent(event);
                    }
                }
                
                if (data.payment) {
                    const paymentInput = document.querySelector('.payment-input');
                    if (paymentInput) {
                        paymentInput.value = data.payment;
                        console.log('✅ 填充付款金额:', data.payment);
                        
                        // 触发大写转换
                        const event = new Event('input', { bubbles: true });
                        paymentInput.dispatchEvent(event);
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
        }

        // 清空表单函数
        function clearForm() {
            // 清空基本信息
            const infoInputs = document.querySelectorAll('.info-table input');
            infoInputs.forEach(input => input.value = '');
            
            // 清空产品表格
            const productInputs = document.querySelectorAll('.product-table tbody input');
            productInputs.forEach(input => input.value = '');
            
            // 清空金额信息
            const amountInputs = document.querySelectorAll('.amount-input, .payment-input, .balance-input, .chinese-amount, .chinese-payment');
            amountInputs.forEach(input => input.value = '');
            
            console.log('🧹 表单已清空');
        }

        // 保存到云端函数
        function saveToCloud() {
            // 先执行本地保存
            if (unifiedSave(false)) {
                // 如果本地保存成功，再执行云端同步
                if (window.autoSync && typeof window.autoSync.syncToCloud === 'function') {
                    window.autoSync.syncToCloud();
                    console.log('☁️ 已触发云端同步');
                } else {
                    console.log('⚠️ 云端同步功能不可用');
                }
            }
        }

        // 绑定保存相关按钮
        function bindSaveButtons() {
            // 保存并新建按钮
            const saveNewButton = document.querySelector('.btn-save-new');
            if (saveNewButton) {
                saveNewButton.removeEventListener('click', handleSaveAndNew);
                saveNewButton.addEventListener('click', handleSaveAndNew);
                console.log('✅ 保存并新建按钮绑定成功');
            }
            
            // 保存到云端按钮
            const saveCloudButton = document.querySelector('.btn-save');
            if (saveCloudButton) {
                saveCloudButton.removeEventListener('click', saveToCloud);
                saveCloudButton.addEventListener('click', saveToCloud);
                console.log('✅ 保存到云端按钮绑定成功');
            }
        }

        function handleSaveAndNew() {
            unifiedSave(true);
        }

        // 全局函数暴露
        window.loadFile = loadFile;
        window.deleteFile = function(fileId) {
            if (confirm('确定要删除这个文件吗？')) {
                const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                const updatedFiles = savedFiles.filter(f => f.id !== fileId);
                localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
                refreshFileList();
                alert('文件已删除！');
            }
        };

        // 外部点击关闭下拉菜单
        function fixOutsideClick() {
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.document-type-wrapper')) {
                    const dropdown = document.getElementById('docTypeDropdown');
                    if (dropdown && dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                }
            });
        }

        // 执行所有修复
        forceFixUserStatus();
        fixAllButtons();
        fixDocTypeToggle();
        fixAutoCalculation();
        bindSaveButtons();
        refreshFileList();
        fixOutsideClick();
        
        console.log('✅ 所有功能修复完成！');
    }

    // 等待页面加载完成后执行修复
    waitForFullLoad(applyMainFixes);
})();