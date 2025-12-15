// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (10 digits)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (score >= 3) return 'strong';
    return 'medium';
};

// Name validation
export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};

// Date validation (not in past)
export const isValidFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
};

// Medical license validation (simple format check)
export const isValidLicense = (license: string): boolean => {
    // Format: LIC-XXXXXX (can be customized)
    const licenseRegex = /^[A-Z]{3}-\d{6}$/;
    return licenseRegex.test(license.toUpperCase());
};

// Fees validation (must be positive number)
export const isValidFees = (fees: string): boolean => {
    const num = parseFloat(fees);
    return !isNaN(num) && num > 0;
};
