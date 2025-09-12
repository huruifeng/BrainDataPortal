# Python 开发环境安装

## 1. 工具选择
使用Python进行编程，首先要安装Python解释器和代码编辑器。

- Python解释器：用于解释Python语法和执行Python代码/程序/脚本/模块，这是运行Python程序的基础

- Python代码编辑器：用于编辑Python代码，
> - Python有自带的代码编辑器 - IDLE，可以编写运行Python脚本。
> - 可以使用文本编辑器编写，比如Sublime Text，
> - 可以使用更高级的集成开发环境（Integrated Development Environment，IDE），如PyCharm，VS Code等

### 1.1 Python解释器
使用Miniconda创建虚拟环境，可以隔离不同项目的依赖包，避免冲突。Miniconda具有以下优点：

- ✅ **轻量化**：仅包含conda+Python（Anaconda的精简版）

- ✅ **环境隔离**：可创建独立Python环境避免版本冲突

- ✅ **跨平台**：完美支持Windows/macOS/Linux

- ✅ **科学计算**：预编译二进制包加速安装

### 1.2 集成开发环境
最常用的Python代码编写软件是VS Code和PyCharm CE，两者比较如下：

| 特性                | VS Code                     | PyCharm CE                 |
|---------------------|----------------------------|---------------------------|
| 启动速度            | ⚡️ 快速                    | 🐢 较慢                   |
| 内存占用            | 🟢 500MB~1GB               | 🟠 1GB~2GB                |
| Python支持          | 通过插件实现               | 原生深度支持              |
| 适合场景            | 脚本/快速开发              | 大型项目/专业开发         |

---

## 2. Miniconda安装

