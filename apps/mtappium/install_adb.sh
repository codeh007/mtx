#!/usr/bin/env bash

# Install adb
sudo apt-get update && sudo apt-get -yqq install android-tools-adb

# 安装的路径: /usr/lib/android-sdk/platform-tools/adb


install_appium(){
    bun run appium driver install uiautomator2
}

test1(){
    adb connect 127.0.0.1:5558
}