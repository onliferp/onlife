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

// Creator Code Copy Function
function copyCreatorCode() {
    const code = 'onlife';
    const btn = document.getElementById('copyCodeBtn');
    const icon = document.getElementById('copyIcon');
    const text = document.getElementById('copyBtnText');
    
    navigator.clipboard.writeText(code).then(() => {
        // Success state
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        
        // Reset after 2.5 seconds
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    }).catch(() => {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    });
}

// Server Connect Command Copy Function
function copyConnectCommand() {
    const cmd = 'connect 176.96.138.99';
    const btn = document.getElementById('copyConnectBtn');
    const icon = document.getElementById('copyConnectIcon');
    const text = document.getElementById('copyConnectBtnText');
    
    if (!btn || !icon || !text) return;

    navigator.clipboard.writeText(cmd).then(() => {
        // Success state
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        
        // Reset after 2.5 seconds
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    }).catch(() => {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = cmd;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    });
}

// Info-Page Connect Copy (separate IDs)
function copyConnectCommandInfo() {
    const cmd = 'connect 176.96.138.99';
    const btn = document.getElementById('copyConnectBtnInfo');
    const icon = document.getElementById('copyConnectIconInfo');
    const text = document.getElementById('copyConnectBtnTextInfo');
    
    if (!btn || !icon || !text) return;

    navigator.clipboard.writeText(cmd).then(() => {
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    }).catch(() => {
        const el = document.createElement('textarea');
        el.value = cmd;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        btn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        text.textContent = 'Kopiert!';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-solid fa-copy';
            text.textContent = 'Kopieren';
        }, 2500);
    });
}

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

// Live Visitor Counter Logic
document.addEventListener('DOMContentLoaded', () => {
    const visitorCountVal = document.getElementById('visitorCountVal');
    if (visitorCountVal) {
        // API URL to increment and get count (using counterapi.dev v1)
        const counterUrl = 'https://api.counterapi.dev/v1/onliferp/visits/up';
        
        fetch(counterUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && typeof data.count !== 'undefined') {
                    // Format count with dots for thousands, e.g., 1.234
                    const formattedCount = Number(data.count).toLocaleString('de-DE');
                    visitorCountVal.textContent = formattedCount;
                } else {
                    visitorCountVal.textContent = 'Aktiv';
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                // Fallback to "Aktiv" or simple placeholder if API is offline
                visitorCountVal.textContent = 'Aktiv';
            });
    }
});

/* ==========================================================================
   TASTENBELEGUNG — Interactive Keyboard Tooltip & Filter Logic
   ========================================================================== */

(function initKeyboard() {
    document.addEventListener('DOMContentLoaded', () => {

        const tooltip    = document.getElementById('kbTooltip');
        const tipKey     = document.getElementById('kbTooltipKey');
        const tipAction  = document.getElementById('kbTooltipAction');
        const tipCat     = document.getElementById('kbTooltipCat');
        const tipIcon    = document.getElementById('kbTooltipIcon');

        if (!tooltip) return;

        const catLabels = {
            system:        'System',
            interaktion:   'Interaktion',
            bewegung:      'Bewegung',
            fahrzeug:      'Fahrzeug',
            kommunikation: 'Kommunikation',
            housing:       'Housing / Immobilien',
        };

        // Attach hover events to all keys with an action
        document.querySelectorAll('.kb-key.kb-bound').forEach(key => {
            key.addEventListener('mouseenter', (e) => {
                const action = key.dataset.action;
                const cat    = key.dataset.cat;
                const icon   = key.dataset.icon || 'fa-keyboard';
                const label  = key.dataset.key;

                if (!action) return;

                tipKey.textContent    = label;
                tipAction.textContent = action;
                tipIcon.className     = `fa-solid ${icon}`;

                tipCat.textContent  = catLabels[cat] || cat;
                tipCat.className    = `kbt-cat ${cat}`;

                positionTooltip(e);
                tooltip.classList.add('show');
            });

            key.addEventListener('mousemove', positionTooltip);

            key.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });

        function positionTooltip(e) {
            const offset = 18;
            let x = e.clientX + offset;
            let y = e.clientY + offset;

            // Keep tooltip inside viewport
            const tw = tooltip.offsetWidth  || 220;
            const th = tooltip.offsetHeight || 80;
            if (x + tw > window.innerWidth)  x = e.clientX - tw - offset;
            if (y + th > window.innerHeight) y = e.clientY - th - offset;

            tooltip.style.left = x + 'px';
            tooltip.style.top  = y + 'px';
        }
    });
})();

// Category filter for keyboard keys
function filterKeys(cat) {
    // Update active filter button
    document.querySelectorAll('.kb-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('kf-' + cat);
    if (activeBtn) activeBtn.classList.add('active');

    // Apply dimming to keys
    document.querySelectorAll('.kb-key').forEach(key => {
        if (cat === 'all') {
            key.classList.remove('kb-dimmed');
        } else {
            const keyCat = key.dataset.cat;
            if (keyCat === cat) {
                key.classList.remove('kb-dimmed');
            } else if (key.classList.contains('kb-bound')) {
                key.classList.add('kb-dimmed');
            } else {
                // unbound keys: always slightly dimmed, but more so on filter
                key.classList.add('kb-dimmed');
            }
        }
    });
}

// Theme Toggle Logic (Light / Dark Mode)
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;
    
    const isLight = body.classList.toggle('light-mode');
    
    // Save state in localStorage
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update button icon
    updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;
    
    if (isLight) {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeBtn.setAttribute('title', 'Dunklen Modus aktivieren');
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeBtn.setAttribute('title', 'Hellen Modus aktivieren');
    }
}

// Initial Theme Check on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Dark mode is default
    const body = document.body;
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('light-mode');
        updateThemeIcon(false);
    }
});
