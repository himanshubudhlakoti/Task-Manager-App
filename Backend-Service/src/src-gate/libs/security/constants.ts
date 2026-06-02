import envConfig from "src/src-gate/libs/security/env.config";

export const JWT_CONFIG: { expiresIn: string; secret: string, refreshTokenExpiresIn: string } = {
    expiresIn: '2h',
    refreshTokenExpiresIn: '3h',
    secret: envConfig.JWT_SECRET
};
