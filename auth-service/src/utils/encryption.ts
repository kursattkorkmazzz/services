import crypto from "crypto";

export default function PasswordHash(password: string): string {
  const hashFn = crypto.createHash(process.env.PASSWORD_HASH_ALG || "sha256", {
    encoding: "utf8",
  });
  hashFn.update(password);
  const hashed_password = hashFn.digest("hex");
  return hashed_password;
}
