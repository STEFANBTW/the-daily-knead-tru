import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-[41px] flex flex-col font-sans bg-secondary text-primary">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex flex-col justify-center px-8 md:px-16 border-b border-primary">
        <div className="max-w-4xl">
          <div className="font-mono text-xs tracking-widest uppercase mb-12 border border-primary px-6 py-2 bg-secondary text-primary shadow-obsession w-fit inline-block">
            Establishment
          </div>
          <h1 className="font-sans font-black text-6xl md:text-8xl uppercase leading-[0.85] tracking-tighter mb-8">
            Built On
            <br />
            <span className="font-serif italic text-obsession font-semibold">
              Instinct.
            </span>
          </h1>
          <p className="font-serif text-2xl md:text-3xl max-w-2xl opacity-80 leading-relaxed">
            The Daily Knead was born from a simple frustration: dining out had
            become too precious. Too many tweezers, not enough fire.
          </p>
        </div>
      </section>

      {/* Tri-Column Content */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-primary">
        <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-primary">
          <span className="font-mono text-xs tracking-widest uppercase opacity-60 mb-8 block">
            01 / The Method
          </span>
          <h2 className="font-bold text-2xl md:text-3xl uppercase mb-6">
            Fire & Friction
          </h2>
          <p className="font-serif text-lg leading-relaxed opacity-80">
            We don&apos;t do subtle. We use open flames, heavy iron skillets,
            and ingredients that speak for themselves. You&apos;ll find charred
            edges, aggressive seasoning, and flavors that refuse to apologize.
          </p>
        </div>
        <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-primary">
          <span className="font-mono text-xs tracking-widest uppercase opacity-60 mb-8 block">
            02 / The Material
          </span>
          <h2 className="font-bold text-2xl md:text-3xl uppercase mb-6">
            Local Offense
          </h2>
          <p className="font-serif text-lg leading-relaxed opacity-80">
            Sourced daily from aggressive farmers and uncompromising butchers.
            If an ingredient doesn&apos;t have a backbone, it doesn&apos;t cross
            our threshold. Our pasta is hand-pulled, our butter is cultured
            in-house.
          </p>
        </div>
        <div className="p-8 md:p-16 flex flex-col justify-between bg-primary text-secondary">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase opacity-60 mb-8 block">
              03 / The Mandate
            </span>
            <h2 className="font-bold text-2xl md:text-3xl uppercase mb-6 text-obsession">
              Eat Heavily
            </h2>
            <p className="font-serif text-lg leading-relaxed opacity-80">
              Leave your restraint at the door. The Daily Knead is a temple for
              appetite.
            </p>
          </div>
          <div className="mt-12">
            <Link
              href="/menu"
              className="btn btn-secondary border-secondary text-secondary hover:text-secondary shadow-obsession"
            >
              Discover Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-[50vh] bg-primary">
        <div className="relative h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-secondary/20 grayscale hover:grayscale-0 transition-all duration-700">
          <Image
            src="https://images.unsplash.com/photo-1544025162-811c75cce87b?q=80&w=800"
            fill
            className="object-cover"
            alt="The Kitchen"
            unoptimized
          />
        </div>
        <div className="relative h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-secondary/20 grayscale hover:grayscale-0 transition-all duration-700">
          <Image
            src="https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800"
            fill
            className="object-cover"
            alt="Preparing ingredients"
            unoptimized
          />
        </div>
        <div className="relative h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-secondary/20 grayscale hover:grayscale-0 transition-all duration-700">
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800"
            fill
            className="object-cover"
            alt="Wood-fired oven"
            unoptimized
          />
        </div>
        <div className="relative h-[40vh] md:h-auto grayscale hover:grayscale-0 transition-all duration-700">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800"
            fill
            className="object-cover"
            alt="Flour"
            unoptimized
          />
        </div>
      </section>
    </main>
  );
}
