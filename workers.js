addEventListener('fetch', event => {
  event.respondWith((async req => {
    const { pathname } = new URL(req.url);
    if (req.method === 'GET') {
      if (pathname === '/login') return renderLoginPage();
      if (pathname === '/playlist') return handlePlaylistRequest();
      if (pathname === '/refresh') return handleRefreshToken();
      if (pathname === '/wms') return handleWmsRequest();
      if (pathname === '/api') return handleApiRequest();
    }
    if (req.method === 'POST') {
      if (pathname === '/get-otp') return handleGetOtp(req);
      if (pathname === '/validate') return handleValidateOtp(req);
      if (pathname === '/cookie-login') return handleCookieLogin(req);
      if (pathname === '/token-login') return handleTokenLogin(req);
    }
    return new Response('Not Found!', { status: 404 });
  })(event.request));
});

function renderLoginPage(extraContent = '', activeForm = 'ncellForm') {

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GeniusTV Login</title>
    <style>*,::after,::before{box-sizing:border-box}body,html{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;font-size:16px;background:#f5f5f5;height:100%;width:100%}.wrapper{display:flex;justify-content:center;align-items:center;padding:1rem;min-height:100vh;background:#f5f5f5}.card{background:#fff;padding:2rem;border-radius:1rem;box-shadow:0 6px 24px rgba(0,0,0,.08);width:100%;max-width:420px}h2{text-align:center;margin-bottom:1.5rem;font-size:1.75rem;color:#222}.tabs{display:flex;justify-content:center;border-bottom:3px solid #10a37f;margin-bottom:1.5rem;gap:1rem}.tab-button{background:0 0;border:none;padding:.5rem 1rem;margin-bottom:.5rem;font-weight:600;font-size:1rem;color:#555;cursor:pointer;transition:border-color .3s,color .3s}.tab-button.active{background:#10a37f;color:#fff}form{margin-top:0}.tab-content{display:none}.tab-content.active{display:block}label{display:block;margin-bottom:.5rem;font-size:1rem;color:#555;font-weight:500}input[type=tel],input[type=text],textarea{width:100%;padding:1rem;font-size:1rem;margin-bottom:1.5rem;border:1px solid #ddd;border-radius:.75rem;background:#fafafa;resize:vertical}input:focus,textarea:focus{outline:0;background:#fff;border-color:#10a37f;box-shadow:0 0 0 3px rgba(16,163,127,.15)}button{width:100%;padding:1rem;font-size:1.1rem;background:#10a37f;color:#fff;border:none;border-radius:.75rem;cursor:pointer;font-weight:600;transition:transform .1s ease-in-out}button:active{background:#0d8a6a;transform:scale(.98)}p{text-align:center;margin-top:1.5rem;font-size:1rem;color:#666}pre{background:#eee;padding:1rem;border-radius:.5rem;font-size:.85rem;overflow-x:auto}@media (max-width:480px){body,html{font-size:16px;height:100svh}.card{padding:1.7rem;max-width:95vw;max-height:90svh}h2{font-size:1.5rem}label{font-size:1rem}button,input,textarea{font-size:.9rem;padding:1.5rem}.tabs{gap:.2rem}.tab-button{font-size:1rem;padding:.7rem 1.2rem}}</style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card" role="main" aria-label="GeniusTV Login">
        <h2>GeniusTV Login</h2>
  
        <div class="tabs" role="tablist" aria-label="Login Methods" ${activeForm === 'otpForm' ? 'style="display:none;"' : ''}>
          <button class="tab-button ${activeForm === 'ncellForm' ? 'active' : ''}" role="tab" aria-selected="${activeForm === 'ncellForm'}" aria-controls="ncellForm" id="tab-ncell" data-target="ncellForm">Ncell</button>
          <button class="tab-button ${activeForm === 'cookieForm' ? 'active' : ''}" role="tab" aria-selected="${activeForm === 'cookieForm'}" aria-controls="cookieForm" id="tab-cookie" data-target="cookieForm">Cookie</button>
          <button class="tab-button ${activeForm === 'tokenForm' ? 'active' : ''}" role="tab" aria-selected="${activeForm === 'tokenForm'}" aria-controls="tokenForm" id="tab-token" data-target="tokenForm">Token</button>
        </div>
  
        <form method="POST" action="/get-otp" id="ncellForm" class="tab-content ${activeForm === 'ncellForm' ? 'active' : ''}" role="tabpanel" aria-labelledby="tab-ncell">
          <label for="mobile">Ncell Number Only!</label>
          <input type="tel" name="mobile" id="mobile" required placeholder="9xxxxxxxxx" pattern="9\\d{9}" inputmode="tel" autocomplete="tel-national" />
          <button type="submit">Get OTP</button>
        </form>
  
        ${extraContent}
  
        <form method="POST" action="/cookie-login" id="cookieForm" class="tab-content ${activeForm === 'cookieForm' ? 'active' : ''}" role="tabpanel" aria-labelledby="tab-cookie">
          <label for="cookie">Paste Plain Text Cookie</label>
          <textarea name="cookie" id="cookie" required placeholder="# Netscape HTTP Cookie File"></textarea>
          <button type="submit">Login with Cookie</button>
        </form>
  
        <form method="POST" action="/token-login" id="tokenForm" class="tab-content ${activeForm === 'tokenForm' ? 'active' : ''}" role="tabpanel" aria-labelledby="tab-token">
          <label for="tokenJson">Paste Token JSON</label>
          <textarea name="tokenJson" id="tokenJson" required placeholder='{"access_token":"...", "refresh_token":"..."}'></textarea>
          <button type="submit">Login with Token</button>
        </form>
      </div>
    </div>
  
    <script>
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');
  
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
  
          tabContents.forEach(content => {
            content.classList.remove('active');
          });
  
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');
          const targetId = button.getAttribute('data-target');
          document.getElementById(targetId).classList.add('active');
        });
      });
    </script>
  </body>
  </html>`;
  

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

async function handleGetOtp(request) {
  const formData = await request.formData();
  const mobile = formData.get('mobile');

  await fetch('https://ott-auth.geniustv.geniussystems.com.np/subscribers/ncell-login', {
    method: 'POST',
    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': 'webtv-stream.nettv.com.np',
        'Origin': 'https://webtv.nettv.com.np',
        'Pragma': 'no-cache',
        'Referer': 'https://webtv.nettv.com.np/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'sec-ch-ua': '\'Google Chrome\';v=\'137\', \'Chromium\';v=\'137\', \'Not/A)Brand\';v=\'24\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\'Windows\''
    },
    body: new URLSearchParams({ mobile })
  });

return renderLoginPage(`
  <form method="POST" action="/validate" id="otpForm" class="otp-form">
    <input type="hidden" name="mobile" value="${mobile}" />
    <label for="otp">Enter OTP:</label>
    <input type="text" name="otp" id="otp" required placeholder="OTP" pattern="\\d{4,6}" inputmode="numeric" />
    <button type="submit">Verify OTP</button>
  </form>
