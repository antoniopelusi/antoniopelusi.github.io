// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(phrases, options = {}) {
        this.phrases = phrases || [];
        this.options = {
            typingSpeed: 100,
            deletingSpeed: 50,
            pauseAfterTyping: 2000,
            pauseAfterDeleting: 500,
            initialDelay: 1000,
            ...options,
        };

        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.textElement = document.querySelector(
            "header p span:not([data-cursor])",
        );
        this.cursorElement = document.querySelector(
            "header p span[data-cursor]",
        );

        this.init();
    }

    init() {
        if (
            !this.textElement ||
            !this.cursorElement ||
            this.phrases.length === 0
        )
            return;

        this.cursorElement.style.display = "inline";
        setTimeout(() => this.type(), this.options.initialDelay);
    }

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];

        if (this.isDeleting) {
            this.charIndex--;
            if (this.charIndex < 0) {
                this.nextPhrase();
                return;
            }
        } else {
            this.charIndex++;
            if (this.charIndex > currentPhrase.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseAfterTyping);
                return;
            }
        }

        this.textElement.textContent = currentPhrase.substring(
            0,
            this.charIndex,
        );

        const delay = this.isDeleting
            ? this.options.deletingSpeed
            : this.options.typingSpeed;
        setTimeout(() => this.type(), delay);
    }

    nextPhrase() {
        this.charIndex = 0;
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        setTimeout(() => this.type(), this.options.pauseAfterDeleting);
    }
}

// ===== NAVIGATION HIGHLIGHTER =====
class NavigationHighlighter {
    constructor() {
        this.sections = this.mapSections();
        this.threshold = window.innerHeight * 0.3;

        this.init();
    }

    init() {
        if (this.sections.length === 0) return;

        let lastExecTime = 0;
        window.addEventListener(
            "scroll",
            () => {
                const now = Date.now();
                if (now - lastExecTime > 100) {
                    this.updateActiveSection();
                    lastExecTime = now;
                }
            },
            { passive: true },
        );

        this.updateActiveSection();
    }

    mapSections() {
        const sections = [];

        document.querySelectorAll("aside nav a").forEach((link) => {
            const href = link.getAttribute("href");
            let element = null;
            let isSummary = false;

            if (href === "#") {
                element = document.body;
                isSummary = true;
            } else if (href?.startsWith("#")) {
                element = document.getElementById(href.substring(1));
            }

            if (element) sections.push({ link, element, isSummary });
        });

        return sections;
    }

    updateActiveSection() {
        const scrollTop = window.pageYOffset;
        let activeSection = null;

        if (scrollTop < this.threshold) {
            activeSection = this.sections.find((s) => s.isSummary);
        } else {
            for (let i = this.sections.length - 1; i >= 0; i--) {
                const section = this.sections[i];
                if (!section.isSummary) {
                    const rect = section.element.getBoundingClientRect();
                    if (rect.top <= this.threshold) {
                        activeSection = section;
                        break;
                    }
                }
            }
        }

        this.sections.forEach((section) => {
            if (section === activeSection) {
                section.link.setAttribute("data-active", "true");
            } else {
                section.link.removeAttribute("data-active");
            }
        });
    }
}

// ===== BOOTSTRAP =====
document.addEventListener("DOMContentLoaded", async () => {
    const summaryLink = document.querySelector('aside nav a[href="#"]');
    if (summaryLink) {
        summaryLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.replaceState(
                null,
                null,
                window.location.origin + window.location.pathname,
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    try {
        const response = await fetch("./assets/config.json");
        if (response.ok) {
            const config = await response.json();
            if (config?.typing?.phrases && config?.typing?.options) {
                new TypingAnimation(
                    config.typing.phrases,
                    config.typing.options,
                );
            }
        }
    } catch (error) {
        console.warn("Could not load config.json:", error.message);
    }

    new NavigationHighlighter();
});
