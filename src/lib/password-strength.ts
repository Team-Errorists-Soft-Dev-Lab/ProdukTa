interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface PasswordStrengthRule {
  isValid: boolean;
  message: string;
  test: (password: string) => boolean;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, message: "", color: "" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let message = "";
  let color = "";

  switch (score) {
    case 0:
    case 1:
      message = "Weak";
      color = "bg-red-500";
      break;
    case 2:
      message = "Fair";
      color = "bg-yellow-500";
      break;
    case 3:
      message = "Good";
      color = "bg-blue-500";
      break;
    case 4:
      message = "Strong";
      color = "bg-green-500";
      break;
  }

  return { score, message, color };
}

export function getPasswordStrengthRules(
  password: string,
): PasswordStrengthRule[] {
  return [
    {
      isValid: password.length >= 8,
      message: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      isValid: /[A-Z]/.test(password),
      message: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      isValid: /[0-9]/.test(password),
      message: "Contains number",
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      isValid: /[^A-Za-z0-9]/.test(password),
      message: "Contains special character",
      test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
  ];
}

export function checkPasswords(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return null;
}
