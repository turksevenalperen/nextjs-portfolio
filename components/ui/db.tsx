import { User } from "../types/user";

export async function getUserFromDb(email: string, pwHash: string): Promise<User | null> {
  // Örnek: Eğer email ve hash belirli ise kullanıcıyı döndür
  if (email === "turksevenalperen0@gmail.com" && pwHash === "hashed-1234") {
    return {
      id: "1", 
      name: "Test User",
      email: "iotech@gmail.com",
    };
  }
  return null;
}
