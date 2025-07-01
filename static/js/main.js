// Main JavaScript file for Sagrado Cantina

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation and submission
    const contactForm = document.querySelector('form[method="post"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Reset previous error states
            [name, email, message].forEach(field => {
                if (field) {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Validate name
            if (!name || name.value.trim().length < 2) {
                if (name) name.classList.add('is-invalid');
                isValid = false;
            }
            
            // Validate email
            if (!email || !isValidEmail(email.value)) {
                if (email) email.classList.add('is-invalid');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.value.trim().length < 10) {
                if (message) message.classList.add('is-invalid');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual endpoint)
                setTimeout(() => {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item, .card');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Booking form enhancements
    const bookingForm = document.querySelector('form[action*="book"]');
    if (bookingForm) {
        const dateInput = bookingForm.querySelector('input[type="date"]');
        const timeInput = bookingForm.querySelector('input[type="time"]');
        
        // Set minimum date to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
        
        // Set time constraints
        if (timeInput) {
            timeInput.addEventListener('change', function() {
                const selectedTime = this.value;
                const hour = parseInt(selectedTime.split(':')[0]);
                
                if (hour < 12 || hour > 21) {
                    showNotification('Please select a time between 12:00 PM and 9:00 PM', 'error');
                    this.value = '';
                }
            });
        }
    }

    // Google Maps integration enhancement
    const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
    if (mapIframe) {
        // Add loading state
        mapIframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add click to open in new tab
        const mapContainer = mapIframe.parentElement;
        mapContainer.style.cursor = 'pointer';
        mapContainer.addEventListener('click', function() {
            window.open('https://maps.app.goo.gl/5DoeSAs3GjsDimbo8', '_blank');
        });
    }

    // Social media links enhancement
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click tracking (you can integrate with Google Analytics here)
            console.log('Social link clicked:', this.href);
        });
    });

    // Mobile menu improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    console.log(navbarToggler)
    const navbarCollapse = document.querySelector('.navbar-collapse');
    console.log(navbarCollapse)
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Any scroll-based functionality can go here
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Console welcome message
    console.log('%c🍽️ Welcome to Sagrado Cantina! 🍽️', 'color: #c41e3a; font-size: 20px; font-weight: bold;');
    console.log('%cAuthentic Mexican cuisine in the heart of Auckland', 'color: #666; font-size: 14px;');
});

// Additional utility functions
window.SagradoCantina = {
    // Show loading spinner
    showLoading: function() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        spinner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(spinner);
    },

    // Hide loading spinner
    hideLoading: function() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    },

    // Format phone number
    formatPhone: function(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },

    // Validate form fields
    validateField: function(field, rules) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (rules.required && !value) {
            isValid = false;
            message = 'This field is required.';
        } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        } else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            message = `This field must be at least ${rules.minLength} characters long.`;
        }

        return { isValid, message };
    }
};

// Animación de elementos al hacer scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// // Navegación responsive
// const navbarToggler = document.querySelector('.navbar-toggler');
// const navbarCollapse = document.querySelector('.navbar-collapse');

// if (navbarToggler && navbarCollapse) {
//     navbarToggler.addEventListener('click', () => {
//         navbarCollapse.classList.toggle('show');
//     });

//     // Cerrar el menú al hacer clic en un enlace
//     document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
//         link.addEventListener('click', () => {
//             if (navbarCollapse.classList.contains('show')) {
//                 navbarCollapse.classList.remove('show');
//             }
//         });
//     });
// }

// Efecto parallax para la sección hero
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
}
