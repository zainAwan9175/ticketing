import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new', cta: true },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href, cta }) => {
      return (
        <li key={href}>
          <Link className={`gt-navlink ${cta ? 'gt-navlink--cta' : ''}`} href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="gt-nav">
      <div className="gt-nav__inner">
        <Link className="gt-brand" href="/">
          <span className="gt-brand__logo">🎟️</span>
          <span className="gt-brand__name">GitTix</span>
        </Link>

        <ul className="gt-navlinks">{links}</ul>
      </div>
    </nav>
  );
};
