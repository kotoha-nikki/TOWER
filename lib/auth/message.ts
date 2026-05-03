type LoginMessageInput = {
  domain: string;
  walletAddress: string;
  nonce: string;
  issuedAt: string;
};

export function buildLoginMessage({
  domain,
  walletAddress,
  nonce,
  issuedAt
}: LoginMessageInput) {
  return [
    "Tower Map wallet login",
    "",
    "Sign this message to prove wallet ownership.",
    "This does not authorize a transaction or move funds.",
    "",
    `Domain: ${domain}`,
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`
  ].join("\n");
}

export function getRequestDomain(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return new URL(siteUrl).host;
  }

  return request.headers.get("host") ?? "towermap.fun";
}