`, 'otpForm');
}

async function handleValidateOtp(request) {
  const formData = await request.formData();
  const mobile = formData.get('mobile');
  const otp = formData.get('otp');
  const deviceId = 'V' + Math.floor(100000 + Math.random() * 900000);

  let res = await fetch('https://ott-auth.geniustv.geniussystems.com.np/subscribers/ncell-login/validate/', {
    method: 'POST',
	headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': 'webtv-stream.nettv.com.np',
        'Origin': 'https://webtv.nettv.com.np',
        'Pragma': 'no-cache',
        'Referer': 'https://webtv.nettv.com.np/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'sec-ch-ua': '\'Google Chrome\';v=\'137\', \'Chromium\';v=\'137\', \'Not/A)Brand\';v=\'24\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\'Windows\''
	},
    body: JSON.stringify({ device_id: deviceId, mobile, otp, session_id: 1, type: '' })
  });

  let result = await res.json();

  if (result.status === 400 && result.sessions?.[0]?.id) {
    const session_id = result.sessions[0].id.toString();

    res = await fetch('https://ott-auth.geniustv.geniussystems.com.np/subscribers/ncell-login/validate?type=retry', {
      method: 'POST',
	  headers: {
        'Authorization': '',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': 'webtv-stream.nettv.com.np',
        'Origin': 'https://webtv.nettv.com.np',
        'Pragma': 'no-cache',
        'Referer': 'https://webtv.nettv.com.np/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'sec-ch-ua': '\'Google Chrome\';v=\'137\', \'Chromium\';v=\'137\', \'Not/A)Brand\';v=\'24\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\'Windows\''
	  },
      body: JSON.stringify({
        account_id: mobile,
        device_id: deviceId,
        login_type: 'ncell',
        mobile,
        otp,
        password: otp,
        reseller_id: '913',
        reseller_name: 'ncell login',
        session_id,
        subscriber_id: '',
        token: otp,
        username: mobile
      })
    });

    result = await res.json();
  }

  await geniusTVtoken.put('Login', JSON.stringify(result), { namespace: geniusTVtoken });

  return renderLoginPage(`
    <h2>Login Result</h2>
    <p>Status: ${result.message || 'Success'}</p>
    <p>You're now logged in. <a href="/playlist">Access Playlist</a></p>
  `, { headers: { 'content-type': 'text/html' } });
}

async function handleCookieLogin(request) {
  const formData = await request.formData();
  const rawCookieText = formData.get('cookie')?.trim();
  const ntvUEncoded=rawCookieText.split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('#')).map(l=>l.split('\t')).find(p=>p[5]==='ntv_u')?.[6];
  const parsedToken = ntvUEncoded && JSON.parse(decodeURIComponent(ntvUEncoded));

  if (!parsedToken?.access_token || !parsedToken?.refresh_token) return renderLoginPage('<h2>Error!</h2><p>Cookie not found or invalid.</p>', { headers: { 'content-type': 'text/html' } });

  await geniusTVtoken.put('Login', JSON.stringify(parsedToken), { namespace: geniusTVtoken });

  return renderLoginPage('<h2>Success</h2><p>Token saved. <a href="/playlist">Go to Playlist</a></p>',{headers:{'content-type':'text/html'}});
}

async function handleTokenLogin(request) {
  const formData = await request.formData();
  const tokenJsonRaw = formData.get('tokenJson');
  const tokenJson = JSON.parse(tokenJsonRaw);
  const isBase64Jwt = t => typeof t === 'string' && t.split('.').length === 3 && (() => { try { atob(t.split('.')[1]); return true; } catch { return false; } })();

  if (!tokenJson?.access_token || !tokenJson?.refresh_token || ![tokenJson.access_token, tokenJson.refresh_token].every(isBase64Jwt)) throw new Error('Invalid token!');

  await geniusTVtoken.put('Login', JSON.stringify(tokenJson), { namespace: geniusTVtoken });

  return renderLoginPage('<h2>Success</h2><p>Token saved. <a href="/playlist">Go to Playlist</a></p>',{headers:{'content-type':'text/html'}});

}

async function handleRefreshToken() {
  const data = await geniusTVtoken.get('Login', { namespace: geniusTVtoken });
  if (!data) return new Response('No valid login session found. Please login first.', { status: 401 });

  const json = JSON.parse(data);
  const accessToken = json.access_token;
  const refreshToken = json.refresh_token;
  const jwt = JSON.parse(atob(accessToken.split('.')[1]));
  const userId = jwt.sub;
  const reseller_id = jwt.params.reseller_id;

  const headers = {
    "Authorization": `Bearer ${accessToken}`,
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Host": "webtv-stream.nettv.com.np",
    "Origin": "https://webtv.nettv.com.np",
    "Pragma": "no-cache",
    "Referer": "https://webtv.nettv.com.np/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
  };

  const sessionRes = await fetch(`https://ott-auth.geniustv.geniussystems.com.np/resellers/${reseller_id}/subscribers/${userId}/sessions`, { headers });
  const sessionJson = await sessionRes.json();
  const sessionId = sessionJson[0].id;

  const refreshRes = await fetch('https://ott-auth.geniustv.geniussystems.com.np/v2/subscribers/refresh-token', {
    method: 'POST',
    headers,
    body: JSON.stringify({ session_id: sessionId, refresh_token: refreshToken })
  });

  const refreshed = await refreshRes.json();
  await geniusTVtoken.put('Login', JSON.stringify(refreshed), { namespace: geniusTVtoken });

  return new Response('Session refreshed successfully.\n\nYou can automate this once every 24 hours using https://cron-job.org/', { headers: {'Content-Type': 'text/plain'}});
}

