import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
    }

    interface Request {
      user?: User;
      projectRole?: Role;
    }
  }
}

export {};
