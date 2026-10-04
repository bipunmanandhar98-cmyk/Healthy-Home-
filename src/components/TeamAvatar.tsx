import type { TeamMember } from '../data/content';

/**
 * Initials from a name, dropping any honorific so "Dr. Arnija Rana" reads "AR"
 * rather than "DA".
 */
function initials(name: string) {
  const parts = name
    .replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return parts.slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
}

/**
 * Portrait for a team member, falling back to an initials tile.
 *
 * Not every clinician has a confirmed photograph yet, and a missing photo is
 * never papered over by pointing at someone else's image: attributing a real,
 * named person's face to a different real, named colleague is worse than showing
 * no face at all. Members without `img` therefore get a neutral tile.
 *
 * `decorative` is for the small carousel thumbnails, where the surrounding
 * button already carries the person's name — announcing it again on the image
 * would just duplicate it for a screen reader.
 */
export default function TeamAvatar({
  m,
  className = '',
  initialsClass = 'text-4xl',
  decorative = false,
}: {
  m: TeamMember;
  className?: string;
  initialsClass?: string;
  decorative?: boolean;
}) {
  if (m.img) {
    return (
      <img
        src={m.img}
        alt={decorative ? '' : m.name}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }
  return (
    <div
      className={`bg-gradient-to-b from-sand to-linen grid place-items-center overflow-hidden ${className}`}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : m.name}
    >
      <span
        className={`font-display italic text-ink/50 select-none ${initialsClass}`}
        aria-hidden="true"
      >
        {initials(m.name)}
      </span>
    </div>
  );
}