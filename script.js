/* =============================================
   SCRIPT.JS — Kunjungan Industri BEI
   Interactive, Animated, Modern
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ========== ELEMENTS ========== */
    const preloader     = document.getElementById('preloader');
    const navbar        = document.getElementById('navbar');
    const navToggle     = document.getElementById('navToggle');
    const navMenu       = document.getElementById('navMenu');
    const navLinks      = document.querySelectorAll('.nav-link');
    const backToTop     = document.getElementById('backToTop');
    const cursor        = document.getElementById('cursor');
    const particles     = document.getElementById('particles');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev  = document.getElementById('lightboxPrev');
    const lightboxNext  = document.getElementById('lightboxNext');
    const filterBtns    = document.querySelectorAll('.filter-btn');
    const galleryItems  = document.querySelectorAll('.gallery-item');
    const videoOverlay  = document.getElementById('videoPlayOverlay');
    const mainVideo     = document.getElementById('mainVideo');

    let currentLightboxIndex = 0;
    let visibleGalleryItems = [...galleryItems];

    /* ========== PRELOADER ========== */
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader
            document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
                setTimeout(() => el.classList.add('animated'), 100 + i * 100);
            });
        }, 800);
    });

    /* ========== CUSTOM CURSOR ========== */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top  = e.clientY - 10 + 'px';
        });

        document.querySelectorAll('a, button, .gallery-item, .filter-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ========== PARTICLES ========== */
    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top  = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.animationDuration = (3 + Math.random() * 3) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
            particles.appendChild(p);
        }
    }
    createParticles();

    /* ========== NAVBAR ========== */
    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNav();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id], header[id]');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========== SCROLL ANIMATIONS ========== */
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => {
        // Skip hero elements (handled by preloader)
        if (!el.closest('.hero')) {
            animateObserver.observe(el);
        }
    });

    /* ========== COUNTER ANIMATION ========== */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();
        const start = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    /* ========== GALLERY FILTER ========== */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update visible items for lightbox
            setTimeout(() => {
                visibleGalleryItems = [...galleryItems].filter(item => {
                    return filter === 'all' || item.dataset.category === filter;
                });
            }, 350);
        });
    });

    /* ========== LIGHTBOX ========== */
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const visibleIndex = visibleGalleryItems.indexOf(item);
            if (visibleIndex === -1) return;
            currentLightboxIndex = visibleIndex;
            openLightbox();
        });
    });

    function openLightbox() {
        const item = visibleGalleryItems[currentLightboxIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay p').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${visibleGalleryItems.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        openLightbox();
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
        openLightbox();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    /* ========== VIDEO ========== */
    const heroWatchBtn = document.querySelector('a[href="#video"]');

    function playVlog() {
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (mainVideo) {
            mainVideo.play().catch(err => {
                console.log('Autoplay dicegah browser atau video error:', err);
            });
        }
    }

    if (heroWatchBtn) {
        heroWatchBtn.addEventListener('click', () => {
            setTimeout(() => {
                playVlog();
            }, 600);
        });
    }

    if (videoOverlay && mainVideo) {
        videoOverlay.addEventListener('click', () => {
            playVlog();
        });

        mainVideo.addEventListener('play', () => {
            videoOverlay.classList.add('hidden');
        });

        mainVideo.addEventListener('pause', () => {
            if (!mainVideo.ended) {
                videoOverlay.classList.remove('hidden');
            }
        });

        mainVideo.addEventListener('ended', () => {
            videoOverlay.classList.remove('hidden');
        });
    }

    /* ========== SMOOTH SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ========== PARALLAX ON HERO SHAPES ========== */
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroEl = document.querySelector('.hero');
        if (heroEl && scrolled < heroEl.offsetHeight) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((p, i) => {
                const speed = (i % 5 + 1) * 0.015;
                p.style.marginTop = scrolled * speed + 'px';
            });
        }
    });

    console.log('🚀 Website Kunjungan Industri BEI — Loaded successfully!');
});
