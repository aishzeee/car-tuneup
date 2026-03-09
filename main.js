document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations (reveal elements)
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger counters when Stats section is revealed
                if (entry.target.classList.contains('hero-stats') && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    runCounters();
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Stats Counter Animation
    const runCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Forum Logic
    const forumForm = document.getElementById('forum-form');
    const commentList = document.getElementById('comment-list');
    const forumText = document.getElementById('forum-text');

    // Load comments from localStorage
    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem('f7_comments_v2') || '[]');
        commentList.innerHTML = '';

        // Default comment
        if (comments.length === 0) {
            comments.push({
                author: 'Car Enthusiast Group',
                text: 'The ECU tuning here completely changed how my vehicle responds on the highway. Incredible tech setup!',
                date: 'Recently'
            });
        }

        comments.slice().reverse().forEach(comment => {
            const card = document.createElement('div');
            card.className = 'comment-card';
            card.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p>${comment.text}</p>
            `;
            commentList.appendChild(card);
        });
    };

    if (forumForm) {
        forumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentText = forumText.value.trim();
            if (commentText) {
                const newComment = {
                    author: 'Guest Member',
                    text: commentText,
                    date: new Date().toLocaleDateString()
                };

                const comments = JSON.parse(localStorage.getItem('f7_comments_v2') || '[]');
                comments.push(newComment);
                localStorage.setItem('f7_comments_v2', JSON.stringify(comments));

                forumText.value = '';
                loadComments();

                // Feedback
                const btn = forumForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Posted!';
                setTimeout(() => btn.innerHTML = originalText, 2500);
            }
        });
        loadComments();
    }

    // Appointment Form Logic
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = appointmentForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            // Mock API call
            setTimeout(() => {
                alert('Thank you! Your appointment request has been logged in our system. A diagnostic specialist will call you shortly.');
                appointmentForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fuel Savings Calculator Logic
    const calcBtn = document.getElementById('calc-btn');
    const calcCurrent = document.getElementById('calc-current');
    const calcTarget = document.getElementById('calc-target');
    const calcDistance = document.getElementById('calc-distance');
    const calcPrice = document.getElementById('calc-price');
    const calcResultVal = document.getElementById('calc-result-val');

    if (calcBtn && calcCurrent && calcTarget && calcDistance && calcPrice && calcResultVal) {

        // Auto-update target average dynamically based on current average (60% improvement)
        calcCurrent.addEventListener('input', () => {
            const current = parseFloat(calcCurrent.value);
            if (!isNaN(current) && current > 0) {
                calcTarget.value = (current * 1.6).toFixed(1).replace(/\.0$/, '');
            } else {
                calcTarget.value = '';
            }
        });

        // The main calculation function
        const calculateSavings = () => {
            const currentAvg = parseFloat(calcCurrent.value);
            const targetAvg = parseFloat(calcTarget.value);
            const commute = parseFloat(calcDistance.value);
            const price = parseFloat(calcPrice.value);

            // Data Validation: Must not be empty/zero, and target_avg must be greater than current_avg
            if (
                !isNaN(currentAvg) && currentAvg > 0 &&
                !isNaN(targetAvg) && targetAvg > 0 &&
                !isNaN(commute) && commute > 0 &&
                !isNaN(price) && price > 0 &&
                targetAvg > currentAvg
            ) {
                // The Logic (Formula)
                const currentLiters = commute / currentAvg;
                const targetLiters = commute / targetAvg;
                const savings = (currentLiters - targetLiters) * price;

                // Formatting: Add commas
                const formattedSavings = Math.round(savings).toLocaleString('en-US');

                // UI Integration & Fade-in Animation
                if (calcResultVal.innerText !== formattedSavings) {
                    calcResultVal.style.transition = 'opacity 0.1s ease-out';
                    calcResultVal.style.opacity = '0';
                    setTimeout(() => {
                        calcResultVal.innerText = formattedSavings;
                        calcResultVal.style.transition = 'opacity 0.4s ease-in, transform 0.2s ease-in-out';
                        calcResultVal.style.opacity = '1';
                        calcResultVal.style.transform = 'scale(1.1)';

                        setTimeout(() => {
                            calcResultVal.style.transform = 'scale(1)';
                        }, 200);
                    }, 100);
                }
            } else {
                calcResultVal.innerText = "0";
            }
        };

        // Event Listeners: Trigger calculation automatically when inputs change
        const inputs = [calcCurrent, calcTarget, calcDistance, calcPrice];
        inputs.forEach(input => {
            input.addEventListener('input', calculateSavings);
        });

        // Trigger on "Calculate Savings" button click as well
        calcBtn.addEventListener('click', calculateSavings);
    }
});
