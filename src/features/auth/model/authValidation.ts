const EMAIL_MAX_LENGTH = 254;
const NAME_MAX_LENGTH = 100;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 128;

export function validateEmail(email: string): string | null {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) return "Enter your email address.";
  if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
    return `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalizedEmail)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

export function validateRegistration(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  const normalizedName = name.trim();
  if (!normalizedName) return "Enter your name.";
  if (normalizedName.length > NAME_MAX_LENGTH) {
    return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }
  const containsControlCharacter = Array.from(normalizedName).some(
    (character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint < 32 || codePoint === 127;
    }
  );
  if (containsControlCharacter) {
    return "Name contains invalid characters.";
  }

  const emailError = validateEmail(email);
  if (emailError) return emailError;

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  if (password !== confirmPassword) return "Passwords do not match.";

  return null;
}

export function validateSignIn(email: string, password: string): string | null {
  const emailError = validateEmail(email);
  if (emailError) return emailError;
  return validatePassword(password);
}
