#!/usr/bin/env bash


install_android_sdk() {

    command -v java || {
        sudo apt install -yqq openjdk-7-jdk
    }

    command -v curl || {
        sudo apt install -yqq curl
    }  

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
    # set path
#     vi ~/.zshrc << EOT

#     export PATH=${PATH}:$HOME/sdk/android-sdk-linux/platform-tools:$HOME/sdk/android-sdk-linux/tools:$HOME/sdk/android-sdk-linux/build-tools/22.0.1/

# EOT

#     source ~/.zshrc

    # adb
    # sudo apt install -yqq libc6:i386 libstdc++6:i386
    # # aapt
    # sudo apt install -yqq zlib1g:i386

    # echo "安装 ndk"
    # sdkmanager --install "ndk;21.3.6528147"
}


# 学习: 
# sdkmanager --install "ndk;21.3.6528147" --channel=3 // Install the NDK from the canary channel (or below)
# sdkmanager --install "cmake;10.24988404" // Install a specific version of CMake

install_android_sdk