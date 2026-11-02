import { KeyRound, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import { Shortener } from "./Shortener";

const features = [
  {
    icon: Zap,
    title: "No sign-up",
    desc: "Paste, shorten, share. No account or email needed.",
  },
  {
    icon: KeyRound,
    title: "Your own admin key",
    desc: "Every link comes with a private admin URL you can use to delete it anytime.",
  },
  {
    icon: MousePointerClick,
    title: "Click counts",
    desc: "See how many times each of your short links has been opened.",
  },
  {
    icon: ShieldCheck,
    title: "Honest redirects",
    desc: "No tracking pixels, no interstitial ads. Popular links are served from cache.",
  },
];

export const HomePage = () => {
  return (
    <div className="page">
      <section className="hero">
        <span className="pill">Free · No sign-up needed</span>
        <h1 className="hero-title">
          Long links in.
          <br />
          Short links out.
        </h1>
        <p className="hero-desc">
          Paste any URL to get a short, shareable link — then check how many times it's been clicked.
        </p>
        <Shortener showRecent />
      </section>

      <section className="features" aria-label="Features">
        {features.map(({ icon: Icon, title, desc }) => (
          <div className="feature-card" key={title}>
            <Icon size={26} aria-hidden="true" className="feature-icon" />
            <h2 className="feature-title">{title}</h2>
            <p className="feature-desc">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
