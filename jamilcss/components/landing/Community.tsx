import Image from "next/image";

interface GHRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface NpmDownloads {
  downloads: number;
}

interface NpmLatest {
  version: string;
}

async function fetchGitHub(): Promise<GHRepo | null> {
  try {
    const res = await fetch("https://api.github.com/repos/khaouitiabdelhakim/JamilCSS", {
      next: { revalidate: 3600 },
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) return null;
    return res.json() as Promise<GHRepo>;
  } catch {
    return null;
  }
}

async function fetchContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch("https://api.github.com/repos/khaouitiabdelhakim/JamilCSS/contributors?per_page=12", {
      next: { revalidate: 3600 },
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) return [];
    return res.json() as Promise<Contributor[]>;
  } catch {
    return [];
  }
}

async function fetchNpmDownloads(): Promise<number> {
  try {
    const res = await fetch("https://api.npmjs.org/downloads/point/last-week/jamilcss", { next: { revalidate: 3600 } });
    if (!res.ok) return 0;
    const data = await res.json() as NpmDownloads;
    return data.downloads ?? 0;
  } catch {
    return 0;
  }
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const QUOTES = [
  {
    text: "Finally a utility framework that doesn't fight me. The stacked variants are a game changer.",
    handle: "@dev_marco",
    role: "Frontend Engineer",
  },
  {
    text: "Switched from Tailwind to JamilCSS for a project. Loved that any numeric value just works — j-w-237 and it's done.",
    handle: "@celine_codes",
    role: "UI Developer",
  },
  {
    text: "The PostCSS plugin is seamless. Zero config, zero runtime, zero complaints from my team.",
    handle: "@raf_builds",
    role: "Tech Lead",
  },
];

export async function Community() {
  const [repo, contributors, weeklyDownloads] = await Promise.all([
    fetchGitHub(),
    fetchContributors(),
    fetchNpmDownloads(),
  ]);

  const stats = [
    { label: "GitHub Stars", value: repo ? fmt(repo.stargazers_count) : "–" },
    { label: "Weekly Downloads", value: weeklyDownloads > 0 ? fmt(weeklyDownloads) : "–" },
    { label: "Forks", value: repo ? fmt(repo.forks_count) : "–" },
    { label: "Contributors", value: contributors.length > 0 ? String(contributors.length) : "–" },
  ];

  return (
    <section className="j-py-96 j-px-24 j-border-y" style={{ background: "#070d1a", borderColor: "rgba(248,87,166,0.08)" }}>
      <div className="j-container">
        <div className="j-text-center j-mb-64">
          <p className="j-text-sm j-font-semibold j-uppercase j-tracking-widest j-mb-12" style={{ color: "#f857a6" }}>Community</p>
          <h2
            className="j-text-5xl j-font-bold j-text-white j-mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
          >
            Built in the open.
          </h2>
          <p className="j-text-gray-400 j-text-xl">Open source, open to collaboration.</p>
        </div>

        {/* Stats grid */}
        <div className="j-grid j-grid-cols-2 lg:j-grid-cols-4 j-gap-16 j-mb-64">
          {stats.map((s) => (
            <div
              key={s.label}
              className="j-text-center j-p-24 j-rounded-2xl j-border"
              style={{ background: "rgba(248,87,166,0.04)", borderColor: "rgba(248,87,166,0.12)" }}
            >
              <div
                className="j-text-3xl j-font-bold j-mb-4"
                style={{ color: "#f857a6", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s.value}
              </div>
              <div className="j-text-sm j-text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contributor avatars */}
        {contributors.length > 0 && (
          <div className="j-flex j-flex-col j-items-center j-mb-64">
            <p className="j-text-sm j-text-gray-500 j-mb-20">Contributors</p>
            <div className="j-flex j-items-center">
              {contributors.slice(0, 10).map((c, i) => (
                <a
                  key={c.login}
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={c.login}
                  style={{ marginLeft: i === 0 ? 0 : -12, zIndex: contributors.length - i, display: "block" }}
                >
                  <Image
                    src={c.avatar_url}
                    alt={c.login}
                    width={40}
                    height={40}
                    className="j-rounded-full j-border-2"
                    style={{ borderColor: "#030712" }}
                  />
                </a>
              ))}
              {contributors.length > 10 && (
                <div
                  className="j-flex j-items-center j-justify-center j-rounded-full j-border-2 j-text-xs j-font-semibold j-text-gray-400"
                  style={{ width: 40, height: 40, background: "#1e293b", borderColor: "#030712", marginLeft: -12 }}
                >
                  +{contributors.length - 10}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quotes */}
        <div className="j-grid lg:j-grid-cols-3 j-gap-24 j-mb-48">
          {QUOTES.map((q) => (
            <div
              key={q.handle}
              className="j-p-28 j-rounded-2xl j-border"
              style={{ background: "rgba(15,23,42,0.6)", borderColor: "rgba(248,87,166,0.1)" }}
            >
              <p className="j-text-gray-300 j-leading-relaxed j-mb-20 j-text-sm">&ldquo;{q.text}&rdquo;</p>
              <div>
                <p className="j-font-semibold j-text-white j-text-sm">{q.handle}</p>
                <p className="j-text-xs j-text-gray-500">{q.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="j-text-center">
          <a
            href="https://github.com/khaouitiabdelhakim/JamilCSS"
            target="_blank"
            rel="noopener noreferrer"
            className="j-inline-flex j-items-center j-gap-8 j-px-32 j-py-16 j-rounded-xl j-text-white j-font-semibold j-transition hover:j-opacity-90"
            style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)", boxShadow: "0 0 32px rgba(248,87,166,0.25)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
