# WebTV Cloudflare Playlist

A Cloudflare Workers script designed to dynamically generate M3U8 playlists using NetTV Nepal's WebTV API. The script is tailored to fetch and organize only **Free-To-Air (FTA) Nepalese channels** along with a few international channels. This project provides an alternative way to experience these channels, allowing users to integrate them into their preferred media players or applications.

---

## About This Project

This script is not intended to replace the official NetTV app or WebTV website. Instead, it offers a supplementary, educational, and personal-use solution for those who prefer a flexible streaming experience. By leveraging Cloudflare Workers' serverless environment, the script provides:

- **Ease of Access**: A simple URL endpoint delivers a dynamically generated M3U8 playlist.
- **Customization**: Channels are categorized and organized for better usability.
- **Scalability**: Cloudflare's infrastructure ensures high availability and performance.

Having an alternative way to explore Free-To-Air channels is always a good idea, especially for those who value portability and the ability to use their preferred media players.

---

## Key Features

- **Dynamic Playlist Generation**: The script fetches live channel data from the NetTV WebTV API and formats it into an M3U8 playlist.
- **Free-To-Air Channels**: Focuses exclusively on Free-To-Air Nepalese channels and a curated list of international channels.
- **Category Organization**: Channels are neatly grouped into categories based on their genre or type.
- **Token Refresh**: Automated session token renewal ensures uninterrupted access, configurable via Cron jobs.
- **Cloudflare Workers Integration**: Deployed in a serverless environment, ensuring fast and efficient delivery of the playlist.

---

## Why Use This Script?

1. **Personalized Viewing Experience**: Use your favorite media player (e.g., VLC, Kodi) to stream channels effortlessly.
2. **Portability**: Access the playlist from any device with a compatible player.
3. **Explore Alternatives**: Sometimes, it's good to have a flexible way to experience Free-To-Air content outside of official apps or websites.

**Note**: This is not meant to compete with or replace the official NetTV services. Instead, it provides a creative way to experience their Free-To-Air offerings in a personal capacity.

---

## Example Use Case

- A user with a media player app like VLC wants to create a simple playlist of Nepalese Free-To-Air channels.
- By deploying this script on Cloudflare Workers, they can generate an M3U8 playlist that is updated dynamically.
- They can refresh tokens once a day to maintain access without any manual intervention.

---

For detailed setup and deployment instructions, refer to the [Usage](#usage-instructions) section.  

If you have questions or ideas to improve this project, feel free to [open an issue](https://github.com/sunilprregmi/webtv-cloudflare-playlist/issues) or submit a pull request.

---

### Usage Instructions  

Follow these steps to set up and deploy the WebTV Cloudflare Playlist script:  

---

#### 1. **Get the Code**  

You can either:  
- **Clone the Repository**:
  ```bash
  git clone https://github.com/sunilprregmi/webtv-cloudflare-playlist.git
  cd webtv-cloudflare-playlist
  ```
- **Copy the Script**:  
  If you don't want to clone the repository, copy the code from `workers.js` in this repository.

---

#### 2. **Customize the Script**  

Modify the script (`workers.js`) as per your requirements. For example:
- Adjust the playlist generation logic.
- Add or remove features.
- Update API configurations if needed.

---

#### 3. **Set Up Cloudflare Workers**  

1. **Sign In or Sign Up**  
   - Visit [Cloudflare Workers](https://workers.cloudflare.com/) and log in or create a new account.

2. **Create a New Worker**  
   - Go to the **Workers** section and click **Create a Worker**.

3. **Paste the Code**  
   - Replace the default Worker code with your customized version of `workers.js`.

---

#### 4. **Set Up KV Namespace**  

To store API tokens, create a KV Namespace:  

1. **Create a Namespace**:  
   - In the Cloudflare dashboard, go to **Workers** > **KV** > **Create Namespace**.  
   - Name the namespace `webtvToken`.  

2. **Add KV Pairs**:  
   - Add the following keys and their respective values:  
     - `access_token`
     - `refresh_token`  

3. **Bind Namespace to Worker**:  
   - Go to **Workers** > **Your Worker** > **Settings** > **Bindings** > **Add Binding**.  
   - Set the binding name to `webtvToken` (same as the namespace name).  

---

#### 5. **Deploy the Worker**  

If you're using the Wrangler CLI:  
1. Install Wrangler:  
   ```bash
   npm install -g wrangler
   ```
2. Log in to Cloudflare:  
   ```bash
   wrangler login
   ```
3. Publish the Worker:  
   ```bash
   wrangler publish
   ```  

Alternatively, save and deploy directly from the Cloudflare Workers dashboard.

---

#### 6. **Access Your Playlist**  

Once deployed, your dynamically generated M3U8 playlist will be available at your worker's root URL:  
```
https://<your-worker-subdomain>.workers.dev/
```
---

## Token Refresh with Cron Jobs

To refresh session tokens daily, you can configure a Cron job to call the `/refresh` endpoint of your worker once every 24 hours.  
Example Cron job command:
```bash
curl -X GET https://<your-worker-subdomain>.workers.dev/refresh
```

---

## Example M3U8 Playlist Output

```m3u
#EXTM3U x-tvg-url="https://github.com/sunilprregmi/webtv-epg/raw/refs/heads/main/webtv.xml.gz"

#EXTINF:-1 tvg-id="channel1" tvg-chno="1" tvg-name="example-channel" tvg-country="np" tvg-logo="https://example.com/logo.png" group-title="News", Example Channel
#EXTVLCOPT:http-user-agent=NetTV/3.2.1
https://example.com/stream.m3u8?wmsAuthSign=<auth-signature>
```

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

This project is licensed under the [MIT License](LICENSE).

---

## Author

- **Sunil Prasad Regmi**  
  [LinkedIn](https://www.linkedin.com/in/sunil-prasad-regmi/)  
  [Facebook](https://www.facebook.com/sunilprregmi/)
  [Telegram](https://www.t.me/guruusr/)
