// customize-freeflow.js — D:\node.exe customize-freeflow.js
const fs = require('fs');
const path = require('path');

console.log('\n  === FreeFlow Customization ===\n');

// ─── 1. Rename app ───
const stringsPath = 'app/src/main/res/values/strings.xml';
if (fs.existsSync(stringsPath)) {
  let s = fs.readFileSync(stringsPath, 'utf8');
  s = s.replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">FreeFlow</string>');
  fs.writeFileSync(stringsPath, s, 'utf8');
  console.log('  OK app name -> FreeFlow');
}

// Russian strings
const stringsRuDir = 'app/src/main/res/values-ru';
if (!fs.existsSync(stringsRuDir)) fs.mkdirSync(stringsRuDir, { recursive: true });
fs.writeFileSync(path.join(stringsRuDir, 'strings.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">FreeFlow</string>
</resources>
`, 'utf8');
console.log('  OK Russian strings added');

// ─── 2. Add Russian bypass route rules template ───
const rulesDir = 'app/src/main/assets/bypass_rules';
if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });

// Direct domains (bypass proxy)
fs.writeFileSync(path.join(rulesDir, 'ru_direct.json'), JSON.stringify({
  version: 1,
  name: "RU Direct (bypass proxy)",
  description: "Russian sites go direct - banks, government, VK, Yandex",
  rules: {
    domain_suffix: [
      // Government
      "gosuslugi.ru", "mos.ru", "nalog.ru", "pfr.gov.ru", "cbr.ru",
      "government.ru", "kremlin.ru", "duma.gov.ru", "rosreestr.gov.ru",
      // Banks
      "tinkoff.ru", "tinkoff.com", "sberbank.ru", "alfabank.ru", "vtb.ru",
      "raiffeisen.ru", "gazprombank.ru", "open.ru", "sovcombank.ru",
      // Social
      "vk.com", "vk.me", "userapi.com", "ok.ru", "mail.ru", "dzen.ru",
      // Yandex
      "yandex.ru", "yandex.net", "ya.ru", "yastatic.net",
      "kinopoisk.ru", "auto.ru", "avito.ru",
      // Telecom
      "mts.ru", "megafon.ru", "beeline.ru", "tele2.ru", "rt.ru",
      // CDN
      "vkcdn.net", "userapi.com", "imgsmail.ru",
    ]
  }
}, null, 2), 'utf8');
console.log('  OK ru_direct.json');

// Proxy domains (force through proxy)
fs.writeFileSync(path.join(rulesDir, 'ru_proxy.json'), JSON.stringify({
  version: 1,
  name: "Blocked -> Proxy",
  description: "Blocked sites forced through proxy tunnel",
  rules: {
    domain_suffix: [
      // Social media
      "instagram.com", "cdninstagram.com", "twitter.com", "x.com",
      "twimg.com", "facebook.com", "fbcdn.net", "threads.net",
      "whatsapp.com", "whatsapp.net", "linkedin.com",
      // Streaming
      "youtube.com", "googlevideo.com", "ytimg.com", "ggpht.com",
      "twitch.tv", "ttvnw.net", "spotify.com", "scdn.co",
      "netflix.com", "nflxvideo.net", "disneyplus.com",
      // AI
      "openai.com", "claude.ai", "anthropic.com", "midjourney.com",
      "perplexity.ai", "suno.ai", "suno.com",
      // News
      "bbc.com", "bbc.co.uk", "meduza.io",
    ]
  }
}, null, 2), 'utf8');
console.log('  OK ru_proxy.json');

// ─── 3. Enable GitHub Actions ───
const workflowsDir = '.github/workflows';
if (!fs.existsSync(workflowsDir)) fs.mkdirSync(workflowsDir, { recursive: true });

fs.writeFileSync(path.join(workflowsDir, 'build.yml'), `name: Build FreeFlow APK

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        submodules: recursive
    
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '21'
    
    - name: Setup Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.23'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v3
    
    - name: Build libbox
      run: |
        git submodule update --init --recursive
        cd sing-box
        make lib_android
        mkdir -p ../app/libs
        cp libbox.aar ../app/libs/
    
    - name: Build APK
      run: |
        chmod +x gradlew
        ./gradlew assembleRelease --no-daemon
    
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: FreeFlow-APK
        path: app/build/outputs/apk/release/*.apk
        retention-days: 30
`, 'utf8');
console.log('  OK GitHub Actions workflow');

// ─── 4. Update README ───
fs.writeFileSync('README.md', `# 🌐 FreeFlow

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
\`\`\`bash
git clone --recursive https://github.com/gazvil139/freeflow.git
cd freeflow
# Build libbox
cd sing-box && make lib_android && cp libbox.aar ../app/libs/ && cd ..
# Build APK
./gradlew assembleRelease
\`\`\`

## License
GPL-3.0
`, 'utf8');
console.log('  OK README.md');

console.log('\n  Done! Now:\n');
console.log('  git add -A');
console.log('  git commit -m "Customize as FreeFlow with RU bypass rules"');
console.log('  git push');
console.log('');
console.log('  Then go to https://github.com/gazvil139/freeflow/actions');
console.log('  and watch the build!\n');
