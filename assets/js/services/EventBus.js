// ========================================
// Event Bus - Central Event Management
// ========================================

(function() {
    'use strict';
    
    class EventBus {
        constructor() {
            this.events = {};
            this.maxListeners = 100;
            console.log('🚌 EventBus initialized');
        }
        
        // Subscribe to an event
        on(event, callback) {
            if (typeof event !== 'string') {
                console.error('EventBus.on: event must be a string');
                return;
            }
            
            if (typeof callback !== 'function') {
                console.error('EventBus.on: callback must be a function');
                return;
            }
            
            if (!this.events[event]) {
                this.events[event] = [];
            }
            
            if (this.events[event].length >= this.maxListeners) {
                console.warn(`EventBus: Maximum listeners (${this.maxListeners}) reached for event: ${event}`);
                return;
            }
            
            this.events[event].push(callback);
            
            // Return unsubscribe function
            return () => this.off(event, callback);
        }
        
        // Subscribe to an event once
        once(event, callback) {
            const onceWrapper = (...args) => {
                this.off(event, onceWrapper);
                callback(...args);
            };
            
            return this.on(event, onceWrapper);
        }
        
        // Unsubscribe from an event
        off(event, callback) {
            if (!this.events[event]) return;
            
            this.events[event] = this.events[event].filter(cb => cb !== callback);
            
            // Clean up empty event arrays
            if (this.events[event].length === 0) {
                delete this.events[event];
            }
        }
        
        // Emit an event
        emit(event, ...args) {
            if (typeof event !== 'string') {
                console.error('EventBus.emit: event must be a string');
                return false;
            }
            
            if (!this.events[event]) {
                // Event has no listeners, that's okay
                return true;
            }
            
            // Clone the array to prevent issues if listeners are modified during execution
            const listeners = [...this.events[event]];
            
            listeners.forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`EventBus: Error in listener for event "${event}":`, error);
                }
            });
            
            return true;
        }
        
        // Remove all listeners for an event
        removeAllListeners(event) {
            if (event) {
                delete this.events[event];
            } else {
                this.events = {};
            }
        }
        
        // Get listener count for an event
        listenerCount(event) {
            return this.events[event] ? this.events[event].length : 0;
        }
        
        // Get all event names
        eventNames() {
            return Object.keys(this.events);
        }
        
        // Debug information
        getDebugInfo() {
            const info = {};
            Object.keys(this.events).forEach(event => {
                info[event] = this.events[event].length;
            });
            return info;
        }
        
        // Test the EventBus
        test() {
            console.log('🧪 Testing EventBus...');
            
            let testPassed = false;
            
            // Test basic emit/on
            this.on('test-event', (data) => {
                if (data === 'test-data') {
                    testPassed = true;
                    console.log('✅ EventBus test passed');
                } else {
                    console.error('❌ EventBus test failed - wrong data received');
                }
            });
            
            this.emit('test-event', 'test-data');
            
            if (!testPassed) {
                console.error('❌ EventBus test failed - event not received');
            }
            
            return testPassed;
        }
    }
    
    // Create and expose global instance
    try {
        const eventBusInstance = new EventBus();
        
        // Verify the instance was created correctly
        if (typeof eventBusInstance.emit !== 'function') {
            throw new Error('EventBus instance is invalid');
        }
        
        window.EventBus = eventBusInstance;
        
        console.log('✅ EventBus created and attached to window');
        console.log('🔍 EventBus methods:', Object.getOwnPropertyNames(EventBus.prototype));
        
        // Test the EventBus immediately
        eventBusInstance.test();
        
    } catch (error) {
        console.error('❌ Failed to create EventBus:', error);
        
        // Create a fallback EventBus
        window.EventBus = {
            events: {},
            on: function(event, callback) {
                if (!this.events[event]) this.events[event] = [];
                this.events[event].push(callback);
            },
            off: function(event, callback) {
                if (this.events[event]) {
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
            },
            emit: function(event, ...args) {
                if (this.events[event]) {
                    this.events[event].forEach(callback => {
                        try {
                            callback(...args);
                        } catch (err) {
                            console.error('EventBus fallback error:', err);
                        }
                    });
                }
                return true;
            },
            removeAllListeners: function(event) {
                if (event) {
                    delete this.events[event];
                } else {
                    this.events = {};
                }
            },
            listenerCount: function(event) {
                return this.events[event] ? this.events[event].length : 0;
            },
            eventNames: function() {
                return Object.keys(this.events);
            },
            getDebugInfo: function() {
                const info = {};
                Object.keys(this.events).forEach(event => {
                    info[event] = this.events[event].length;
                });
                return info;
            }
        };
        
        console.log('⚠️ Using fallback EventBus');
    }
    
})();

// Log events in development
if (typeof window !== 'undefined' && window.EventBus) {
    // Wait a bit to ensure AppConfig is loaded
    setTimeout(() => {
        if (window.AppConfig && window.AppConfig.isDevelopment) {
            const originalEmit = window.EventBus.emit;
            window.EventBus.emit = function(event, ...args) {
                console.log(`🚀 Event: ${event}`, args.length > 0 ? args : '(no data)');
                return originalEmit.call(this, event, ...args);
            };
            console.log('🔍 EventBus logging enabled for development');
        }
    }, 100);
}
