#!/usr/bin/env bash

# Build the Tauri app
# npm run tauri build
export NDK_HOME=$HOME/Android/Sdk/ndk/23.1.7779620
export NDK_ROOT=$HOME/Android/Sdk/ndk/23.1.7779620
export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk-amd64

command -v tauri >/dev/null 2>&1 || {
    sudo npm i -g @tauri-apps/cli@latest
}

command -v cargo >/dev/null 2>&1 || {
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
}

tauri android init
tauri build
