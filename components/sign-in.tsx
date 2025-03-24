"use client"; // İstemci tarafında çalıştığını belirtiyoruz
import { signIn } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        // FormData'yı düz bir obje haline getiriyoruz.
        const data = Object.fromEntries(formData.entries());
        // SignIn çağrısına verileri gönderiyoruz.
        await signIn("credentials", data);
      }}
    >
      <label>
        Email:
        <input name="email" type="email" required />
      </label>
      <br />
      <label>
        Şifre:
        <input name="password" type="password" required />
      </label>
      <br />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
