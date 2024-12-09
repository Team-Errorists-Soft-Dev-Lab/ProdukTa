import { prisma } from "@/utils/prisma/client";
import bcrypt from "bcryptjs";
import { type Admin } from "@prisma/client";
import { type CustomAuthError } from "@/types/auth";

export async function findUserByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
    include: {
      sectors: {
        include: {
          sector: true,
        },
      },
    },
  });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function findSectorById(sectorId: number) {
  return prisma.sector.findUnique({
    where: { id: sectorId },
  });
}

export async function createAdmin({
  email,
  name,
  password,
  sectorId,
}: {
  email: string;
  name: string;
  password: string;
  sectorId: number;
}): Promise<Admin> {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.admin.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isPending: true,
      sectors: {
        create: {
          sectorId,
        },
      },
    },
    include: {
      sectors: {
        include: {
          sector: true,
        },
      },
    },
  });
}

export async function validateLoginAttempt(
  user: Admin | null,
): Promise<CustomAuthError | null> {
  if (!user) {
    return {
      code: "invalid_credentials",
      message: "Invalid email or password",
    };
  }

  // Superadmins can bypass all checks
  if (user.isSuperadmin) {
    return null;
  }

  // Check if admin is approved
  if (user.isPending) {
    return {
      code: "pending_approval",
      message:
        "Your account is pending approval. Please wait for admin verification.",
    };
  }

  return null;
}
