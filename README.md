# 📺 WebTV Cloudflare Playlist

A **Cloudflare Workers** script that dynamically generates M3U8 playlists using NetTV Nepal's WebTV API. It focuses on **Free-To-Air (FTA) Nepalese channels** and select international channels, offering a secure, flexible streaming experience across devices and platforms.

Designed for **personal use**, this project enables easy integration with popular media players while offering a clean, responsive login interface and multiple secure authentication options.

---

## 🎯 Project Overview

This tool is a **lightweight, personal-use supplement** to the official NetTV/WebTV platforms. It is:

* Fully hosted on **Cloudflare Workers** (no backend server required)
* Optimized for mobile and desktop use with a **responsive login UI**
* Compatible with **Ncell OTP login**, cookies, and JSON tokens
* Perfect for those who want portable, cross-device streaming with control over authentication and session management

---

## ✨ Key Features

* 🔐 **Authentication Methods**

  * 📱 **Ncell OTP Login**: Login using your Ncell number and a one-time password
  * 🍪 **Session Cookie Login**: Paste your existing cookie for direct access
  * 🧾 **JSON Token Login**: Use a saved login token JSON

* 🖥️ **Responsive Login Page**

  * Mobile-friendly, clean UI built for ease of use
  * Works across phones, tablets, and desktops

* 📺 **Dynamic M3U8 Playlist Generator**

  * Real-time generation of updated channel playlists
  * Compatible with players like VLC, Kodi, and IPTV apps

* 🗂️ **Organized Channel Categories**

  * Automatically groups channels into genres

* ⚡ **Serverless Performance**

  * Hosted on Cloudflare’s global infrastructure

* 🔒 **Cloudflare KV Token Storage**

  * Tokens stored securely in the KV Namespace
  * No exposure of sensitive login credentials

* 🔁 **Automatic Token Refresh**

  * Maintain continuous access with scheduled background refreshes

* 📡 **WMS Signature Fetching**

  * Supports stream authorization via WMS Auth

---

## 🔌 API Endpoints

| Method | Path        | Description                                         |
| ------ | ----------- | --------------------------------------------------- |
| GET    | `/login`    | Responsive login page for Ncell, Cookie, Token      |
| GET    | `/playlist` | Generates the dynamic M3U8 playlist (auth required) |
| GET    | `/api`      | Returns structured JSON metadata (channel/category) |
| GET    | `/refresh`  | Refreshes the session token                         |
| GET    | `/wms`      | Retrieves WMS authentication signature              |

---

## 🛠 Setup Guide

### 1. Clone the Project

Copy `public-workers.js` into your Cloudflare Worker project.

### 2. Configure KV Namespace

* Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
* Navigate to **Workers & Pages → KV**
* Create a namespace: `geniusTVtoken`
* Bind it to your Worker using the same name

### 3. Deploy

Use Cloudflare’s UI or Wrangler CLI to deploy your worker.

---

## ⏯ Usage Instructions

* Open `/login` to authenticate with Ncell, Cookie, or JSON Token
* After login:

  * Access `/playlist` for your M3U8 stream
  * Use `/api` for metadata
  * Trigger `/refresh` to manually refresh the token if needed

Your live playlist will be available at:

```
https://<your-worker-subdomain>.workers.dev/playlist
```

### 📄 Example M3U8 Output:

```m3u
#EXTM3U x-tvg-url="https://epgs.sunilprasad.com.np/webtv.xml.gz"
# FOSS Project Of Sunil Prasad @ sunilprasad.com.np

# STRICT WARNING: This is a private server.
# No one is authorized to use this except owner him/herself.
# Do not share, misuse, or attempt to access these tokens or credentials.
# Providers can open issue on github for any discussions.
# Unauthorized access or takedown attempts will face legal consequences.

#EXTINF:-1 tvg-id="channel1" tvg-chno="1" tvg-name="example-channel" tvg-country="np" tvg-logo="https://webtv-xyz.geniusxxx.com.np/channel/xx/logo" group-title="News", Example Channel
#KODIPROP:inputstream=inputstream.adaptive
#KODIPROP:inputstream.adaptive.manifest_type=hls
#EXTVLCOPT:http-user-agent=Mozilla/5.0
https://webtv-xyz.geniusxxx.com.np/stream.m3u8?wmsAuthSign=lkasmflkasmfmflamskfmaslfsafangjnrhne==
...
```

---

## 🕐 Automate Token Refresh

To automatically refresh tokens daily:

1. Go to [cron-job.org](https://console.cron-job.org)
2. Create a new job:

   * **URL**: `https://<your-worker-subdomain>.workers.dev/refresh`
   * **Schedule**: Once every 24 hours
   * **Title**: WebTV Token Refresh
   * Set your preferred time

This keeps your session live with no manual actions.

---

## ❓ Why Choose This?

* ✅ **Responsive UI**: Works well on any device
* ✅ **Multi-login Support**: Ncell, Cookies, or Token JSON
* ✅ **Portable Access**: Compatible with your favorite media players
* ✅ **Fully Serverless**: No backend to maintain
* ✅ **Secure**: Tokens stored in Cloudflare KV
* ✅ **Always Updated**: Real-time playlist and channel metadata

---

## 🔒 Security Notice

* Do **not share** your tokens or playlist URLs.
* All credentials are stored securely and are encrypted via KV.
* Misuse or public exposure will result in access termination.

---

## ⚠️ Disclaimer

This tool is intended strictly for:

* **Personal and educational purposes**
* **Not affiliated with**:

  * NetTV Nepal
  * GeniusSystem
  * NewITVenture
  * WorldLink

> All users are solely responsible for ensuring that they comply with applicable copyright laws and streaming regulations. The author assumes no liability for misuse or unauthorized access.

---

## 📝 License

This project is under a **Custom License**:
**No commercial use permitted**. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Sunil Prasad Regmi**

* 🌐 [LinkedIn](https://www.linkedin.com/in/sunil-prasad-regmi/)
* 📘 [Facebook](https://www.facebook.com/sunilprregmi/)
* 📲 [Telegram](https://t.me/sunilpr)
