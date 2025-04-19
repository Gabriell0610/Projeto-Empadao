import { StatusToken } from "@/utils/constants/statusToken";
import { ITokenResets } from "../interfaces/tokenResets/ITokenResets";
import { tokenResets } from "@prisma/client";

class InMemoryTokenResets implements ITokenResets {
    createToken!: (token: string, userId: string) => Promise<Partial<tokenResets>>;
    verifyToken!: (token: string) => Promise<boolean>;
    findByToken!: (token: string) => Promise<tokenResets>;
    listAllTokens!: () => Promise<tokenResets[]>;
    updateStatus!: (statusToken: StatusToken, idToken: string) => Promise<void>;
}

export { InMemoryTokenResets };
