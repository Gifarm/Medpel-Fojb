// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"; // Sesuaikan path jika Anda menaruh auth.ts di folder lain (misal: "@/lib/auth")

export const { GET, POST } = handlers;
