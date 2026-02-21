/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * Enhanced Data Connectivity & Client Debugging
 * Updated by AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Proxying Endpoint
    if (url.pathname === "/api/feed") {
      const apiKey = env.TIKTOK_API_KEY || "dedi131";
      try {
        // Menggunakan query 'trending' agar lebih stabil mendapatkan hasil
        const apiUrl = `https://api.ferdev.my.id/search/tiktok?query=trending&apikey=${apiKey}`;
        const apiRes = await fetch(apiUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
          }
        });

        if (!apiRes.ok) throw new Error(`API status: ${apiRes.status}`);

        const data = await apiRes.text();
        return new Response(data, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: false, msg: err.message }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
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
    <title>WB TikTok - Premium</title>
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
            <div class="flex flex-col items-center gap-4">
                <div class="w-10 h-10 border-4 border-white/20 border-t-[#ff0050] rounded-full animate-spin"></div>
                <p class="text-white/50 text-sm">Memuat konten...</p>
            </div>
        </div>
    </div>

    <script>
        async function fetchVideos() {
            try {
                const response = await fetch('/api/feed');
                const result = await response.json();
                
                // DEBUGGING: Lihat respon API di Console (F12)
                console.log("Raw API Result:", result);

                const loader = document.getElementById('loading');
                if (loader) loader.remove();

                // Deteksi otomatis struktur data
                const videoData = result.result || result.data || (Array.isArray(result) ? result : null);
                
                if (videoData && Array.isArray(videoData) && videoData.length > 0) {
                    renderVideos(videoData);
                } else {
                    console.warn("Struktur data tidak dikenali atau kosong:", result);
                    document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center">Data tidak ditemukan. Cek Console (F12).</div>';
                }
            } catch (error) {
                console.error("Frontend Fetch Error:", error);
                document.getElementById('app').innerHTML = '<div class="text-white p-10 text-center">Gagal memproses data API.</div>';
            }
        }

        function renderVideos(videos) {
            const app = document.getElementById('app');
            videos.forEach((video) => {
                const card = document.createElement('div');
                card.className = 'video-card';
                
                // Fallback untuk berbagai format nama properti URL video
                const vSrc = video.video || video.play || video.url || video.video_url || '';
                const author = video.author?.nickname || video.nickname || 'user';
                const title = video.title || video.description || '';

                if (!vSrc) return;

                card.innerHTML = \`
                    <video loop playsinline muted onclick="this.paused ? this.play() : this.pause()">
                        <source src="\\${vSrc}" type="video/mp4">
                    </video>
                    <div class="sidebar">
                        <div class="icon-circle"><i class="fas fa-heart"></i></div>
                        <div class="icon-circle"><i class="fas fa-comment"></i></div>
                        <div class="icon-circle"><i class="fas fa-share"></i></div>
                    </div>
                    <div class="overlay">
                        <h3 class="font-bold text-lg">@\\${author}</h3>
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
