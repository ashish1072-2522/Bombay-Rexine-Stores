import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: { email: { label: "Email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? "", email: user.email, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = (user as any).role; return token; },
    async session({ session, token }) { (session as any).role = token.role; return session; }
  },
  pages: { signIn: "/auth/signin" }
};
