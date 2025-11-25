// ===================================
// RITAJ RESTAURANT - JAVASCRIPT
// ===================================

// ===== TRANSLATION DATA =====
const translations = {
    en: {
        'hero-title': 'RITAJ',
        'hero-subtitle': 'Authentic Middle Eastern Cuisine',
        'hero-location': 'Electra Street, Abu Dhabi, UAE',
        'btn-menu': 'View Menu',
        'btn-contact': 'Contact Us',
        'about-title': 'About Ritaj',
        'about-text-1': 'Welcome to Ritaj Restaurant, where tradition meets excellence. Located in the heart of Abu Dhabi, we bring you the finest Middle Eastern cuisine crafted with passion and authenticity.',
        'about-text-2': 'Our chefs use only the freshest ingredients and time-honored recipes to create dishes that transport you to the rich culinary heritage of the Middle East. Every meal is a celebration of flavor, culture, and hospitality.',
        'about-text-3': 'Whether you\'re joining us for a family gathering, business lunch, or romantic dinner, Ritaj offers an unforgettable dining experience in an elegant atmosphere.',
        'feature-quality': 'Premium Quality',
        'feature-quality-desc': 'Fresh ingredients, authentic recipes',
        'feature-cuisine': 'Traditional Cuisine',
        'feature-cuisine-desc': 'Time-honored Middle Eastern dishes',
        'feature-hospitality': 'Warm Hospitality',
        'feature-hospitality-desc': 'Exceptional service, welcoming atmosphere',
        'feature-location': 'Prime Location',
        'feature-location-desc': 'Conveniently located in Abu Dhabi',
        'menu-title': 'Our Menu',
        'gallery-title': 'Gallery',
        'contact-title': 'Contact Us',
        'contact-address-title': 'Address',
        'contact-address': 'Electra Street - Main\nP.O. Box: 27034\nAbu Dhabi - UAE',
        'contact-phone-title': 'Phone',
        'contact-hours-title': 'Opening Hours',
        'contact-hours': 'Saturday - Thursday: 8:00 AM - 12:00 AM\nFriday: 12:00 PM - 12:00 AM',
        'contact-social-title': 'Follow Us',
        'contact-reservation-title': 'Reservations',
        'contact-reservation': 'Call us to reserve your table and experience\nthe finest Middle Eastern dining in Abu Dhabi.',
        'footer-text': '© 2024 Ritaj Restaurant. All rights reserved. | Premium Middle Eastern Dining in Abu Dhabi'
    },
    ar: {
        'hero-title': 'رتاج',
        'hero-subtitle': 'المطبخ الشرق أوسطي الأصيل',
        'hero-location': 'شارع الإلكترا، أبو ظبي، الإمارات',
        'btn-menu': 'عرض القائمة',
        'btn-contact': 'اتصل بنا',
        'about-title': 'عن رتاج',
        'about-text-1': 'مرحباً بكم في مطعم رتاج، حيث يلتقي التقليد بالتميز. يقع في قلب أبو ظبي، نقدم لكم أفضل المأكولات الشرق أوسطية المصنوعة بشغف وأصالة.',
        'about-text-2': 'يستخدم طهاتنا فقط أفضل المكونات الطازجة والوصفات التقليدية لإعداد أطباق تنقلك إلى التراث الطهوي الغني للشرق الأوسط. كل وجبة هي احتفال بالنكهة والثقافة والضيافة.',
        'about-text-3': 'سواء كنت تنضم إلينا لتجمع عائلي أو غداء عمل أو عشاء رومانسي، يقدم رتاج تجربة طعام لا تُنسى في جو أنيق.',
        'feature-quality': 'جودة ممتازة',
        'feature-quality-desc': 'مكونات طازجة، وصفات أصيلة',
        'feature-cuisine': 'مطبخ تقليدي',
        'feature-cuisine-desc': 'أطباق شرق أوسطية عريقة',
        'feature-hospitality': 'ضيافة دافئة',
        'feature-hospitality-desc': 'خدمة استثنائية، جو ترحيبي',
        'feature-location': 'موقع متميز',
        'feature-location-desc': 'موقع مناسب في أبو ظبي',
        'menu-title': 'قائمتنا',
        'gallery-title': 'المعرض',
        'contact-title': 'اتصل بنا',
        'contact-address-title': 'العنوان',
        'contact-address': 'شارع الإلكترا - الرئيسي\nص.ب: 27034\nأبو ظبي - الإمارات',
        'contact-phone-title': 'الهاتف',
        'contact-hours-title': 'ساعات العمل',
        'contact-hours': 'السبت - الخميس: 8:00 صباحاً - 12:00 منتصف الليل\nالجمعة: 12:00 ظهراً - 12:00 منتصف الليل',
        'contact-social-title': 'تابعنا',
        'contact-reservation-title': 'الحجوزات',
        'contact-reservation': 'اتصل بنا لحجز طاولتك وتجربة\nأفضل مطعم شرق أوسطي في أبو ظبي.',
        'footer-text': '© 2024 مطعم رتاج. جميع الحقوق محفوظة. | مطعم شرق أوسطي فاخر في أبو ظبي'
    },
    hi: {
        'hero-title': 'रिताज',
        'hero-subtitle': 'प्रामाणिक मध्य पूर्वी व्यंजन',
        'hero-location': 'इलेक्ट्रा स्ट्रीट, अबू धाबी, यूएई',
        'btn-menu': 'मेनू देखें',
        'btn-contact': 'संपर्क करें',
        'about-title': 'रिताज के बारे में',
        'about-text-1': 'रिताज रेस्तरां में आपका स्वागत है, जहां परंपरा उत्कृष्टता से मिलती है। अबू धाबी के दिल में स्थित, हम आपके लिए जुनून और प्रामाणिकता के साथ तैयार किए गए बेहतरीन मध्य पूर्वी व्यंजन लाते हैं।',
        'about-text-2': 'हमारे शेफ केवल सबसे ताज़ी सामग्री और पारंपरिक व्यंजनों का उपयोग करते हैं ताकि ऐसे व्यंजन बनाए जा सकें जो आपको मध्य पूर्व की समृद्ध पाक विरासत में ले जाएं। हर भोजन स्वाद, संस्कृति और आतिथ्य का उत्सव है।',
        'about-text-3': 'चाहे आप पारिवारिक समारोह, व्यावसायिक दोपहर के भोजन या रोमांटिक डिनर के लिए हमसे जुड़ रहे हों, रिताज एक सुरुचिपूर्ण माहौल में एक अविस्मरणीय भोजन अनुभव प्रदान करता है।',
        'feature-quality': 'प्रीमियम गुणवत्ता',
        'feature-quality-desc': 'ताज़ी सामग्री, प्रामाणिक व्यंजन',
        'feature-cuisine': 'पारंपरिक व्यंजन',
        'feature-cuisine-desc': 'समय-सम्मानित मध्य पूर्वी व्यंजन',
        'feature-hospitality': 'गर्मजोशी भरा आतिथ्य',
        'feature-hospitality-desc': 'असाधारण सेवा, स्वागत योग्य माहौल',
        'feature-location': 'प्रमुख स्थान',
        'feature-location-desc': 'अबू धाबी में सुविधाजनक स्थित',
        'menu-title': 'हमारा मेनू',
        'gallery-title': 'गैलरी',
        'contact-title': 'संपर्क करें',
        'contact-address-title': 'पता',
        'contact-address': 'इलेक्ट्रा स्ट्रीट - मुख्य\nपी.ओ. बॉक्स: 27034\nअबू धाबी - यूएई',
        'contact-phone-title': 'फोन',
        'contact-hours-title': 'खुलने का समय',
        'contact-hours': 'शनिवार - गुरुवार: सुबह 8:00 - रात 12:00\nशुक्रवार: दोपहर 12:00 - रात 12:00',
        'contact-social-title': 'हमें फॉलो करें',
        'contact-reservation-title': 'आरक्षण',
        'contact-reservation': 'अपनी टेबल बुक करने के लिए हमें कॉल करें और\nअबू धाबी में बेहतरीन मध्य पूर्वी भोजन का अनुभव करें।',
        'footer-text': '© 2024 रिताज रेस्तरां। सर्वाधिकार सुरक्षित। | अबू धाबी में प्रीमियम मध्य पूर्वी भोजन'
    }
};

