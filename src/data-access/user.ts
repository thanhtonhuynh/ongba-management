import "server-only";
import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/prisma";
import { User } from "@/lib/auth/session";

// Create User
export async function createUser(
  name: string,
  username: string,
  email: string,
  password: string,
) {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, username, email, passwordHash },
  });
  return user as User;
}

// Get All Users
export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users as User[];
}

// Get User By ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user as User | null;
}

// Get User By Email
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user as User | null;
}

// Get User By Username
export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  return user as User | null;
}

// Get User By Email Or Username
export async function getUserByEmailOrUsername(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
  return user as User | null;
}

// Get User Password Hash
export async function getUserPasswordHash(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) throw new Error("Invalid user ID");
  return user.passwordHash;
}

// Update User
export async function updateUser(userId: string, data: Partial<User>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user as User;
}

// Update User Password
export async function updateUserPassword(userId: string, password: string) {
  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
