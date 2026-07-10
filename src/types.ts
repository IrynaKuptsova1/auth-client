export type TokenPair = {
    accessToken: string;
    refreshToken: string;
}

export const isNonEmptyString = (val: unknown): val is string => 
  typeof val === "string" && val.trim().length > 0;