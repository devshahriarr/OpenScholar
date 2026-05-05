import { Globe, Shield, Unlock } from "lucide-react";

const methodologies = [
  {
    icon: Shield,
    title: "Double-Blind Peer Review",
    description:
      "Our rigorous evaluation process ensures only the highest quality research joins the archive, maintained by a board of emeritus faculty.",
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description:
      "Indexed in major academic databases including PubMed, Scopus, and JSTOR for maximum visibility.",
  },
  {
    icon: Unlock,
    title: "Open Access",
    description:
      "Advocating for the democratization of knowledge through permanent, free access to the public good.",
  },
];

export default function MethodologySection() {
  return (
    <section id="methodology" className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-1 mb-10">
          <h2 className="text-2xl font-semibold text-text-primary">Our Methodology</h2>
          <p className="text-sm text-text-secondary">Designed for Rigor and Reach</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methodologies.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-background p-6 shadow-card space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
