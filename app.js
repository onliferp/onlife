/* ==========================================================================
   OnLifeRP JavaScript — SPA Page Routing, Search Filters & UI Interactivity
   ========================================================================== */

// Page Switcher (Single Page Application Router)
function switchPage(pageId) {
    // 1. Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. Show targeted page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Scroll to top of window smoothly on page switch
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Update desktop navigation active state
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === 'btn-' + pageId) {
            btn.classList.add('active');
        }
    });

    // 4. Update mobile navigation active state
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
    mobileNavButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === 'm-btn-' + pageId) {
            btn.classList.add('active');
        }
    });
}

// Mobile Menu toggler
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Accordion Collapse/Expand Logic for Rules
function toggleAccordion(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const isOpen = item.classList.contains('open');
    
    // Close other accordion items if desired (exclusive accordion behavior)
    /*
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(i => {
        i.classList.remove('open');
    });
    */

    if (isOpen) {
        item.classList.remove('open');
    } else {
        item.classList.add('open');
    }
}

// Law Tab Switcher
function switchLawTab(tabId) {
    // Hide all panels
    const panels = document.querySelectorAll('.law-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Show selected panel
    const targetPanel = document.getElementById('panel-' + tabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // Update active button state
    const buttons = document.querySelectorAll('.law-tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
}

// Clear Search Inputs
function clearSearch(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        if (inputId === 'rulesSearch') {
            filterRules();
        } else if (inputId === 'lawsSearch') {
            filterLaws();
        }
    }
}

// Live Search Filter for Serverregeln (Rules)
function filterRules() {
    const searchInput = document.getElementById('rulesSearch');
    const query = searchInput.value.toLowerCase().trim();
    const clearBtn = document.getElementById('clearRulesSearch');
    const accordionItems = document.querySelectorAll('.accordion-item');

    // Toggle clear search button
    if (query.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }

    accordionItems.forEach(item => {
        const rules = item.querySelectorAll('.accordion-content li');
        const headings = item.querySelectorAll('.accordion-content h3');
        let hasVisibleContent = false;

        // Search within lists
        rules.forEach(rule => {
            const text = rule.textContent.toLowerCase();
            if (text.includes(query)) {
                rule.style.display = 'list-item';
                hasVisibleContent = true;
                
                // Highlight matches with style
                if (query.length > 2) {
                    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                    rule.innerHTML = rule.textContent.replace(regex, `<mark class="search-highlight">$1</mark>`);
                } else {
                    rule.innerHTML = rule.textContent;
                }
            } else {
                rule.style.display = 'none';
                rule.innerHTML = rule.textContent; // reset highlights
            }
        });

        // Hide or show category titles based on list matches
        headings.forEach(h3 => {
            if (query.length > 0) {
                // If query active, only show titles if rules are matched
                h3.style.display = 'block';
            } else {
                h3.style.display = 'block';
            }
        });

        // If search matches, auto-open accordion, otherwise keep normal state
        if (query.length > 0 && hasVisibleContent) {
            item.classList.add('open');
            item.style.display = 'block';
        } else if (query.length > 0 && !hasVisibleContent) {
            item.classList.remove('open');
            item.style.display = 'none'; // hide entire accordion item if nothing matches
        } else {
            // Reset to default collapsed state
            item.classList.remove('open');
            item.style.display = 'block';
            
            // Open first item by default if empty search
            if (item.id === 'rule-cat-allgemein') {
                item.classList.add('open');
            }
        }
    });
}

// Live Search Filter for Gesetze (Laws)
function filterLaws() {
    const searchInput = document.getElementById('lawsSearch');
    const query = searchInput.value.toLowerCase().trim();
    const clearBtn = document.getElementById('clearLawsSearch');
    const ggCards = document.querySelectorAll('.law-card-item');
    const stgbCards = document.querySelectorAll('.law-list-card');
    
    // Toggle clear search button
    if (query.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }

    // Filter Grundrechte
    ggCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Filter StGB / WaffenG / BtMG
    stgbCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Auto-switch tabs if search query is active and matches in other sections
    if (query.length > 2) {
        // Simple heuristic: if active tab has no matches, but another has matches, switch to it
        const tabs = ['law-gg', 'law-stgb', 'law-waffg', 'law-btmg'];
        let activeTabHasMatches = false;
        
        // Check if current active tab has visible matches
        const activePanel = document.querySelector('.law-panel.active');
        if (activePanel) {
            const visibleItems = activePanel.querySelectorAll('.law-card-item[style="display: block;"], .law-list-card[style="display: block;"]');
            const totalItems = activePanel.querySelectorAll('.law-card-item, .law-list-card');
            
            // If total items matches count of visible items (or some are block)
            if (visibleItems.length > 0) {
                activeTabHasMatches = true;
            }
        }

        // If active tab is empty of matches, search other tabs to switch
        if (!activeTabHasMatches) {
            for (let tab of tabs) {
                const panel = document.getElementById('panel-' + tab);
                if (panel) {
                    const matches = Array.from(panel.querySelectorAll('.law-card-item, .law-list-card'))
                                         .filter(card => card.textContent.toLowerCase().includes(query));
                    if (matches.length > 0) {
                        switchLawTab(tab);
                        break;
                    }
                }
            }
        }
    }
}

// Helper to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Initialization on load
document.addEventListener('DOMContentLoaded', () => {
    // Set default route
    switchPage('home');
    
    // Auto-open first rule category on load
    const firstRuleCat = document.getElementById('rule-cat-allgemein');
    if (firstRuleCat) {
        firstRuleCat.classList.add('open');
    }
});

// Gallery Lightbox Modal Logic
function openLightbox(imageSrc, captionText) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    if (modal && img) {
        img.src = imageSrc;
        if (caption && captionText) {
            caption.textContent = captionText;
            caption.style.display = 'inline-block';
        } else if (caption) {
            caption.style.display = 'none';
        }
        
        modal.classList.add('show');
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Toggle Changelog Accordion Card
function toggleChangelog(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    // Toggle active state
    card.classList.toggle('open');
}

// Background Music Playback Logic
function toggleMusic() {
    const audio = document.getElementById('bg-audio');
    const visualizer = document.getElementById('musicVisualizer');
    const statusText = document.getElementById('musicStatus');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (!audio) return;
    
    if (audio.paused) {
        // Play audio
        audio.play().then(() => {
            visualizer.classList.add('animating');
            statusText.textContent = 'Aktiv';
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }).catch(err => {
            console.log('Autoplay was blocked or audio failed to load: ', err);
        });
    } else {
        // Pause audio
        audio.pause();
        visualizer.classList.remove('animating');
        statusText.textContent = 'Aus';
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

// Set pleasant background music volume on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    if (audio) {
        audio.volume = 0.25; // Quiet, perfect ambient background level
    }
});
