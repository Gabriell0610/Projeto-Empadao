import { StatusToken } from "@/utils/constants/statusToken";
import { tokenResets } from "@prisma/client";

export interface ITokenResets {
  createToken: (token: string, userId: string) => Promise<Partial<tokenResets>>;
  findByToken: (token: string) => Promise<tokenResets | null>;
  listAllTokens: () => Promise<tokenResets[]>;
  updateStatus: (statusToken: StatusToken, idToken: string) => Promise<void>
}
