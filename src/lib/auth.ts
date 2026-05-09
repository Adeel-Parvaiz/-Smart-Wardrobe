import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

type LeanUser = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "USER";   // ✅ literal type, not string
  status: "ACTIVE" | "INACTIVE";
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await UserModel.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).lean<LeanUser>();  // ✅ typed

        if (!user || user.status !== "ACTIVE") {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id:     user._id.toString(),
          name:   user.name,
          email:  user.email,
          role:   user.role,    // now "ADMIN" | "USER" ✅
          status: user.status,  // now "ACTIVE" | "INACTIVE" ✅
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id     = token.id as string;
        session.user.role   = (token.role as "ADMIN" | "USER") ?? "USER";
        session.user.status = (token.status as string | undefined) ?? "ACTIVE";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}
