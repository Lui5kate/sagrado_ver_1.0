// Payment System for Sagrado Cantina
// This file handles payment processing and integration with payment gateways

class PaymentSystem {
    constructor() {
        this.paymentMethods = {
            stripe: {
                name: 'Stripe',
                icon: 'fab fa-cc-stripe',
                description: 'Credit/Debit Cards',
                supported: ['visa', 'mastercard', 'amex', 'discover']
            },
            paypal: {
                name: 'PayPal',
                icon: 'fab fa-paypal',
                description: 'PayPal Account',
                supported: ['paypal']
            },
            square: {
                name: 'Square',
                icon: 'fas fa-square',
                description: 'Credit/Debit Cards',
                supported: ['visa', 'mastercard', 'amex', 'discover']
            },
            afterpay: {
                name: 'Afterpay',
                icon: 'fas fa-credit-card',
                description: 'Buy Now, Pay Later',
                supported: ['afterpay']
            }
        };
        
        this.init();
    }

    init() {
        this.setupPaymentForms();
        this.setupPaymentMethodSelection();
        this.setupValidation();
        this.loadPaymentScripts();
    }

    setupPaymentForms() {
        const paymentForms = document.querySelectorAll('.payment-form');
        paymentForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handlePaymentSubmission(e));
        });
    }

    setupPaymentMethodSelection() {
        const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handlePaymentMethodChange(e));
        });
    }

    setupValidation() {
        // Credit card validation
        const cardInputs = document.querySelectorAll('.card-number, .card-cvc, .card-expiry');
        cardInputs.forEach(input => {
            input.addEventListener('input', (e) => this.validateCardField(e.target));
            input.addEventListener('blur', (e) => this.validateCardField(e.target));
        });
    }

    loadPaymentScripts() {
        // Load Stripe.js
        if (typeof Stripe === 'undefined') {
            const stripeScript = document.createElement('script');
            stripeScript.src = 'https://js.stripe.com/v3/';
            stripeScript.onload = () => this.initializeStripe();
            document.head.appendChild(stripeScript);
        } else {
            this.initializeStripe();
        }

        // Load PayPal SDK
        if (typeof paypal === 'undefined') {
            const paypalScript = document.createElement('script');
            paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=NZD';
            paypalScript.onload = () => this.initializePayPal();
            document.head.appendChild(paypalScript);
        } else {
            this.initializePayPal();
        }
    }

    initializeStripe() {
        // Initialize Stripe with your publishable key
        this.stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
        
        // Create card element
        const cardElement = document.querySelector('#card-element');
        if (cardElement) {
            this.cardElement = this.stripe.elements().create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            });
            this.cardElement.mount('#card-element');
        }
    }

    initializePayPal() {
        // Initialize PayPal buttons
        const paypalButtons = document.querySelectorAll('.paypal-button');
        paypalButtons.forEach(button => {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: this.getOrderTotal()
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        this.handlePayPalSuccess(details);
                    });
                }
            }).render(button);
        });
    }

    handlePaymentMethodChange(event) {
        const selectedMethod = event.target.value;
        const paymentForms = document.querySelectorAll('.payment-form-section');
        
        // Hide all payment forms
        paymentForms.forEach(form => {
            form.style.display = 'none';
        });
        
        // Show selected payment form
        const selectedForm = document.querySelector(`.payment-form-${selectedMethod}`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
        
        // Update payment method display
        this.updatePaymentMethodDisplay(selectedMethod);
    }

    updatePaymentMethodDisplay(method) {
        const methodInfo = this.paymentMethods[method];
        if (methodInfo) {
            const displayElement = document.querySelector('.payment-method-display');
            if (displayElement) {
                displayElement.innerHTML = `
                    <i class="${methodInfo.icon}"></i>
                    <span>${methodInfo.name}</span>
                    <small>${methodInfo.description}</small>
                `;
            }
        }
    }

    validateCardField(field) {
        const value = field.value;
        let isValid = true;
        let message = '';

        switch (field.className) {
            case 'card-number':
                isValid = this.validateCardNumber(value);
                message = isValid ? '' : 'Please enter a valid card number';
                break;
            case 'card-cvc':
                isValid = this.validateCVC(value);
                message = isValid ? '' : 'Please enter a valid CVC';
                break;
            case 'card-expiry':
                isValid = this.validateExpiry(value);
                message = isValid ? '' : 'Please enter a valid expiry date';
                break;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    validateCardNumber(number) {
        // Remove spaces and dashes
        number = number.replace(/\s+/g, '').replace(/-/g, '');
        
        // Check if it's a valid length
        if (number.length < 13 || number.length > 19) {
            return false;
        }
        
        // Luhn algorithm for card validation
        let sum = 0;
        let isEven = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    validateCVC(cvc) {
        return /^\d{3,4}$/.test(cvc);
    }

    validateExpiry(expiry) {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }
        
        return expMonth >= 1 && expMonth <= 12;
    }

    showFieldValidation(field, isValid, message) {
        const feedbackElement = field.parentNode.querySelector('.invalid-feedback');
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (feedbackElement) {
                feedbackElement.style.display = 'none';
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (feedbackElement) {
                feedbackElement.textContent = message;
                feedbackElement.style.display = 'block';
            }
        }
    }

    async handlePaymentSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const paymentMethod = form.querySelector('input[name="payment_method"]:checked')?.value;
        
        if (!paymentMethod) {
            this.showNotification('Please select a payment method', 'error');
            return;
        }
        
        // Show loading state
        this.showLoadingState(form);
        
        try {
            switch (paymentMethod) {
                case 'stripe':
                    await this.processStripePayment(form);
                    break;
                case 'paypal':
                    // PayPal is handled by the SDK
                    break;
                case 'square':
                    await this.processSquarePayment(form);
                    break;
                case 'afterpay':
                    await this.processAfterpayPayment(form);
                    break;
                default:
                    throw new Error('Unsupported payment method');
            }
        } catch (error) {
            this.handlePaymentError(error);
        } finally {
            this.hideLoadingState(form);
        }
    }

    async processStripePayment(form) {
        if (!this.stripe) {
            throw new Error('Stripe not initialized');
        }
        
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
            type: 'card',
            card: this.cardElement,
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Send payment method to your server
        const response = await fetch('/api/process-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken(),
            },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                amount: this.getOrderTotal(),
                currency: 'nzd',
                payment_method: 'stripe'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.handlePaymentSuccess(result);
        } else {
            throw new Error(result.error || 'Payment failed');
        }
    }

    async processSquarePayment(form) {
        // Square payment processing
        const formData = new FormData(form);
        const response = await fetch('/api/square-payment/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': this.getCSRFToken(),
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.handlePaymentSuccess(result);
        } else {
            throw new Error(result.error || 'Square payment failed');
        }
    }

    async processAfterpayPayment(form) {
        // Afterpay payment processing
        const response = await fetch('/api/afterpay-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken(),
            },
            body: JSON.stringify({
                amount: this.getOrderTotal(),
                currency: 'nzd',
                payment_method: 'afterpay'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.handlePaymentSuccess(result);
        } else {
            throw new Error(result.error || 'Afterpay payment failed');
        }
    }

    handlePayPalSuccess(details) {
        this.handlePaymentSuccess({
            success: true,
            transaction_id: details.id,
            payment_method: 'paypal',
            amount: details.purchase_units[0].amount.value
        });
    }

    handlePaymentSuccess(result) {
        this.showNotification('Payment successful! Your order has been confirmed.', 'success');
        
        // Redirect to order confirmation page
        setTimeout(() => {
            window.location.href = `/order-confirmation/${result.transaction_id}/`;
        }, 2000);
    }

    handlePaymentError(error) {
        console.error('Payment error:', error);
        this.showNotification(error.message || 'Payment failed. Please try again.', 'error');
    }

    showLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    }

    hideLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Complete Payment';
        }
    }

    getOrderTotal() {
        const totalElement = document.querySelector('.order-total');
        if (totalElement) {
            return parseFloat(totalElement.dataset.total || '0');
        }
        return 0;
    }

    getCSRFToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }

    showNotification(message, type = 'info') {
        // Use the notification system from main.js
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.paymentSystem = new PaymentSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentSystem;
} 