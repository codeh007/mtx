#!/usr/bin/env bash

# Build the Tauri app
# npm run tauri build
export NDK_HOME=$HOME/Android/Sdk/ndk/23.1.7779620
export NDK_ROOT=$HOME/Android/Sdk/ndk/23.1.7779620
export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk-amd64



install_android_sdk() {
    # download android sdk
    curl -SsL -o /tmp/android-sdk_r24.2-linux.tgz http://dl.google.com/android/android-sdk_r24.2-linux.tgz && \
    tar -xvf /tmp/android-sdk_r24.2-linux.tgz -C /tmp && \
    echo "接收所有 license"
    export SDK_HOME=${HOME}/Android/Sdk
    export NDK_HOME=${SDK_HOME}/ndk/21.3.6528147
    yes | sdkmanager --licenses --sdk_root=${SDK_HOME}
    # install all sdk packages
    # (cd /tmp/android-sdk-linux/tools && echo "yyy" | ./android update sdk --no-ui)

    $SDK_HOME/tools/android update sdk --no-ui

    sdkmanager --sdk_root=${SDK_HOME} --install "ndk;21.3.6528147"
    # 学习: 
    # sdkmanager --install "ndk;21.3.6528147" --channel=3 // Install the NDK from the canary channel (or below)
    # sdkmanager --install "cmake;10.24988404" // Install a specific version of CMake
}

command -v tauri >/dev/null 2>&1 || {
    sudo npm i -g @tauri-apps/cli@latest
}

command -v cargo >/dev/null 2>&1 || {
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
}

# 首次初始化 android 项目
# tauri android init

# 开发 android 项目
tauri android dev

# tauri build

# adb shell am start -n com.tauri_app.app/.DemoActivity
# adb logcat | grep DemoActivity
