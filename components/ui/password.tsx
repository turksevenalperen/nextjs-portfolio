export function saltAndHashPassword(password: string): string {
    return `hashed-${password}`;
  }
  