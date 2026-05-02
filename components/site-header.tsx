import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span>TWR</span>
        Tower Map
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Tower</Link>
        <Link href="/methodology">Methodology</Link>
        <a href="https://github.com/kotoha-nikki/TOWER" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
