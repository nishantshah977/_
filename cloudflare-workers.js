addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/refresh') {
    await refreshTokens();
    return new Response('Tokens Refreshed!', { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' } 
    });
  }

  return await handlePlaylistRequest(); 
}

async function refreshTokens() {
  const accessToken = await webtvToken.get('access_token', { namespace: webtvToken }); // your namespace here
  const refreshToken = await webtvToken.get('refresh_token', { namespace: webtvToken }); // your namespace here

  const sessionUrl = 'https://auth.geniustv.geniussystems.com.np/resellers/xxxx/subscribers/123xxxx/sessions'; //your session url here
  const refreshUrl = 'https://auth.geniustv.geniussystems.com.np/v2/subscribers/refresh-token';

  const headers = {
    'Accept': '*/*',
    'Accept-Language': 'en',
    'Authorization': `Bearer ${accessToken}`, 
    'User-Agent': 'NetTV/3.2.1 (np.com.nettv; build: 285; android 34) okhttp',
    'Content-Type': 'application/json',
  };

  const sessionResponse = await fetch(sessionUrl, {
    method: 'GET',
    headers: headers,
  });

  const sessionJsonResponse = await sessionResponse.json();
  const sessionId = sessionJsonResponse[0].id;

  const refreshResponse = await fetch(refreshUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      session_id: sessionId,
      refresh_token: refreshToken,
    }),
  });

  const refreshJsonResponse = await refreshResponse.json();

  await webtvToken.put('access_token', refreshJsonResponse.access_token, { namespace: webtvToken }); // your namespace here
  await webtvToken.put('refresh_token', refreshJsonResponse.refresh_token, { namespace: webtvToken }); // your namespace here
}

async function handlePlaylistRequest() {
  const accessToken = await webtvToken.get('access_token', { namespace: webtvToken });
  const resourceUrl = 'https://livetv-resources.geniustv.geniussystems.com.np/subscriber/livetv/v1/namespaces/xxxx/subscribers/123xxxx/serial/tt_123xxxx2323xxx-xxxx'; //your livetv json url here
  const headers = {
    'Accept': '*/*',
    'Accept-Language': 'en',
    'Authorization': `Bearer ${accessToken}`, 
    'User-Agent': 'NetTV/3.2.1 (np.com.nettv; build: 285; android 29) okhttp',
    'Content-Type': 'application/json',
  };

  const response = await fetch(resourceUrl, { method: 'GET', headers: headers });
  let m3u8Playlist = '#EXTM3U x-tvg-url="https://github.com/sunilprregmi/webtv-epg/raw/refs/heads/main/webtv.xml.gz"\n';
      m3u8Playlist += '# Project Of Sunil Prasad @ sunilprasad.com.np\n\n';
      m3u8Playlist += '# STRICT WARNING: Do not share, misuse, or attempt to expose your tokens or credentials.\n';
      m3u8Playlist += '# Not responsible fot ban/terminate/blacklist your account.\n\n';

  const responseBody = await response.json();
  const wmsauthsign = await fetch('https://resources.geniustv.geniussystems.com.np/nimble/wmsauthsign', {
    method: 'GET',
    headers: headers
  }).then(res => res.json()).then(data => data.wmsauthsign);

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
      groupedChannels[categoryName].push(channel);
    });
  });

  sortedCategories.forEach(category => {
    const categoryName = category.category;

    groupedChannels[categoryName]?.forEach(channel => {
      m3u8Playlist += `#EXTINF:-1 tvg-id="spr${channel.id}" tvg-chno="${channel.channel_number}" tvg-name="${channel.name.toLowerCase().replace(/ /g, '-')}" tvg-country="${channel.country.toLowerCase().replace(/ /g, '-')}" tvg-logo="${channel.logo}" group-title="${categoryName}", ${channel.name}\n`;
      m3u8Playlist += `#KODIPROP:inputstream=inputstream.adaptive\n`;
      m3u8Playlist += `#KODIPROP:inputstream.adaptive.manifest_type=hls\n`;
      m3u8Playlist += `#EXTVLCOPT:http-user-agent=Dart/2.19 (dart:io)\n`;
      m3u8Playlist += `${channel.channel_urls[0].path}?wmsAuthSign=${wmsauthsign}\n\n`;
    });
  });

  return new Response(m3u8Playlist, { 
    status: 200, 
    headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Authorization' } 
  });
}
