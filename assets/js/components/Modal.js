 // ========================================
// Modal Component - Reusable Modal System
// ========================================

class Modal {
    constructor(id, options = {}) {
        this.id = id;
        this.options = {
            size: 'medium', // small, medium, large
            backdrop: true,
            keyboard: true,
            ...options
        };
        this.element = null;
        this.isVisible = false;
        this.onClose = null;
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.attachEventListeners();
    }
    
    createElement() {
        // Create modal container
        this.element = Utils.createElement('div', 'modal');
        this.element.id = this.id;
        this.element.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container modal-${this.options.size}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title"></h3>
                        <button class="modal-close" type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        `;
        
        // Add to modals container
        const modalsContainer = Utils.querySelector('#app-modals');
        if (modalsContainer) {
            modalsContainer.appendChild(this.element);
        } else {
            document.body.appendChild(this.element);
        }
    }
    
    attachEventListeners() {
        // Close button
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Backdrop click
        if (this.options.backdrop) {
            const backdrop = this.element.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.hide());
            }
        }
        
        // Keyboard events
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
        }
    }
    
    setTitle(title) {
        const titleElement = this.element.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
        return this;
    }
    
    setBody(content) {
        const bodyElement = this.element.querySelector('.modal-body');
        if (bodyElement) {
            if (typeof content === 'string') {
                bodyElement.innerHTML = content;
            } else {
                bodyElement.innerHTML = '';
                bodyElement.appendChild(content);
            }
        }
        return this;
    }
    
    setFooter(content) {
        const footerElement = this.element.querySelector('.modal-footer');
        if (footerElement) {
            if (typeof content === 'string') {
                footerElement.innerHTML = content;
            } else {
                footerElement.innerHTML = '';
                footerElement.appendChild(content);
            }
        }
        return this;
    }
    
    show() {
        this.isVisible = true;
        this.element.classList.add('visible');
        document.body.classList.add('modal-open');
        
        // Focus management
        setTimeout(() => {
            const firstInput = this.element.querySelector('input, textarea, select, button');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        EventBus.emit('modal:shown', { id: this.id });
        return this;
    }
    
    hide() {
        this.isVisible = false;
        this.element.classList.remove('visible');
        document.body.classList.remove('modal-open');
        
        if (this.onClose) {
            this.onClose();
        }
        
        EventBus.emit('modal:hidden', { id: this.id });
        return this;
    }
    
    onHide(callback) {
        this.onClose = callback;
        return this;
    }
    
    destroy() {
        if (this.element) {
            this.element.remove();
        }
        document.body.classList.remove('modal-open');
    }
}

// Export for global use
window.Modal = Modal;