async function handlePlaylistRequest() {
  const data = await geniusTVtoken.get('Login', { namespace: geniusTVtoken });
  let json; try { json = JSON.parse(data || '{}'); } catch { return new Response('Corrupted session data. Please login again.', { status: 401 }); }
  const accessToken = json.access_token;
  const jwt = JSON.parse(atob(accessToken.split('.')[1]));
  const userId = jwt.sub;
  const reseller_id = jwt.params.reseller_id;
  const serial = jwt.params.serial;

  const headers = {
    "Authorization": `Bearer ${accessToken}`,
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Host": "webtv-stream.nettv.com.np",
    "Origin": "https://webtv.nettv.com.np",
    "Pragma": "no-cache",
    "Referer": "https://webtv.nettv.com.np/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
  };

  const res = await fetch(`https://ott-livetv-resources.geniustv.geniussystems.com.np/subscriber/livetv/v1/namespaces/${reseller_id}/subscribers/${userId}/serial/${serial}`, { headers });

  if (!res.ok) return new Response('Failed to fetch Session data. Please login again.', { status: res.status });

  const body = await res.json();

  const wmsauthsign = await fetch('https://ott-resources.geniustv.geniussystems.com.np/nimble/wmsauthsign', { headers })
    .then(r => r.json()).then(d => d.wmsauthsign);

  let m3u8 = `#EXTM3U x-tvg-url="https://epgs.sunilprasad.com.np/webtv.xml.gz"\n`;
	  m3u8 += '# FOSS Project Of Sunil Prasad @ sunilprasad.com.np\n\n';
	  m3u8 += '# STRICT WARNING: This is a private server.\n';
	  m3u8 += '# No one is authorized to use this except owner him/herself.\n';
	  m3u8 += '# Do not share, misuse, or attempt to access these tokens or credentials.\n';
	  m3u8 += '# Providers can open issue on github for any discussions.\n';
	  m3u8 += '# Unauthorized access or takedown attempts will face legal consequences.\n\n';

  const categories = body.result.categories.sort((a, b) => a.priority - b.priority);

  const map = body.result.category_channel_map.filter(m => m.category_id !== 20);
  const channels = body.result.channels.sort((a, b) => a.channel_number - b.channel_number);

  const grouped = {};
  channels.forEach(ch => {
    const cats = map.filter(m => m.channel_id === ch.id)
      .map(m => categories.find(c => c.id === m.category_id)?.category || 'Uncategorized');
    cats.forEach(cat => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(ch);
    });
  });

  for (const cat of categories) {
    const name = cat.category
    for (const ch of grouped[name] || []) {
      m3u8 += `#EXTINF:-1 tvg-id="${ch.id}" tvg-chno="${ch.channel_number}" tvg-name="${ch.name.toLowerCase().replace(/ /g, '-')}" tvg-country="${ch.country.toLowerCase().replace(/ /g, '-')}" tvg-logo="${ch.logo}" group-title="${name}", ${ch.name}\n`
      m3u8 += `#KODIPROP:inputstream=inputstream.adaptive\n`
      m3u8 += `#KODIPROP:inputstream.adaptive.manifest_type=hls\n`
      m3u8 += `#EXTVLCOPT:http-user-agent=Mozilla/5.0\n`
      m3u8 += `${ch.channel_urls?.[0]?.path}?wmsAuthSign=${wmsauthsign}\n\n`
    }
  }

  return new Response(m3u8, {
	headers: {
	  'Content-Type': 'text/plain',
	  'Access-Control-Allow-Origin': '*',
	  'Access-Control-Allow-Methods': 'GET',
	  'Access-Control-Allow-Headers': 'Authorization'
	}
  });
}

