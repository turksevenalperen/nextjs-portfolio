import { User } from "./components/types/user";

export async function getUserFromDb(email: string, pwHash: string): Promise<User | null> {
  if (email === "turksevenalperen0@gmail.com" && pwHash === "123456") {
    return {
      id: "1",
      name: "Test User",
      email: "iotech@gmail.com",
      role: "user"
    };
  } else if (email === "admin@gmail.com" && pwHash === "admin") {
    return {
      id: "1",
      name: "Test User",
      email: "iotech@gmail.com",
      role: "admin"
    }
  }
  return null;
}
