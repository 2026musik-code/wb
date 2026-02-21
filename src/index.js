/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * Final Stability Version (Anti-Build Error)
 * Optimized by AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Proxying Endpoint
    if (url.pathname === '/api/feed') {
      const apiKey = env.TIKTOK_API_KEY || 'dedi131';
      try {
        const apiUrl = 'https://api.ferdev.my.id/search/tiktok?query=trending&apikey=' + apiKey;
        const apiRes = await fetch(apiUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!apiRes.ok) throw new Error('API offline');

        const data = await apiRes.json();
        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: false, msg: 'API Connection Error' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(generateHTML(), {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  },
};

function generateHTML() {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>WB TikTok - Fixed & Stable</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: system-ui, sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        .sidebar { position: absolute; right: 15px; bottom: 100px; display: flex; flex-direction: column; gap: 20px; z-index: 10; }
        .icon-circle { width: 48px; height: 48px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; cursor: pointer; }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; pointer-events: none; z-index: 5; }
    </style>
</head>
<body>
    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex items-center justify-center bg-black">
            <div class="text-white/50 animate-pulse">Memuat konten premium...</div>
        </div>
    </div>

    <script>
        async function fetchVideos() {
            try {
                var response = await fetch('/api/feed');
                var result = await response.json();
                var loader = document.getElementById('loading');
                if (loader) loader.remove();

                var videoData = result.result || result.data || (Array.isArray(result) ? result : null);
                if (videoData && videoData.length > 0) {
                    renderVideos(videoData);
                } else {
                    document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center">Gagal memuat data API.</div>';
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        function renderVideos(videos) {
            var app = document.getElementById('app');
            videos.forEach(function(video) {
                var card = document.createElement('div');
                card.className = 'video-card';
                
                var vSrc = video.video || video.play || video.url || '';
                var author = video.author ? video.author.nickname : 'user';
                var title = video.title || '';

                if (!vSrc) return;

                // Membangun HTML menggunakan Kutipan Tunggal agar aman dari build error
                var htmlContent = '<video loop playsinline muted onclick="this.paused ? this.play() : this.pause()">';
                htmlContent += '<source src="' + vSrc + '" type="video/mp4">';
                htmlContent += '</video>';
                htmlContent += '<div class="sidebar">';
                htmlContent += '<div class="icon-circle"><i class="fas fa-heart"></i></div>';
                htmlContent += '<div class="icon-circle"><i class="fas fa-comment"></i></div>';
                htmlContent += '<div class="icon-circle"><i class="fas fa-share"></i></div>';
                htmlContent += '</div>';
                htmlContent += '<div class="overlay">';
                htmlContent += '<h3 class="font-bold text-lg">@' + author + '</h3>';
                htmlContent += '<p class="text-sm opacity-90">' + title + '</p>';
                htmlContent += '</div>';

                card.innerHTML = htmlContent;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    var v = e.target.querySelector('video');
                    if (v) {
                        if (e.isIntersecting) v.play().catch(function() {});
                        else v.pause();
                    }
                });
            }, { threshold: 0.6 });
            
            document.querySelectorAll('.video-card').forEach(function(c) {
                observer.observe(c);
            });
        }

        fetchVideos();
    </script>
</body>
</html>
`;
}
