/**
 * Form Validation Utilities
 */

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true };
}

export function validateDisplayName(displayName: string): { valid: boolean; error?: string } {
  if (!displayName.trim()) {
    return { valid: false, error: 'Name is required' };
  }

  if (displayName.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (displayName.trim().length > 50) {
    return { valid: false, error: 'Name must be less than 50 characters' };
  }

  return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username.trim()) {
    return { valid: false, error: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }

  // Only alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  // Cannot start or end with underscore
  if (trimmed.startsWith('_') || trimmed.endsWith('_')) {
    return { valid: false, error: 'Username cannot start or end with underscore' };
  }

  return { valid: true };
}
