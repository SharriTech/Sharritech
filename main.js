// =========================================
// SHARRITECH - CONVERSION BOOSTERS
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== LIVE SEARCH =====
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Fetch all products for search (you'll need to create this JSON file)
    let productsData = [];
    
    // For now, populate from existing HTML
    function loadProductsForSearch() {
        const productCards = document.querySelectorAll('.product');
        productCards.forEach(card => {
            const link = card.querySelector('a') || card;
            const img = card.querySelector('img');
            const title = card.querySelector('h3');
            const price = card.querySelector('.price');
            
            if (title && link.href) {
                productsData.push({
                    title: title.textContent,
                    price: price ? price.textContent : '',
                    image: img ? img.src : '',
                    url: link.href
                });
            }
        });
    }
    loadProductsForSearch();

    searchTrigger.addEventListener('click', () => {
        searchOverlay.style.display = 'flex';
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const filtered = productsData.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.price.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
        } else {
            searchResults.innerHTML = filtered.map(p => `
                <div class="search-result-item" onclick="window.location.href='${p.url}'">
                    <img src="${p.image}" alt="${p.title}">
                    <div>
                        <h4>${p.title}</h4>
                        <span>${p.price}</span>
                    </div>
                </div>
            `).join('');
        }
    });

    // ===== RECENTLY VIEWED PRODUCTS =====
    function trackRecentlyViewed() {
        const currentPath = window.location.pathname;
        let recent = JSON.parse(localStorage.getItem('recentProducts') || '[]');
        
        // Add current page if it's a product page
        if (currentPath.includes('.html') && !currentPath.includes('index')) {
            const title = document.querySelector('h2')?.textContent || 
                         document.querySelector('.product h3')?.textContent || '';
            const image = document.querySelector('.product-image img')?.src || 
                         document.querySelector('.product img')?.src || '';
            const price = document.querySelector('.price')?.textContent || '';
            
            if (title) {
                const product = { title, image, price, url: currentPath, time: Date.now() };
                recent = recent.filter(p => p.url !== currentPath);
                recent.unshift(product);
                recent = recent.slice(0, 5); // Keep last 5
                localStorage.setItem('recentProducts', JSON.stringify(recent));
            }
        }
        
        // Display recently viewed
        const recentContainer = document.getElementById('recentlyViewed');
        const recentProductsDiv = document.getElementById('recentProducts');
        
        if (recent.length > 0 && recentContainer) {
            recentProductsDiv.innerHTML = recent.map(p => `
                <div class="recent-product" onclick="window.location.href='${p.url}'">
                    <img src="${p.image}" alt="${p.title}">
                </div>
            `).join('');
            recentContainer.style.display = 'block';
        }
    }
    trackRecentlyViewed();

    // ===== EXIT INTENT POPUP =====
    let exitPopupShown = false;
    const exitPopup = document.getElementById('exitPopup');
    const closePopup = document.getElementById('closePopup');
    
    document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10 && !exitPopupShown && sessionStorage.getItem('exitPopupShown') !== 'true') {
            exitPopup.style.display = 'flex';
            exitPopupShown = true;
            sessionStorage.setItem('exitPopupShown', 'true');
        }
    });
    
    closePopup.addEventListener('click', () => {
        exitPopup.style.display = 'none';
    });

    // ===== QUICK VIEW MODAL =====
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    
    // Add quick view buttons to products
    document.querySelectorAll('.product').forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Shiko Shpejt';
        quickViewBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: var(--accent);
            color: #0b0f19;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 5;
        `;
        
        card.addEventListener('mouseenter', () => {
            quickViewBtn.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        card.addEventListener('mouseleave', () => {
            quickViewBtn.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        
        quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = card.querySelector('h3')?.textContent || '';
            const price = card.querySelector('.price')?.textContent || '';
            const image = card.querySelector('img')?.src || '';
            
            modalBody.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <img src="${image}" style="width: 100%; border-radius: 12px;">
                    <div>
                        <h2 style="color: var(--text-primary); margin-bottom: 15px;">${title}</h2>
                        <p style="color: var(--accent); font-size: 1.8em; font-weight: 700; margin-bottom: 20px;">${price}</p>
                        <button onclick="window.location.href='${card.href}'" style="
                            background: var(--accent);
                            color: #0b0f19;
                            border: none;
                            padding: 14px 32px;
                            border-radius: 8px;
                            font-weight: 700;
                            cursor: pointer;
                            margin-top: 20px;
                        ">Shiko Detajet e Plota</button>
                    </div>
                </div>
            `;
            quickViewModal.style.display = 'flex';
        });
        
        card.style.position = 'relative';
        card.appendChild(quickViewBtn);
    });
    
    closeModal.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });
    
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.style.display = 'none';
        }
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.textContent = navLinks.classList.contains('show') ? '✖' : '☰';
        });
    }

    // ===== ANALYTICS TRACKING (Optional) =====
    // Track product clicks
    document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', () => {
            console.log('Product clicked:', product.querySelector('h3')?.textContent);
            // Add your analytics code here (Google Analytics, Facebook Pixel, etc.)
        });
    });

});