/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * API Source: https://api.ferdev.my.id
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve the UI
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
    <title>WB TikTok - Modern Experience</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background-color: #000;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }

        .video-container {
            height: 100vh;
            width: 100%;
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .video-container::-webkit-scrollbar {
            display: none;
        }

        .video-card {
            position: relative;
            height: 100vh;
            width: 100%;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
        }

        video {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .sidebar {
            position: absolute;
            right: 15px;
            bottom: 100px;
            display: flex;
            flex-direction: column;
            gap: 25px;
            align-items: center;
            z-index: 10;
        }

        .action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            gap: 5px;
            transition: transform 0.2s;
        }

        .action-btn:active {
            transform: scale(0.9);
        }

        .icon-circle {
            width: 45px;
            height: 45px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff0050;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .music-disc {
            animation: rotate 3s linear infinite;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 8px solid #333;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>

    <div id="app" class="video-container">
        <!-- Loading State -->
        <div id="loading" class="h-screen w-screen flex items-center justify-center bg-black">
            <div class="loader"></div>
        </div>
    </div>

    <script>
        const API_URL = "https://api.ferdev.my.id/search/tiktok?query=pargoy&apikey=dedi131";
        const app = document.getElementById('app');

        async function fetchVideos() {
            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                
                // Remove loader
                document.getElementById('loading').remove();

                if (result.status && result.result) {
                    renderVideos(result.result);
                } else {
                    app.innerHTML = '<div class="text-white p-10">Gagal memuat video atau API limit reached.</div>';
                }
            } catch (error) {
                console.error(error);
                app.innerHTML = '<div class="text-white p-10">Terjadi kesalahan koneksi.</div>';
            }
        }

        function renderVideos(videos) {
            videos.forEach((video, index) => {
                const card = document.createElement('div');
                card.className = 'video-card';
                
                // Fallback for video URL (some APIs use 'video', 'play', or 'url')
                const videoSrc = video.video || video.play || video.url;
                const authorName = video.author?.nickname || "User TikTok";
                const description = video.title || "No caption available";

                card.innerHTML = `
                    <video loop playsinline preload="auto" onclick="togglePlay(this)">
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                    
                    <div class="sidebar">
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-heart"></i></div>
                            <span class="text-xs font-semibold">${formatCount(video.stats?.digg_count || 1280)}</span>
                        </div>
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-comment-dots"></i></div>
                            <span class="text-xs font-semibold">${formatCount(video.stats?.comment_count || 45)}</span>
                        </div>
                        <div class="action-btn">
                            <div class="icon-circle"><i class="fas fa-share"></i></div>
                            <span class="text-xs font-semibold">Share</span>
                        </div>
                        <div class="mt-4">
                            <img src="https://www.transparentpng.com/download/vinyl/classic-vinyl-record-transparent-background-5.png" class="music-disc" />
                        </div>
                    </div>

                    <div class="overlay">
                        <h3 class="font-bold text-lg text-white mb-1">@${authorName}</h3>
                        <p class="text-sm text-gray-200 line-clamp-2 mb-4">${description}</p>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-music text-xs"></i>
                            <marquee class="text-xs w-40" behavior="scroll" direction="left">Original Sound - ${authorName}</marquee>
                        </div>
                    </div>
                `;
                
                app.appendChild(card);
            });

            // Auto play the first video
            setupIntersectionObserver();
        }

        function togglePlay(video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }

        function formatCount(num) {
            if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num/1000).toFixed(1) + 'K';
            return num;
        }

        function setupIntersectionObserver() {
            const options = {
                root: app,
                threshold: 0.6
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('video');
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log("Autoplay blocked"));
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }, options);

            document.querySelectorAll('.video-card').forEach(card => observer.observe(card));
        }

        // Init
        fetchVideos();
    </script>
</body>
</html>
  `;
}
