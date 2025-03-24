import { User } from "./components/types/user";

export async function getUserFromDb(email: string, pwHash: string): Promise<User | null> {
  if (email === "turksevenalperen0@gmail.com" && pwHash === "hashed-1234") {
    return {
      id: "1", 
      name: "Test User",
      email: "iotech@gmail.com",
    };
  }
  return null;
}
