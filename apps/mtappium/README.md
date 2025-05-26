# Android Appium 远程测试指南

## 问题描述
在远程SSH环境中使用Appium连接本地Windows机器上的Android模拟器。

## 解决方案

### 1. 配置SSH端口转发
在Windows本地机器上，编辑SSH配置文件（通常在`~/.ssh/config`）添加以下端口转发：

```
Host 远程服务器名称
    # 其他SSH配置...
    
    # ADB服务器端口
    LocalForward 5037 127.0.0.1:5037
    
    # 模拟器端口（根据您的模拟器数量添加）
    LocalForward 5554 127.0.0.1:5554
    LocalForward 5555 127.0.0.1:5555
    LocalForward 5556 127.0.0.1:5556
    LocalForward 5557 127.0.0.1:5557
    LocalForward 5558 127.0.0.1:5558
    LocalForward 5559 127.0.0.1:5559
    
    # Appium服务端口（如果需要）
    LocalForward 4723 127.0.0.1:4723
```

### 2. 在远程服务器上设置ADB连接
使用提供的脚本设置ADB连接：

```bash
./apps/mtappium/src/remote_adb_setup.sh
```

### 3. 启动Appium服务
使用提供的脚本启动Appium服务：

```bash
./apps/mtappium/src/appium_start.sh
```

### 4. 运行测试
使用提供的脚本运行测试：

```bash
./apps/mtappium/src/run_test.sh
```

## 故障排除

如果设备连接失败，可以尝试：

1. 确保本地Windows机器上的模拟器正在运行
2. 检查SSH端口转发是否正确配置
3. 在远程服务器上运行以下命令手动连接设备：
   ```bash
   adb connect 127.0.0.1:5555
   ```
4. 如果仍然无法连接，可以尝试重启ADB服务：
   ```bash
   adb kill-server
   adb start-server
   ``` 