import * as z from "zod/mini"; 

export const authValidation = z.strictObject({
  email: z.email("Invalid Email format"),
  
  password: z.string().check(
    z.minLength(6, "Password must be at least 6 characters long"),
    z.regex(/[A-Z]/, "Password must contain an uppercase letter"),
    z.regex(/[a-z]/, "Password must contain a lowercase letter"), 
    z.regex(/[0-9]/, "Password must contain a number"),
    z.regex(/[!@#$%^&*()_+\-=\[\]{};':",.<>\/?]/, "Password must contain a special character (!@#$ etc.)")
  ),
});

export type AuthInput = z.infer<typeof authValidation>;