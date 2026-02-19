/**
 * WB TikTok - Modern & Luxurious TikTok Clone for Cloudflare Workers
 * API Source: https://api.ferdev.my.id
 */

export default {
  async fetch(request, env, ctx) {
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
        body, html { margin: 0; padding: 0; height: 100%; background-color: #000; font-family: 'Inter', sans-serif; overflow: hidden; }
        .video-container { height: 100vh; width: 100%; scroll-snap-type: y mandatory; overflow-y: scroll; scrollbar-width: none; -ms-overflow-style: none; }
        .video-container::-webkit-scrollbar { display: none; }
        .video-card { position: relative; height: 100vh; width: 100%; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; background: #000; }
        video { height: 100%; width: 100%; object-fit: cover; }
        .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; display: flex; flex-direction: column; gap: 8px; }
        .sidebar { position: absolute; right: 15px; bottom: 100px; display: flex; flex-direction: column; gap: 25px; align-items: center; z-index: 10; }
        .action-btn { display: flex; flex-direction: column; align-items: center; color: white; gap: 5px; transition: transform 0.2s; }
        .icon-circle { width: 45px; height: 45px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #ff0050; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .music-disc { animation: rotate 3s linear infinite; width: 40px; height: 40px; border-radius: 50%; border: 8px solid #333; }
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
        const API_URL = "https://api.ferdev.my.id/search/tiktok?query=pargoy&apikey=dedi131";
        const app = document.getElementById('app');

        async function fetchVideos() {
            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                document.getElementById('loading').remove();
                if (result.status && result.result) { renderVideos(result.result); }
            } catch (error) { console.error(error); }
        }

        function renderVideos(videos) {
            videos.forEach((video) => {
                const card = document.createElement('div');
                card.className = 'video-card';
                const videoSrc = video.video || video.play || video.url;
                card.innerHTML = `
                    <video loop playsinline preload="auto" onclick="this.paused ? this.play() : this.pause()">
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                    <div class="sidebar">
                        <div class="action-btn"><div class="icon-circle"><i class="fas fa-heart"></i></div><span>Suka</span></div>
                        <div class="action-btn"><div class="icon-circle"><i class="fas fa-comment-dots"></i></div><span>Komen</span></div>
                        <div class="action-btn"><div class="icon-circle"><i class="fas fa-share"></i></div><span>Bagikan</span></div>
                    </div>
                    <div class="overlay">
                        <h3 class="font-bold">@${video.author?.nickname || 'user'}</h3>
                        <p class="text-sm">${video.title || ''}</p>
                    </div>`;
                app.appendChild(card);
            });
            setupObserver();
        }

        function setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const v = e.target.querySelector('video');
                    if (e.isIntersecting) v.play().catch(() => {});
                    else { v.pause(); v.currentTime = 0; }
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
