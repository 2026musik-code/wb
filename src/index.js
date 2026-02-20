/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * Optimized & Secured by AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Endpoint Proxy untuk API TikTok (Menyembunyikan API Key)
    if (url.pathname === "/api/feed") {
      const searchQuery = url.searchParams.get("q") || "pargoy";
      const apiKey = env.TIKTOK_API_KEY || "dedi131"; 
      
      try {
        const apiRes = await fetch(`https://api.ferdev.my.id/search/tiktok?query=${searchQuery}&apikey=${apiKey}`);
        const data = await apiRes.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Failed to fetch API" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Serve UI Utama
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
    <title>WB TikTok - Premium Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: 'Inter', sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.95)); color: white; pointer-events: none; }
        .sidebar { position: absolute; right: 15px; bottom: 120px; display: flex; flex-direction: column; gap: 20px; align-items: center; z-index: 10; }
        .action-btn { display: flex; flex-direction: column; align-items: center; color: white; gap: 5px; cursor: pointer; }
        .icon-circle { width: 50px; height: 50px; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; transition: 0.3s; }
        .action-btn:hover .icon-circle { background: rgba(255,255,255,0.25); transform: scale(1.05); }
        .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ff0050; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .music-disc { animation: rotate 4s linear infinite; width: 45px; height: 45px; border-radius: 50%; border: 4px solid #333; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex items-center justify-center bg-black">
            <div class="loader"></div>
        </div>
    </div>

    <script>
        const app = document.getElementById('app');
        const escapeHTML = (str) => {
            const div = document.createElement('div');
            div.textContent = str || '';
            return div.innerHTML;
        };

        async function fetchVideos() {
            try {
                const response = await fetch('/api/feed');
                const result = await response.json();
                const loader = document.getElementById('loading');
                if (loader) loader.remove();

                if (result.status && result.result) {
                    renderVideos(result.result);
                } else {
                    app.innerHTML = '<div class="text-white p-10 text-center">Gagal memuat konten. Silakan coba lagi nanti.</div>';
                }
            } catch (error) {
                app.innerHTML = '<div class="text-white p-10 text-center">Kesalahan Jaringan.</div>';
            }
        }

        function renderVideos(videos) {
            videos.forEach((video) => {
                const card = document.createElement('div');
                card.className = 'video-card';
                const videoSrc = video.video || video.play || video.url;
                const author = escapeHTML(video.author?.nickname || 'user');
                const title = escapeHTML(video.title || '');

                card.innerHTML = `
                    <video loop playsinline muted preload="auto" onclick="this.paused ? this.play() : this.pause()">
                        <source src="\${videoSrc}" type="video/mp4">
                    </video>
                    
                    <div class="sidebar">
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-heart"></i></div>
                            <span class="text-xs font-bold">Like</span>
                        </div>
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-comment-dots"></i></div>
                            <span class="text-xs font-bold">Comment</span>
                        </div>
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-share"></i></div>
                            <span class="text-xs font-bold">Share</span>
                        </div>
                        <div class="mt-4">
                            <img src="https://www.transparentpng.com/download/vinyl/classic-vinyl-record-transparent-background-5.png" class="music-disc" />
                        </div>
                    </div>

                    <div class="overlay">
                        <h3 class="font-bold text-lg mb-1">@\${author}</h3>
                        <p class="text-sm opacity-90 line-clamp-2 mb-4">\${title}</p>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-music text-xs"></i>
                            <div class="overflow-hidden w-48 text-xs italic">Original Audio - \${author}</div>
                        </div>
                    </div>`;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const v = e.target.querySelector('video');
                    if (e.isIntersecting) {
                        v.play().catch(() => console.log("Autoplay muted blocked"));
                    } else {
                        v.pause();
                    }
                });
            }, { threshold: 0.6 });
            document.querySelectorAll('.video-card').forEach(c => observer.observe(c));
        }

        fetchVideos();
    </script>
</body>
</html>
`;
}
