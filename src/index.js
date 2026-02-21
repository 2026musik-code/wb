/**
 * WB TikTok - Search Engine Edition
 * Fitur: Pencarian Video Dinamis & UI Premium
 * Dioptimalkan oleh AGEN ALENA NOVIANTI
 */

export default {
  async fetch(request, env, ctx) {
    // Worker menyajikan UI utama
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
    <title>WB TikTok - Search Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        
        /* Search Bar Glassmorphism */
        .search-box { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 450px; z-index: 100; display: flex; gap: 8px; }
        .search-input { flex: 1; background: rgba(255,255,255,0.1); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.2); border-radius: 30px; padding: 12px 25px; color: white; outline: none; font-size: 14px; transition: all 0.3s; }
        .search-input:focus { background: rgba(255,255,255,0.2); border-color: #ff0050; }
        .search-btn { background: #ff0050; color: white; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: transform 0.2s; flex-shrink: 0; }
        .search-btn:active { transform: scale(0.9); }

        .sidebar { position: absolute; right: 15px; bottom: 100px; display: flex; flex-direction: column; gap: 20px; z-index: 10; }
        .icon-circle { width: 48px; height: 48px; background: rgba(255,255,255,0.15); backdrop-filter: blur(15px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; cursor: pointer; }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.85)); color: white; pointer-events: none; z-index: 5; }
        .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ff0050; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <!-- Search Bar UI -->
    <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Cari Naruto, Anime, atau Musik..." onkeypress="if(event.key === 'Enter') performSearch()">
        <button onclick="performSearch()" class="search-btn"><i class="fas fa-search"></i></button>
    </div>

    <div id="app" class="video-container">
        <div id="loading" class="h-screen w-screen flex flex-col items-center justify-center">
            <div class="loader mb-4"></div>
            <p class="text-white/50 text-sm animate-pulse font-medium">Menginisialisasi Feed...</p>
        </div>
    </div>

    <script>
        var API_KEY = 'dedi131';

        async function fetchVideos(query) {
            var keyword = query || 'trending';
            var API_URL = 'https://api.ferdev.my.id/search/tiktok?query=' + encodeURIComponent(keyword) + '&apikey=' + API_KEY;
            
            var app = document.getElementById('app');
            // Clear screen & Show Loading
            app.innerHTML = '<div class="h-screen w-screen flex items-center justify-center"><div class="loader"></div></div>';

            try {
                var response = await fetch(API_URL);
                var result = await response.json();
                
                app.innerHTML = '';

                var videoData = result.result || result.data || (Array.isArray(result) ? result : null);
                
                if (videoData && Array.isArray(videoData) && videoData.length > 0) {
                    renderVideos(videoData);
                } else {
                    app.innerHTML = '<div class="text-white p-20 text-center font-medium">Tidak ditemukan video untuk "' + keyword + '"</div>';
                }
            } catch (error) {
                app.innerHTML = '<div class="text-white p-20 text-center font-medium">Gagal terhubung ke API. Periksa koneksi Anda.</div>';
            }
        }

        function performSearch() {
            var val = document.getElementById('searchInput').value;
            if (val.trim() !== '') {
                fetchVideos(val);
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

                // Anti-Build Error String Concatenation
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
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    var v = e.target.querySelector('video');
                    if (v) {
                        if (e.isIntersecting) v.play().catch(function(){});
                        else v.pause();
                    }
                });
            }, { threshold: 0.6 });
            document.querySelectorAll('.video-card').forEach(function(c) { observer.observe(c); });
        }

        // Init with trending
        fetchVideos('trending');
    </script>
</body>
</html>
`;
}
