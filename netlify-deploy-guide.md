# 📦 Netlify 部署指南

## 🎯 部署清单

### 需要上传到 Netlify 的文件

#### ✅ 核心系统文件（已更新）
- `index.html` - 入口页面
- `index-enhanced.html` - 主系统（修复了同步、登录、产品价格等问题）
- `login.html` - 登录页面（修复了数据格式问题）
- `register.html` - 注册页面（修复了数据格式问题）
- `user-management.html` - 用户管理页面
- `data-manager.html` - 数据管理中心

#### 🆕 新增功能文件
- `github-token-setup.html` - GitHub Token 设置指南
- `test-sync.html` - 同步功能测试工具
- `test-login.html` - 登录注册测试工具

## 🚀 部署步骤

### 方法1：完整部署（推荐）
1. 将整个 `gouxiaodan2025/gouxiaodan2025` 文件夹压缩为 ZIP
2. 登录 Netlify
3. 拖拽 ZIP 文件到 Netlify 部署区域
4. 等待部署完成

### 方法2：Git 部署
1. 将文件推送到 GitHub 仓库
2. 在 Netlify 中连接 GitHub 仓库
3. 设置自动部署

## 🔗 访问链接

部署完成后，您可以访问：

- **主页面**: `https://your-site.netlify.app/`
- **登录页面**: `https://your-site.netlify.app/login.html`
- **注册页面**: `https://your-site.netlify.app/register.html`
- **Token设置**: `https://your-site.netlify.app/github-token-setup.html`
- **同步测试**: `https://your-site.netlify.app/test-sync.html`
- **用户管理**: `https://your-site.netlify.app/user-management.html`
- **数据管理**: `https://your-site.netlify.app/data-manager.html`

## ⚙️ 部署后配置

### 1. 设置 GitHub API Token
- 访问 `github-token-setup.html` 页面
- 按照指南创建和设置 Token
- 在 PC 和手机端都设置相同的 Token

### 2. 测试功能
- 使用 `test-login.html` 测试登录注册
- 使用 `test-sync.html` 测试同步功能
- 在实际环境中测试所有功能

### 3. 用户培训
- 向用户说明新的 Token 设置流程
- 提供帮助页面链接
- 说明同步功能的使用方法

## 🔧 故障排除

### 同步问题
1. 检查 GitHub API Token 是否正确设置
2. 确保 PC 和手机端使用相同 Token
3. 使用测试页面诊断问题

### 登录问题
1. 清除浏览器缓存
2. 使用测试页面修复数据格式
3. 重新注册用户

### 404 错误
1. 确保所有文件都已上传
2. 检查文件名是否正确
3. 验证 Netlify 部署状态

## ✅ 验证清单

部署完成后，请验证：

- [ ] 主页面正常加载
- [ ] 登录注册功能正常
- [ ] 同步功能正常工作
- [ ] 所有链接都能正常访问
- [ ] 移动端显示正常
- [ ] 打印功能正常
- [ ] 数据管理功能正常

## 📞 技术支持

如果遇到问题：
1. 查看浏览器控制台错误信息
2. 使用测试页面诊断问题
3. 检查网络连接和防火墙设置
4. 确认 GitHub API 访问正常