/**
 * WB TikTok - Diagnostic Version
 * Mendiagnosa penyebab kegagalan API secara visual
 * Oleh AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);

    if (url.pathname === '/api/feed') {
      var apiKey = env.TIKTOK_API_KEY || 'dedi131';
      try {
        // Fetch dengan query 'pargoy' dan User-Agent browser asli
        var apiUrl = 'https://api.ferdev.my.id/search/tiktok?query=pargoy&apikey=' + apiKey;
        var apiRes = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          }
        });

        // Ambil teks mentah untuk didiagnosa di frontend jika bukan JSON
        var rawText = await apiRes.text();
        return new Response(rawText, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: false, msg: err.message }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(generateHTML(), {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  }
};

function generateHTML() {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>WB TikTok - Diagnostic Mode</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; color: white; font-family: system-ui, sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex flex-col items-center justify-center p-10 text-center">
            <div class="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p class="text-sm text-gray-400">Mendiagnosa koneksi API...</p>
        </div>
    </div>

    <script>
        async function fetchVideos() {
            try {
                var res = await fetch('/api/feed');
                var text = await res.text();
                var loader = document.getElementById('loading');
                if (loader) loader.remove();

                try {
                    var result = JSON.parse(text);
                    // Mendukung berbagai struktur data API
                    var data = result.result || result.data || (Array.isArray(result) ? result : null);
                    
                    if (data && data.length > 0) {
                        renderVideos(data);
                    } else {
                        showDebugError('DATA KOSONG/API ERROR. Respon Server: ' + text);
                    }
                } catch (e) {
                    showDebugError('RESPON BUKAN JSON. Respon Server: ' + text);
                }
            } catch (error) {
                showDebugError('GAGAL MENGHUBUNGI PROXY WORKER. Error: ' + error.message);
            }
        }

        function showDebugError(msg) {
            document.getElementById('app').innerHTML = '<div class="p-10 text-red-500 text-xs font-mono break-all">' + 
                '<h2 class="font-bold text-lg mb-2">DEBUG ERROR:</h2>' + msg + '</div>';
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

                var html = '<video loop playsinline muted onclick="this.paused ? this.play() : this.pause()">';
                html += '<source src="' + vSrc + '" type="video/mp4">';
                html += '</video>';
                html += '<div class="absolute bottom-10 left-5 text-white p-4 bg-black/50 backdrop-blur-md rounded-xl pointer-events-none">';
                html += '<p class="font-bold">@' + author + '</p>';
                html += '<p class="text-xs opacity-80">' + title + '</p>';
                html += '</div>';

                card.innerHTML = html;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    var v = e.target.querySelector('video');
                    if (v) {
                        if (e.isIntersecting) v.play().catch(function(){});
                        else v.pause();
                    }
                });
            }, { threshold: 0.6 });
            document.querySelectorAll('.video-card').forEach(function(c) { obs.observe(c); });
        }

        fetchVideos();
    </script>
</body>
</html>
`;
}
