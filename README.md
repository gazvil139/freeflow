# 🌐 FreeFlow

Free internet access app for Russia. Built on sing-box.

## Features
- 🛡️ DPI bypass (TLS fragmentation, TCP desync)
- 🔀 Smart routing: Russian sites direct, blocked sites through proxy
- 🔐 Encrypted DNS (DoH/DoT)
- 📱 Support: VLESS, Trojan, Shadowsocks, Hysteria2, WireGuard
- ⚡ Auto-reconnect, Kill Switch
- 🏛️ Bypass: Gosuslugi, banks, VK, Yandex go direct
- 📺 Proxy: YouTube, Instagram, ChatGPT through tunnel

## Download
Go to [Actions](../../actions) tab → latest build → download APK.

## Build
```bash
git clone --recursive https://github.com/gazvil139/freeflow.git
cd freeflow
# Build libbox
cd sing-box && make lib_android && cp libbox.aar ../app/libs/ && cd ..
# Build APK
./gradlew assembleRelease
```

## License
GPL-3.0
