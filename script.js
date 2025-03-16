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
  
    // IntersectionObserver pour zoomer le slide visible
    const options = {
      root: null,
      threshold: 0.6 // 60% de visibilité
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
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
    musicPlayer.addEventListener('mousedown', function(e) {
      // Éviter de déclencher le drag si on clique sur un bouton
      if (e.target.tagName.toLowerCase() === 'button') return;
      
      isDown = true;
      offset = [
        musicPlayer.offsetLeft - e.clientX,
        musicPlayer.offsetTop - e.clientY
      ];
    }, true);
  
    document.addEventListener('mouseup', function() {
      isDown = false;
    }, true);
  
    document.addEventListener('mousemove', function(e) {
      e.preventDefault();
      if (isDown) {
        musicPlayer.style.left = (e.clientX + offset[0]) + 'px';
        musicPlayer.style.top  = (e.clientY + offset[1]) + 'px';
      }
    }, true);
    
    // Gestion Tactile
    musicPlayer.addEventListener('touchstart', function(e) {
      // Éviter de déclencher le drag si on touche un bouton
      if (e.target.tagName.toLowerCase() === 'button') return;
      
      isDown = true;
      offset = [
        musicPlayer.offsetLeft - e.touches[0].clientX,
        musicPlayer.offsetTop - e.touches[0].clientY
      ];
    }, { passive: false });
  
    document.addEventListener('touchend', function() {
      isDown = false;
    }, { passive: false });
  
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (isDown) {
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
      {
        title: "Timeless - The Weeknd (feat Playboi Carti)",
        src: "./audio/The-Weeknd-Playboi-Carti-Timeless.mp3"
      },
      {
        title: "FASHION DESIGNA - Theodora",
        src: "./audio/FASHION-DESIGNA.mp3"
      },
      {
        title: "Le Tango Me Fait Pleurer - Daniel Vangarde",
        src: "./audio/Daniel-Vangarde-Le-Tango-Me-Fait-Pleurer.mp3"
      },
      {
        title: "Suffocation - Crystal Castles",
        src: "./audio/Crystal-Castles-Suffocation.mp3"
      },
      {
        title: "Cherish The Day - Sade",
        src: "./audio/Cherish-the-Day-Sade.mp3"
      }
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
        playBtn.textContent = "❚❚"; // Icône de "pause"
      } else {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.textContent = "▶︎"; // Icône de "lecture"
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
  