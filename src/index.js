/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * Fix: Runtime Exception (1101) & API Robustness
 * Updated by AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Proxying Endpoint
    if (url.pathname === "/api/feed") {
      const apiKey = env.TIKTOK_API_KEY || "dedi131";
      
      try {
        const apiRes = await fetch(`https://api.ferdev.my.id/search/tiktok?query=pargoy&apikey=${apiKey}`, {
          headers: { "User-Agent": "Cloudflare-Worker-WB-TikTok" }
        });

        if (!apiRes.ok) throw new Error("Upstream API error");

        const data = await apiRes.json();
        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: false, error: "Service temporarily unavailable" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Main UI Response
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
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        .sidebar { position: absolute; right: 15px; bottom: 100px; display: flex; flex-direction: column; gap: 20px; align-items: center; z-index: 10; }
        .icon-circle { width: 48px; height: 48px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; cursor: pointer; }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; pointer-events: none; z-index: 5; }
        .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ff0050; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex items-center justify-center bg-black">
            <div class="loader"></div>
        </div>
    </div>

    <script>
        async function fetchVideos() {
            try {
                const response = await fetch('/api/feed');
                const result = await response.json();
                document.getElementById('loading')?.remove();
                if (result.status && result.result) {
                    renderVideos(result.result);
                } else {
                    document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center">Gagal memuat video.</div>';
                }
            } catch (error) {
                console.error('Frontend Error:', error);
            }
        }

        function renderVideos(videos) {
            const app = document.getElementById('app');
            videos.forEach((video) => {
                const card = document.createElement('div');
                card.className = 'video-card';
                const videoSrc = video.video || video.play || video.url || '';
                const author = video.author?.nickname || 'user';
                const title = video.title || '';

                card.innerHTML = \`
                    <video loop playsinline muted onclick="this.paused ? this.play() : this.pause()">
                        <source src="\\${videoSrc}" type="video/mp4">
                    </video>
                    <div class="sidebar">
                        <div class="icon-circle"><i class="fas fa-heart"></i></div>
                        <div class="icon-circle"><i class="fas fa-comment"></i></div>
                        <div class="icon-circle"><i class="fas fa-share"></i></div>
                    </div>
                    <div class="overlay">
                        <h3 class="font-bold">@\\${author}</h3>
                        <p class="text-sm opacity-90">\\${title}</p>
                    </div>\\`;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const v = e.target.querySelector('video');
                    if (v) {
                        if (e.isIntersecting) v.play().catch(() => {});
                        else v.pause();
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