// ===== GLOBAL VARIABLES =====
let currentLanguage = 'en';

// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelectorAll('nav a');
const langButtons = document.querySelectorAll('.lang-btn');
const menuTabs = document.querySelectorAll('.menu-tab');
const menuPages = document.querySelectorAll('.menu-page');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initNavigation();
    initLanguageSwitcher();
    initMenuTabs();
    initGallery();
});

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        // Header scroll effect
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// ===== LANGUAGE SWITCHER =====
function initLanguageSwitcher() {
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            switchLanguage(lang);

            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            const translation = translations[lang][key];

            // Handle line breaks
            if (element.tagName === 'P' && translation.includes('\n')) {
                element.innerHTML = translation.replace(/\n/g, '<br>');
            } else {
                element.textContent = translation;
            }
        }
    });

    // Update document direction for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

// ===== MENU TABS =====
function initMenuTabs() {
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const pageNumber = tab.getAttribute('data-page');

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding page
            menuPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `page-${pageNumber}`) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// ===== GALLERY & LIGHTBOX =====
function initGallery() {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageSrc = item.getAttribute('data-image');
            openLightbox(imageSrc);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== PDF EXTRACTION (Not needed - user provides menu images) =====
// Menu images should be placed in assets/menu/ as menu-1.png through menu-6.png

// ===== ANIMATIONS =====
// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .gallery-item, .contact-info').forEach(el => {
    observer.observe(el);
});