### 2.1 Windows系统
1. **下载安装包**  
    - [下载页面](https://www.anaconda.com/download/success){:target="_blank"}
    - 直接下载[Miniconda Windows 64-bit](https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe){:target="_blank"} 

2. **安装过程**  
    - 双击`.exe`文件启动安装向导
    - 关键配置选项：
     ```
     [ ] All Users → 保持取消（推荐个人安装）
     [x] Add Miniconda3 to PATH
     [x] Register as system Python 3.x
     ```


3. **验证安装**  
   打开新的PowerShell或Command Prompt：
   ```powershell
   conda --version  # 应显示类似 conda 23.11.0
   conda list       # 查看基础环境包列表
   ```

### 2.2macOS系统
1. **终端安装**  
   ```bash
   # Intel芯片
   curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
   sh Miniconda3-latest-MacOSX-x86_64.sh

   # M1/M2芯片
   curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
   sh Miniconda3-latest-MacOSX-arm64.sh
   ```

2. **路径配置**  
   ```bash
   # zsh用户（macOS Catalina+ 默认）
   echo 'export PATH="$HOME/miniconda3/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc

   # bash用户
   echo 'export PATH="$HOME/miniconda3/bin:$PATH"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

3. **初始化设置**  
   ```bash
   conda config --set auto_activate_base false  # 禁用自动激活base环境, 不推荐
   conda init zsh  # 或 conda init bash
   ```

---

## 3. 环境管理

### 3.1 基础操作
```bash
# 创建指定Python版本的环境
conda create --name webdev python=3.11

# 列举环境
conda env list

# 激活环境
conda activate webdev

# 安装包（conda优先）
conda install flask django

# 使用pip安装特殊包
pip install fastapi uvicorn

# 导出环境配置
conda env export > environment.yml

# 克隆环境
conda create --name webdev-backup --clone webdev

# 删除环境
conda remove --name temp-env --all
```

### 3.2 多环境策略
| 环境名称    | Python版本 | 主要用途       | 典型包                     |
|------------|------------|----------------|---------------------------|
| base       | 3.10       | 系统默认       | pip, wheel                |
| data-sci   | 3.9        | 数据分析       | pandas, numpy, matplotlib |
| ml         | 3.8        | 机器学习       | tensorflow, scikit-learn  |
| web        | 3.11       | Web开发        | django, flask             |

---

## 4. IDE配置

### 4.1 Visual Studio Code
1. **核心插件安装** 
    - Python（Microsoft官方）
    - Pylance（类型检查）
    - Jupyter（笔记本支持）
    - Conda Tools（环境管理）

2. **选择解释器**  
   `Ctrl+Shift+P` → 输入"Python: Select Interpreter"  
   选择环境：`~/miniconda3/envs/[环境名称]/python`

3. **调试配置**  
   创建`.vscode/launch.json`：
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Python: Current File",
         "type": "python",
         "request": "launch",
         "program": "${file}",
         "console": "integratedTerminal",
         "env": {
           "PYTHONPATH": "${workspaceFolder}"
         }
       }
     ]
   }
   ```

### 4.2 PyCharm Community
1. **新建Conda项目**  
   File → New Project → 选择"Conda"环境  

2. **终端集成**  
   确保PyCharm终端显示正确环境。
   若未显示，需在设置中启用"Activate conda environment"

3. **设置默认解释器**  
   File → Settings → Project → Python Interpreter  

---

## 5. 最佳实践

### 5.1 环境管理
1. **命名规范**  
    - 使用小写+短横线（如ml-nlp）
    - 避免使用特殊字符
    - 添加版本后缀（py38-torch）

2. **环境清理**  
   ```bash
   conda clean --all       # 清理所有缓存
   conda remove --name old-env --all  # 删除旧环境
   ```

### 5.2 包管理
```bash
# 确认当前环境
conda env list
conda activate [环境名称]

# 优先使用conda安装科学计算包
conda install numpy scipy

# 使用pip安装conda仓库没有的包
pip install opencv-python-headless

# 避免混用安装器（可能导致依赖冲突）
```

---

## 6. 故障排查

### 6.1 Windows问题
**症状**：'conda' 不是内部或外部命令  
**解决**：

方法1. 使用开始菜单中的"Anaconda Prompt"。

方法2. 手动添加PATH：
   ```powershell
   $env:Path += ";C:\Users\username\miniconda3\Scripts"
   ```

### 6.2 macOS问题
**症状**：zsh: command not found: conda  
**解决**：
```bash
# 确保初始化脚本正确
echo 'eval "$(/opt/homebrew/Caskroom/miniconda/base/bin/conda shell.zsh hook)"' >> ~/.zshrc
source ~/.zshrc
```

### 6.3 通用问题
**症状**：环境激活无效  
**解决步骤**：

1. 更新conda基础环境
   ```bash
   conda update -n base -c defaults conda
   ```
2. 重新初始化shell
   ```bash
   conda init --all
   ```
3. 重启终端

---

## 7. 环境验证
创建`env_check.py`：
```python
import sys, platform

print("✅ 环境验证报告")
print(f"操作系统: {platform.system()} {platform.release()}")
print(f"Python路径: {sys.executable}")
print(f"Python版本: {platform.python_version()}")
print("\n已安装包列表:")

!conda list  # 此命令需要在支持Magics命令的环境运行，例如在Jupyter notebook中
```

**验证步骤**：
1. 激活目标环境 -> `conda activate [环境名称]`
2. 运行脚本 -> `python env_check.py`
3. 确认输出信息正确 

---

> 🚀 **环境配置完成！**  
> 建议后续操作：  
> 1. 定期执行 `conda update --all` 更新所有包  
> 2. 重要项目使用 `environment.yml` 备份环境  
> 3. 不同项目使用独立环境隔离依赖


---
## 8. 学习资源
1. [Conda速查表](https://docs.conda.io/projects/conda/en/latest/user-guide/cheatsheet.html){:target="_blank"}
2. [VS Code Python教程](https://code.visualstudio.com/docs/python/python-tutorial){:target="_blank"}
3. [PyCharm Conda支持文档](https://www.jetbrains.com/help/pycharm/conda-support-creating-conda-virtual-environment.html){:target="_blank"}
4. [Python虚拟环境终极指南](https://realpython.com/python-virtual-environments-a-primer/){:target="_blank"}

---
