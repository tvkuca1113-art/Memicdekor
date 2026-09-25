type LogoProps = {
  className?: string;
  /** Prazan alt kada je logo samo ukras (npr. u otvorenom meniju). */
  alt: string;
  /** Širine prikaza za sizes, npr. '(min-width: 1280px) 252px, 172px'. */
  sizes: string;
  loading?: 'eager' | 'lazy';
};

/**
 * Originalni logo (WebP bez gubitaka, izvorne boje) u dvije širine.
 * Obični <img> jer next/image optimizacija radi sa gubicima, što bi izmijenilo rubove slova.
 * fetchPriority="low": logo ne konkuriše naslovnoj fotografiji (LCP) pri učitavanju.
 */
export function Logo({ className, alt, sizes, loading = 'eager' }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src="/brand/memic-dekor-logo-520.webp"
      srcSet="/brand/memic-dekor-logo-344.webp 344w, /brand/memic-dekor-logo-520.webp 520w"
      sizes={sizes}
      width={520}
      height={96}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority="low"
    />
  );
}
