import { prisma } from "@/utils/prisma/client";
import bcrypt from "bcryptjs";
import { type Admin, type AdminSectors } from "@prisma/client";
import { type CustomAuthError } from "@/types/auth";

// Define an interface for Admin with included relations
interface AdminWithSectors extends Admin {
  sectors: AdminSectors[];
  isSuperadmin?: boolean;
  isActive?: boolean;
  isPending?: boolean;
  emailVerified?: boolean;
}

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
  user: AdminWithSectors | null,
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

  // Check if admin is pending approval
  if (user.isPending) {
    return {
      code: "pending_approval",
      message:
        "Your account is pending approval. Please wait for admin verification.",
    };
  }

  // Check if admin has any sectors assigned
  if (!user.sectors || user.sectors.length === 0) {
    return {
      code: "no_sectors",
      message:
        "Your account doesn't have any sectors assigned. Please contact an administrator.",
    };
  }

  // Optional checks based on your schema
  if (user.isActive === false) {
    return {
      code: "account_disabled",
      message: "Your account has been deactivated. Please contact support.",
    };
  }

  if (user.emailVerified === false) {
    return {
      code: "email_unverified",
      message: "Please verify your email address before logging in.",
    };
  }

  // All checks passed
  return null;
}
