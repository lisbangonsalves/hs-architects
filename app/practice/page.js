import Navbar from "../components/Navbar";

export const metadata = {
  title: "Practice | HS Architects",
};

export default function PracticePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 bg-[#101014] text-white">
        {/* SECTION 1 – Philosophy (Dark) */}
        <section className="bg-[#101014] text-[#e8e3db] pt-24 pb-36 sm:pt-32 sm:pb-44">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-6">
              Practice
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-10"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              A practice grounded in simplicity, space, and light.
            </h1>
            <div className="space-y-5 text-sm sm:text-base leading-[1.85] text-[#e8e3db]">
              <p className="text-[#e2ddce]">
                We treat architecture as the quiet arrangement of space, light,
                and material rather than an act of constant expression. Each
                project is stripped back to what is essential, so that what
                remains can be felt with clarity.
              </p>
              <p className="text-[#e2ddce]">
                Light is the first material we work with. Openings, shadows,
                and thresholds are carefully placed to choreograph how spaces
                are experienced across the day and across seasons.
              </p>
              <p className="text-[#e2ddce]">
                Materials are chosen for their honesty and ability to age
                gracefully. Concrete, brick, timber, and stone are allowed to be
                themselves, without disguise, forming a calm backdrop for daily
                life.
              </p>
              <p className="text-[#e2ddce]">
                Above all, we design for human experience — for the quiet
                routines, gatherings, and pauses that turn a building into a
                lived place.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 – We Believe (Light) */}
        <section className="bg-[#f4f0e9] text-gray-900 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <h2
              className="text-2xl sm:text-3xl"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              We believe
            </h2>
            <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-800">
              <p>
                Architecture should be quiet enough to hold everyday life, yet
                precise enough to feel intentional.
              </p>
              <p>
                Spaces are at their best when they respond to their climate,
                landscape, and culture rather than resist them.
              </p>
              <p>
                Simplicity is not absence, but the careful presence of only what
                is necessary.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 – Our Approach (Dark) */}
        <section className="bg-[#12131a] text-[#e8e3db] pt-24 pb-36 sm:pt-32 sm:pb-44">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2
              className="text-2xl sm:text-3xl"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Our approach
            </h2>
            <ul className="space-y-4 text-sm sm:text-base leading-[1.85] text-[#e2ddce] list-disc list-inside">
              <li>
                Begin with context — orientation, wind, vegetation, neighbours,
                and the everyday patterns of the site.
              </li>
              <li>
                Shape the plan through climate — shade, cross-ventilation,
                thermal mass, and the comfort of occupied spaces.
              </li>
              <li>
                Work with a restrained material palette that feels grounded,
                tactile, and appropriate to place.
              </li>
              <li>
                Resolve details so that doors, windows, thresholds, and
                junctions feel effortless in use.
              </li>
              <li>
                Continually return to how the space will be lived in — how it
                sounds, how it receives light, and how it supports quiet moments
                as much as gatherings.
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 4 – Closing Thought (Light) */}
        <section className="bg-[#f4f0e9] text-gray-900 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p
              className="text-lg sm:text-xl leading-[1.85] text-gray-800"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Our work is a series of measured responses to site, climate, and
              life — each project a quiet extension of its context, and a
              considered prelude to the spaces and stories that follow.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