async function handleWmsRequest() {
  const data = await geniusTVtoken.get('Login', { namespace: geniusTVtoken });
  let json; try { json = JSON.parse(data || '{}'); } catch { return new Response('Corrupted session data. Please login again.', { status: 401 }); }
  const accessToken = json.access_token;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Host': 'webtv-stream.nettv.com.np',
    'Origin': 'https://webtv.nettv.com.np',
    'Pragma': 'no-cache',
    'Referer': 'https://webtv.nettv.com.np/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'sec-ch-ua': '\'Google Chrome\';v=\'137\', \'Chromium\';v=\'137\', \'Not/A)Brand\';v=\'24\'',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '\'Windows\''
  };

  const wmsauthsignResponse = await fetch('https://resources.geniustv.geniussystems.com.np/nimble/wmsauthsign', {
    method: 'GET',
    headers: headers
  });

  if (!wmsauthsignResponse.ok) return new Response(JSON.stringify({ error: 'Failed to fetch WMS' }), { status: wmsauthsignResponse.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

  const wmsauthsignData = await wmsauthsignResponse.json();

  return new Response(JSON.stringify({ wmsAuthSign: wmsauthsignData.wmsauthsign }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

async function handleApiRequest() {
  const data = await geniusTVtoken.get('Login', { namespace: geniusTVtoken });
  let json; try { json = JSON.parse(data || '{}'); } catch { return new Response('Corrupted session data. Please login again.', { status: 401 }); }
  const accessToken = json.access_token;
  const jwt = JSON.parse(atob(accessToken.split('.')[1]));
  const userId = jwt.sub;
  const reseller_id = jwt.params.reseller_id;
  const serial = jwt.params.serial;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Host': 'webtv-stream.nettv.com.np',
    'Origin': 'https://webtv.nettv.com.np',
    'Pragma': 'no-cache',
    'Referer': 'https://webtv.nettv.com.np/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'sec-ch-ua': '\'Google Chrome\';v=\'137\', \'Chromium\';v=\'137\', \'Not/A)Brand\';v=\'24\'',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '\'Windows\''
  };

  const res = await fetch(`https://ott-livetv-resources.geniustv.geniussystems.com.np/subscriber/livetv/v1/namespaces/${reseller_id}/subscribers/${userId}/serial/${serial}`, { headers });
  
  if (!res.ok) return new Response('Failed to fetch Session data. Please login again.', { status: res.status });

  const responseBody = await res.json();
  const categories = responseBody.result.categories;
  const categoryChannelMap = responseBody.result.category_channel_map.filter(mapping => mapping.category_id !== 20);
  const sortedCategories = categories.sort((a, b) => a.priority - b.priority);
  let groupedChannels = {};
  const sortedChannels = responseBody.result.channels.sort((a, b) => a.channel_number - b.channel_number);
  sortedChannels.forEach(channel => {
    const channelCategories = categoryChannelMap
      .filter(mapping => mapping.channel_id === channel.id)
      .map(mapping => sortedCategories.find(category => category.id === mapping.category_id)?.category || 'Uncategorized');

    channelCategories.forEach(categoryName => {
      if (!groupedChannels[categoryName]) {
        groupedChannels[categoryName] = [];
      }
      groupedChannels[categoryName].push({
        channel_id: channel.id,
        channel_number: channel.channel_number,
        channel_country: channel.country.toUpperCase(),
        channel_category: categoryName,
        channel_name: channel.name,
        channel_slug: channel.name.toLowerCase().replace(/ /g, '-'),
        channel_logo: channel.logo,
        channel_description: channel.description,
        channel_url: `${channel.channel_urls?.[0]?.path}`,
      });
    });
  });

  const filteredCategories = sortedCategories
    .map(category => {
      const categoryName = category.category;
      const channels = groupedChannels[categoryName] || [];
      if (categoryName !== 'All' && channels.length > 0) {
        return {
          category_id: category.id,
          category_name: category.category,
          category_slug: category.slug,
          category_description: category.description,
          category_logo: category.logo,
          category_priority: category.priority,
          channels: channels,
        };
      }
      return null;
    })
    .filter(category => category !== null);

  const apiResponse = {
    feeds: filteredCategories,
  };

  const newResponse = new Response(JSON.stringify(apiResponse), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
  });

  return newResponse;
}
