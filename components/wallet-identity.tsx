"use client";

import { useEffect, useMemo, useState } from "react";
import bs58 from "bs58";
import { getDictionary, type Locale } from "@/lib/i18n";

type WalletPublicKey = {
  toString: () => string;
};

type InjectedSolanaWallet = {
  publicKey?: WalletPublicKey | null;
  connect: () => Promise<{ publicKey?: WalletPublicKey } | void>;
  disconnect?: () => Promise<void>;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array | { signature: Uint8Array }>;
};

type WalletOption = {
  id: "phantom" | "solflare" | "backpack";
  label: string;
  installUrl: string;
  provider: InjectedSolanaWallet | null;
};

type AuthSession = {
  userId: string;
  walletAddress: string;
  issuedAt: string;
  expiresAt: string;
};

declare global {
  interface Window {
    solana?: InjectedSolanaWallet & { isPhantom?: boolean };
    phantom?: { solana?: InjectedSolanaWallet };
    solflare?: InjectedSolanaWallet;
    backpack?: { solana?: InjectedSolanaWallet };
  }
}

export function WalletIdentity({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletOption | null>(null);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((payload: { authenticated: boolean; user: AuthSession | null }) => {
        if (payload.authenticated && payload.user) {
          setSession(payload.user);
          setConnectedAddress(payload.user.walletAddress);
        }
      })
      .catch(() => {
        setSession(null);
      });
  }, []);

  const wallets = useMemo<WalletOption[]>(() => {
    if (!mounted) {
      return [];
    }

    return [
      {
        id: "phantom",
        label: "Phantom",
        installUrl: "https://phantom.app/download",
        provider: window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null)
      },
      {
        id: "solflare",
        label: "Solflare",
        installUrl: "https://solflare.com/download",
        provider: window.solflare ?? null
      },
      {
        id: "backpack",
        label: "Backpack",
        installUrl: "https://www.backpack.app/download",
        provider: window.backpack?.solana ?? null
      }
    ];
  }, [mounted]);

  const displayAddress = session?.walletAddress ?? connectedAddress;
  const buttonLabel = displayAddress
    ? `${session ? dictionary.auth.signedIn : dictionary.auth.connectedWallet} ${shortAddress(displayAddress)}`
    : dictionary.auth.connect;

  async function connectWallet(wallet: WalletOption) {
    setError("");

    if (!wallet.provider) {
      window.open(wallet.installUrl, "_blank", "noreferrer");
      setError(dictionary.auth.unavailable);
      return;
    }

    setBusy(true);

    try {
      const result = await wallet.provider.connect();
      const address = result?.publicKey?.toString() ?? wallet.provider.publicKey?.toString() ?? "";

      if (!address) {
        throw new Error("Wallet did not return a public key.");
      }

      setActiveWallet(wallet);
      setConnectedAddress(address);
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signIn() {
    const provider = activeWallet?.provider;

    if (!provider || !connectedAddress || !provider.signMessage) {
      setError("This wallet does not support message signing.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: connectedAddress })
      });
      const noncePayload = await nonceResponse.json();

      if (!nonceResponse.ok) {
        throw new Error(noncePayload.error ?? "Could not create login challenge.");
      }

      const messageBytes = new TextEncoder().encode(noncePayload.message);
      const signed = await provider.signMessage(messageBytes);
      const signatureBytes = signed instanceof Uint8Array ? signed : signed.signature;
      const signature = bs58.encode(signatureBytes);
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: connectedAddress,
          nonce: noncePayload.nonce,
          signature
        })
      });
      const verifyPayload = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyPayload.error ?? "Wallet signature could not be verified.");
      }

      setSession(verifyPayload.user);
    } catch (signError) {
      setError(signError instanceof Error ? signError.message : "Wallet login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError("");

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await activeWallet?.provider?.disconnect?.();
      setSession(null);
      setConnectedAddress("");
      setActiveWallet(null);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div className="wallet-identity">
      <button type="button" className="wallet-trigger" onClick={() => setOpen(true)}>
        {buttonLabel}
      </button>

      {open ? (
        <div className="wallet-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="wallet-modal"
            aria-label={dictionary.auth.chooseWallet}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wallet-modal-head">
              <div>
                <p className="eyebrow">{dictionary.auth.connectedWallet}</p>
                <h2>{dictionary.auth.chooseWallet}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                {dictionary.auth.close}
              </button>
            </div>

            {displayAddress ? (
              <div className="wallet-session-card">
                <span>{shortAddress(displayAddress)}</span>
                <p>{session ? dictionary.auth.sessionReady : dictionary.auth.connectedWallet}</p>
              </div>
            ) : null}

            {!connectedAddress ? (
              <div className="wallet-list">
                {wallets.map((wallet) => (
                  <button key={wallet.id} type="button" onClick={() => connectWallet(wallet)}>
                    <span>{wallet.label}</span>
                    <small>{wallet.provider ? dictionary.auth.connect : dictionary.auth.installWallet}</small>
                  </button>
                ))}
              </div>
            ) : null}

            {connectedAddress && !session ? (
              <button type="button" className="wallet-primary" onClick={signIn} disabled={busy}>
                {busy ? dictionary.auth.signing : dictionary.auth.signMessage}
              </button>
            ) : null}

            {session ? (
              <button type="button" className="wallet-secondary" onClick={disconnect} disabled={busy}>
                {dictionary.auth.disconnect}
              </button>
            ) : null}

            {error ? <p className="wallet-error">{error}</p> : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

function shortAddress(walletAddress: string) {
  return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
}
