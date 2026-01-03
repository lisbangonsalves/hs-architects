import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-black text-white">
        {/* Hero with background video */}
        <section className="relative min-h-screen overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src="/home.mp4"
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div className="relative z-10 flex min-h-screen items-center">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="max-w-2xl space-y-6">
                <p className="uppercase tracking-[0.4em] text-sm text-gray-200">
                  Architecture & Design
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Shaping spaces that elevate the human experience.
                </h1>
                <p className="text-lg sm:text-xl text-gray-200/90">
                  HS Architects is your trusted partner from concept to completion,
                  delivering thoughtful, sustainable, and iconic environments.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-3 text-sm font-semibold transition hover:bg-gray-200"
                  >
                    View Projects
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calm text-only introduction section */}
        <section className="bg-[#fafafa] text-gray-900 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p
              className="text-xl sm:text-2xl lg:text-3xl leading-relaxed text-gray-800"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              We believe architecture is fundamentally about people and place.
              Each project begins with careful attention to context, light, and
              the subtle ways spaces shape human experience. Our work is quiet,
              purposeful, and built to last.
            </p>
          </div>
        </section>

        {/* Selected Works */}
        <section className="bg-white text-gray-900 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl sm:text-4xl mb-16 sm:mb-20"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Selected Works
            </h2>

            <div className="space-y-16 sm:space-y-24">
              {[
                {
                  name: "Harborview Residence",
                  location: "Seattle, WA",
                  typology: "Residential",
                  year: "2024",
                  image: "/projects/harborview.jpg",
                  href: "/projects/harborview",
                },
                {
                  name: "Crescent Innovation Hub",
                  location: "Austin, TX",
                  typology: "Commercial",
                  year: "2023",
                  image: "/projects/crescent.jpg",
                  href: "/projects/crescent",
                },
                {
                  name: "Northline Cultural Center",
                  location: "Chicago, IL",
                  typology: "Cultural",
                  year: "2023",
                  image: "/projects/northline.jpg",
                  href: "/projects/northline",
                },
              ].map((project) => (
                <div key={project.name} className="space-y-4">
                  <a
                    href={project.href}
                    className="block transition-opacity hover:opacity-95"
                  >
                    <div className="w-full aspect-[4/3] bg-gray-200">
                      {/* Placeholder for project image - replace with actual image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        {project.name}
                      </div>
                    </div>
                  </a>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <h3
                      className="text-xl sm:text-2xl"
                      style={{ fontFamily: "var(--font-serif), serif" }}
                    >
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 tracking-wide">
                      {project.location} · {project.typology} · {project.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Belief Statement */}
        <section className="bg-[#fafafa] text-gray-900 py-32 sm:py-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-3xl sm:text-4xl lg:text-5xl leading-relaxed"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              We believe architecture should be felt, not explained.
            </p>
          </div>
        </section>

        {/* Practice Preview */}
        <section className="bg-white text-gray-900 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text */}
              <div className="space-y-6">
                <h2
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Our Practice
                </h2>
                <p className="text-lg sm:text-xl leading-relaxed text-gray-700">
                  Our approach is context-driven, responding thoughtfully to each
                  site's unique conditions and climate. We practice restraint in
                  design, allowing materials and light to speak clearly. Every
                  decision serves both function and the human experience of space.
                </p>
                <a
                  href="/practice"
                  className="inline-block text-gray-900 hover:opacity-70 transition-opacity text-sm tracking-wide"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Learn more about our practice →
                </a>
              </div>

              {/* Right: Image */}
              <div className="w-full aspect-[4/3] bg-gray-200">
                {/* Placeholder for architectural image - replace with actual image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Practice Image
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
