# WebTV Cloudflare Playlist

A Cloudflare Workers script designed to dynamically generate M3U8 playlists using NetTV Nepal's WebTV API. The script is tailored to fetch and organize only **Free-To-Air (FTA) Nepalese channels** along with a few international channels. This project provides an alternative way to experience these channels, allowing users to integrate them into their preferred media players or applications.

---

## About This Project

This script is not intended to replace the official NetTV app or WebTV website. Instead, it offers a supplementary, educational, and personal-use solution for those who prefer a flexible streaming experience. By leveraging Cloudflare Workers' serverless environment, the script provides:

- **Ease of Access**: A simple URL endpoint delivers a dynamically generated M3U8 playlist.
- **Customization**: Channels are categorized and organized for better usability.
- **Scalability**: Cloudflare's infrastructure ensures high availability and performance.
- **Dynamic Playlist Generation**: The script fetches live channel data from the NetTV WebTV API and formats it into an M3U8 playlist.
- **Free-To-Air Channels**: Focuses exclusively on Free-To-Air Nepalese channels and a curated list of international channels.
- **Category Organization**: Channels are neatly grouped into categories based on their genre or type.
- **Token Refresh**: Automated session token renewal ensures uninterrupted access, configurable via Cron jobs.
- **Cloudflare Workers Integration**: Deployed in a serverless environment, ensuring fast and efficient delivery of the playlist.

Having an alternative way to explore Free-To-Air channels is always a good idea, especially for those who value portability and the ability to use their preferred media players.

---

## Why Use This Script? Key Benefits

- **Dynamic Playlist Generation**
  - Creates and maintains an auto-updating playlist of Nepalese Free-To-Air channels
  - Compatible with popular media players like VLC and Kodi

- **Automated Token Management**
  - Handles daily token refreshes automatically
  - No manual intervention required for continuous streaming

- **Device Flexibility**
  - Access channels from any compatible device
  - Not restricted to specific apps or platforms

- **Personalized Experience**
  - Choose your preferred media player
  - Customize viewing experience while maintaining simplicity

- **Complementary Solution**
  - Works alongside official NetTV services
  - Designed for personal use, not as a replacement
  - Respects original service functionality

---

### Setup and Deployment

Follow these steps to set up and deploy the WebTV Cloudflare Playlist script:  

---

#### 1. **Get the Code**  

Copy the code from `workers.js` in this repository.

---

#### 2. **Customize the Script**  

Modify the script (`workers.js`) as per your requirements. For example:

- **Necessary Customizations**:
  - Update the `resourceUrl` with your LiveTV JSON URL:
    ```javascript
    const resourceUrl = 'https://livetv-resources.geniustv.geniussystems.com.np/subscriber/livetv/v1/namespaces/xxxx/subscribers/123xxxx/serial/tt_123xxxx2323xxx-xxxx'; // your livetv json url here
    ```
  - Update the `sessionUrl` with your session URL:
    ```javascript
    const sessionUrl = 'https://auth.geniustv.geniussystems.com.np/resellers/xxxx/subscribers/123xxxx/sessions'; // your session url here
    ```

- **Optional Customizations (at your own risk)**:
  - Access and refresh tokens using your namespace:
    ```javascript
    const accessToken = await webtvToken.get('access_token', { namespace: webtvToken }); // your namespace here
    const refreshToken = await webtvToken.get('refresh_token', { namespace: webtvToken }); // your namespace here
    await webtvToken.put('access_token', refreshJsonResponse.access_token, { namespace: webtvToken }); // your namespace here
    await webtvToken.put('refresh_token', refreshJsonResponse.refresh_token, { namespace: webtvToken }); // your namespace here
    ```

- **If You Are a Nerd**:
  - Update the TV guide URL with your own:
    ```m3u
    x-tvg-url="https://github.com/sunilprregmi/webtv-epg/raw/refs/heads/main/webtv.xml.gz"
    ```

   - Adjust the playlist generation logic.
   - Add or remove features.
   - Update API configurations if needed.

---

#### 3. **Set Up KV Namespace**  

To store API tokens, create a KV Namespace:  

1. **Create a Namespace**:  
   - In the Cloudflare dashboard, go to **Workers** > **KV** > **Create Namespace**.  
   - Name the namespace `webtvToken`.  (May variate based on how you set on workers.js)

2. **Add KV Pairs**:  
   - Add the following keys and their respective values:  
     - `access_token`
     - `refresh_token`  

3. **Bind Namespace to Worker**:  
   - Go to **Workers** > **Your Worker** > **Settings** > **Bindings** > **Add Binding**.  
   - Set the binding name to `webtvToken` (same as the namespace name).  

---

#### 4. **Set Up Cloudflare Workers**  

1. **Sign In or Sign Up**  
   - Visit [Cloudflare Workers](https://workers.cloudflare.com/) and log in or create a new account.

2. **Create a New Worker**  
   - Go to the **Workers** section and click **Create a Worker**.

3. **Paste the Code**  
   - Replace the default Worker code with your customized version of `workers.js`.

---

#### 5. **Access Your Playlist**  

Once deployed, your dynamically generated M3U8 playlist will be available at your worker's root URL:  
```
https://<your-worker-subdomain>.workers.dev/
```
Example of output M3U8 Playlist:
```m3u
#EXTM3U x-tvg-url="https://github.com/sunilprregmi/webtv-epg/raw/refs/heads/main/webtv.xml.gz"

#EXTINF:-1 tvg-id="channel1" tvg-chno="1" tvg-name="example-channel" tvg-country="np" tvg-logo="https://example.com/logo.png" group-title="News", Example Channel
#EXTVLCOPT:http-user-agent=NetTV/3.2.1
https://example.com/stream.m3u8?wmsAuthSign=<auth-signature>
```

---

#### 6. Token Refresh with Cron Jobs

To refresh session tokens daily, you can use [cron-job.org](https://console.cron-job.org/login) to schedule automatic calls to your worker's `/refresh` endpoint. Here's how to set it up:

1. Visit [cron-job.org](https://console.cron-job.org/login) and create an account or log in
2. Click "Create cronjob" button
3. Set the following configuration:
   - Title: WebTV Token Refresh
   - URL: `https://<your-worker-subdomain>.workers.dev/refresh`
   - Schedule: Every 24 hours (select "Once per day" in the schedule options)
   - Timing: Choose your preferred time of day
4. Click "Create" to activate the cron job

The cron job will automatically call your refresh endpoint once every 24 hours to maintain active session tokens.

---

## Disclaimer

This project is intended **only for personal and educational purposes** and is **not affiliated with**:

- NetTV Nepal
- GeniusSystem
- NewITVenture Corp
- WorldLink Communication  

All users are solely responsible for ensuring that they comply with applicable copyright laws and streaming regulations. The author assumes no liability for misuse or unauthorized access.

---

## License

This project is licensed under a Custom [License](LICENSE) that explicitly prohibits commercial use. All rights reserved.

---

## Author

- **Sunil Prasad Regmi**  
  - [LinkedIn](https://www.linkedin.com/in/sunil-prasad-regmi/)  
  - [Facebook](https://www.facebook.com/sunilprregmi/)
  - [Telegram](https://t.me/sunilpr)
