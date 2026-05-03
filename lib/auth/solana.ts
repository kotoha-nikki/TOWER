import bs58 from "bs58";
import nacl from "tweetnacl";

export function normalizeWalletAddress(walletAddress: unknown) {
  return typeof walletAddress === "string" ? walletAddress.trim() : "";
}

export function isValidSolanaAddress(walletAddress: string) {
  try {
    const decoded = bs58.decode(walletAddress);
    return decoded.length === 32 && bs58.encode(decoded) === walletAddress;
  } catch {
    return false;
  }
}

export function verifyWalletSignature({
  message,
  signature,
  walletAddress
}: {
  message: string;
  signature: string;
  walletAddress: string;
}) {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);

    if (signatureBytes.length !== 64 || publicKeyBytes.length !== 32) {
      return false;
    }

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch {
    return false;
  }
}
