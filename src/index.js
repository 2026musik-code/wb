/**
 * WB TikTok - Client-side Direct Request Version
 * Solusi untuk menghindari blokir IP Cloudflare (Error 403)
 * Dioptimalkan oleh AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    // Worker sekarang hanya bertugas menyajikan UI (HTML)
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
    <title>WB TikTok - Premium Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        .sidebar { position: absolute; right: 15px; bottom: 100px; display: flex; flex-direction: column; gap: 20px; z-index: 10; }
        .icon-circle { width: 48px; height: 48px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; cursor: pointer; transition: transform 0.2s; }
        .icon-circle:active { transform: scale(0.9); }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; pointer-events: none; z-index: 5; }
        .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ff0050; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex flex-col items-center justify-center">
            <div class="loader mb-4"></div>
            <p class="text-white/50 animate-pulse text-sm font-medium">Mengambil konten...</p>
        </div>
    </div>

    <script>
        async function fetchVideos() {
            // Permintaan langsung dari browser untuk bypass blokir IP Worker
            const API_KEY = 'dedi131';
            const API_URL = 'https://api.ferdev.my.id/search/tiktok?query=pargoy&apikey=' + API_KEY;

            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                
                const loader = document.getElementById('loading');
                if (loader) loader.remove();

                const videoData = result.result || result.data || (Array.isArray(result) ? result : null);
                
                if (videoData && Array.isArray(videoData) && videoData.length > 0) {
                    renderVideos(videoData);
                } else {
                    document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center font-medium">API sedang sibuk. Silakan segarkan halaman.</div>';
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center font-medium">Gagal terhubung ke server API. Periksa koneksi internet Anda.</div>';
            }
        }

        function renderVideos(videos) {
            const app = document.getElementById('app');
            videos.forEach(function(video) {
                const card = document.createElement('div');
                card.className = 'video-card';
                const vSrc = video.video || video.play || video.url || '';
                const author = video.author ? video.author.nickname : 'user';
                const title = video.title || '';

                if (!vSrc) return;

                var html = '<video loop playsinline muted onclick="this.paused ? this.play() : this.pause()">';
                html += '<source src="' + vSrc + '" type="video/mp4">';
                html += '</video>';
                html += '<div class="sidebar">';
                html += '<div class="icon-circle"><i class="fas fa-heart"></i></div>';
                html += '<div class="icon-circle"><i class="fas fa-comment"></i></div>';
                html += '<div class="icon-circle"><i class="fas fa-share"></i></div>';
                html += '</div>';
                html += '<div class="overlay">';
                html += '<h3 class="font-bold text-lg">@' + author + '</h3>';
                html += '<p class="text-sm opacity-90">' + title + '</p>';
                html += '</div>';

                card.innerHTML = html;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    const v = e.target.querySelector('video');
                    if (v) {
                        if (e.isIntersecting) v.play().catch(function(){});
                        else v.pause();
                    }
                });
            }, { threshold: 0.6 });
            document.querySelectorAll('.video-card').forEach(function(c) { observer.observe(c); });
        }

        fetchVideos();
    </script>
</body>
</html>
`;
}
