// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuContent = document.getElementById('mobile-menu-content');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuContent) return;
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenuContent.classList.remove('translate-x-full');
    }, 10);
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuContent) return;
    mobileMenuContent.classList.add('translate-x-full');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
}

// Add event listeners only if elements exist
if (mobileMenuButton) mobileMenuButton.addEventListener('click', openMobileMenu);
if (closeMobileMenuButton) closeMobileMenuButton.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Mobile submenu toggle
function toggleMobileSubmenu(button) {
    if (!button) return;
    const submenu = button.nextElementSibling;
    const arrow = button.querySelector('svg');
    
    if (!submenu || !arrow) return;
    
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Desktop menu hover functionality
const desktopMenuItems = document.querySelectorAll('.menu-wrapper li.group');

desktopMenuItems.forEach(menuItem => {
    if (!menuItem) return;
    const submenu = menuItem.querySelector('div[class*="absolute"]');
    const arrow = menuItem.querySelector('svg');

    if (!submenu || !arrow) return;

    menuItem.addEventListener('mouseenter', () => {
        submenu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    });

    menuItem.addEventListener('mouseleave', () => {
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    });
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrapper')) {
        const submenus = document.querySelectorAll('.menu-wrapper div[class*="absolute"]');
        const arrows = document.querySelectorAll('.menu-wrapper svg');
        
        submenus.forEach(submenu => submenu.classList.add('hidden'));
        arrows.forEach(arrow => arrow.style.transform = 'rotate(0deg)');
    }
});

// Desktop menu functionality
const desktopMenuButtons = document.querySelectorAll('.menu-wrapper button');
let activeMenu = null;

function closeAllMenus() {
    desktopMenuButtons.forEach(button => {
        const submenu = button.nextElementSibling;
        const arrow = button.querySelector('svg');
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    });
    activeMenu = null;
}

desktopMenuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const submenu = button.nextElementSibling;
        const arrow = button.querySelector('svg');

        if (activeMenu === submenu) {
            // Close current menu
            submenu.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            activeMenu = null;
        } else {
            // Close other menus
            closeAllMenus();
            // Open clicked menu
            submenu.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            activeMenu = submenu;
        }
        e.stopPropagation();
    });
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrapper')) {
        closeAllMenus();
    }
});

