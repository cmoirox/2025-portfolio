/***************************************************
 * GESTION DU CURSEUR PERSONNALISÉ + CAROUSEL
 ***************************************************/
document.addEventListener('DOMContentLoaded', () => {
  // Sélection du curseur personnalisé et du conteneur
  const customCursor = document.querySelector('.custom-cursor');
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.slide');

  // Positionnement du curseur personnalisé en suivant la souris
  document.addEventListener('mousemove', (e) => {
    if (customCursor) {
      customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });

  // Quand la souris entre dans le carousel-container
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      carouselContainer.style.cursor = 'none';
      customCursor.style.display = 'block';
    });

    // Quand la souris sort du carousel-container
    carouselContainer.addEventListener('mouseleave', () => {
      carouselContainer.style.cursor = 'default';
      customCursor.style.display = 'none';
    });
  }

  // Détection du navigateur Instagram
  const isInstagramBrowser = /Instagram/.test(navigator.userAgent);

  // IntersectionObserver pour zoomer le slide visible ET gérer la lecture vidéo
  const options = {
    root: null,
    threshold: isInstagramBrowser ? 0.9 : 0.6 // Seuil plus élevé pour Instagram
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const slide = entry.target;
      const video = slide.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        // Attributs pour compatibilité maximale
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('x5-video-player-type', 'h5');
        video.muted = true;
        
        // Préchargement pour Instagram
        if (isInstagramBrowser) {
          video.load();
        }
        
        // Tentative de lecture
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Erreur de lecture:', err);
            // Deuxième tentative avec timeout
            setTimeout(() => {
              video.play().catch(e => console.log('Échec après timeout:', e));
            }, 300);
          });
        }
        
        slide.classList.add('active');
      } else {
        video.pause();
        slide.classList.remove('active');
      }
    });
  }, options);

  slides.forEach(slide => {
    observer.observe(slide);
  });
});

/***************************************************
 * DRAGGABLE PLAYER DE MUSIQUE (Souris + Tactile)
 ***************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const musicPlayer = document.getElementById('music-player');
  let isDown = false;
  let offset = [0, 0];

  // Gestion Souris
  musicPlayer.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    isDown = true;
    offset = [
      musicPlayer.offsetLeft - e.clientX,
      musicPlayer.offsetTop - e.clientY
    ];
  }, true);

  document.addEventListener('mouseup', () => {
    isDown = false;
  }, true);

  document.addEventListener('mousemove', (e) => {
    if (isDown) {
      e.preventDefault();
      musicPlayer.style.left = (e.clientX + offset[0]) + 'px';
      musicPlayer.style.top  = (e.clientY + offset[1]) + 'px';
    }
  }, true);

  // Gestion Tactile
  musicPlayer.addEventListener('touchstart', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    isDown = true;
    offset = [
      musicPlayer.offsetLeft - e.touches[0].clientX,
      musicPlayer.offsetTop - e.touches[0].clientY
    ];
  }, { passive: false });

  document.addEventListener('touchend', () => {
    isDown = false;
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (isDown) {
      e.preventDefault();
      musicPlayer.style.left = (e.touches[0].clientX + offset[0]) + 'px';
      musicPlayer.style.top  = (e.touches[0].clientY + offset[1]) + 'px';
    }
  }, { passive: false });
});


/***************************************************
 * GESTION DU PLAYER AUDIO / PLAYLIST
 ***************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn     = document.getElementById('playBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const prevBtn     = document.getElementById('prevBtn');
  const trackTitle  = document.getElementById('track-title');

  // Liste des morceaux
  const tracks = [
    { title: "Timeless - The Weeknd (feat Playboi Carti)", src: "./audio/The-Weeknd-Playboi-Carti-Timeless.mp3" },
    { title: "FASHION DESIGNA - Theodora",                 src: "./audio/FASHION-DESIGNA.mp3" },
    { title: "Le Tango Me Fait Pleurer - Daniel Vangarde", src: "./audio/Daniel-Vangarde-Le-Tango-Me-Fait-Pleurer.mp3" },
    { title: "Dead Disco - Metric",              src: "./audio/Metric-Dead-Disco.mp3" },
    { title: "Casualty - Snake River Conspiracy",              src: "./audio/Casualty.mp3" }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  // Fonction pour charger un morceau
  function loadTrack(index) {
    audioPlayer.src = tracks[index].src;
    trackTitle.textContent = tracks[index].title;
  }

  // Initialisation
  loadTrack(currentTrackIndex);

  // Lecture / Pause
  function togglePlay() {
    if (!isPlaying) {
      audioPlayer.play();
      isPlaying = true;
      playBtn.textContent = "❚❚"; // Icône "pause"
    } else {
      audioPlayer.pause();
      isPlaying = false;
      playBtn.textContent = "▶︎"; // Icône "lecture"
    }
  }

  // Morceau suivant
  function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= tracks.length) {
      currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
  }

  // Morceau précédent
  function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
      currentTrackIndex = tracks.length - 1;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
  }

  // Écouteurs sur les boutons
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);

  // Quand le morceau se termine, on passe au suivant
  audioPlayer.addEventListener('ended', () => {
    nextTrack();
  });
});
