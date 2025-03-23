# 🧠 分身AIエージェント - クライアントサイド（Frontend）

<div style="display: flex; justify-content: center;">
    <video controls src="https://github.com/user-attachments/assets/91f5082e-8054-4e4d-974d-65f6d2d1c68b" muted="true"></video>
</div>

このリポジトリは、**音声を使ってAIエージェントと会話**できる「分身AIエージェント」の**クライアントアプリケーション**です。  
ユーザーは画面上のボタンをクリックし、マイクに向かって話すだけで、AIが解析した返答を**自分の声**で返すことができます。


## 📌 概要

- ボタンを押してマイクを起動し、話しかけるだけの簡単UI
- サーバー側で分析された内容に基づいて、**自分の声で合成された返答音声**を再生
- 近未来的な体験を演出する**幻想的な3Dエージェント描画**


## 🎥 デモ動画

- 🔗 [日本語版デモ動画のYouTubeリンクはこちら](https://youtu.be/dwX0WjToQKA?si=FqRIrqx9qAHPU2Sb)


## ⚙️ 主な機能（クライアント）

- 🎤 マイクによる音声入力
- 🎧 サーバーから受け取った音声ファイルを再生
- 🌌 React Three Fiber を使った**3D表現**による視覚演出
- 🧠 サーバー側AIとのリアルタイム通信によるインタラクティブな体験


## 🛠️ 技術スタック（フロントエンド）

| 分類           | 使用技術                      |
|----------------|-------------------------------|
| 言語 / 実行環境 | Node.js v22.11.0              |
| フレームワーク | React                         |
| 3D描画         | React Three Fiber             |
| コード生成補助 | [v0.dev](https://v0.dev)      |


## 🚀 セットアップ手順

1. **Node.js をインストール**（バージョン 22.11.0 推奨）

2. **このリポジトリをクローン**
```bash
git clone https://github.com/your-username/ai-agent-client.git
cd ai-agent-client
```

3. **依存ライブラリをインストール（初回のみ）**
```bash
npm install
```

4. **アプリを起動**
```bash
npm run start
```

5. **アクセス**
ブラウザで `http://localhost:3000` を開いて動作確認してください。


## 🔗 サーバーとの連携

このクライアントは以下のサーバーアプリと連携して動作します：  
👉 [分身AIエージェント - サーバーサイド](https://github.com/ShinjoSato/ai-agent-server)
