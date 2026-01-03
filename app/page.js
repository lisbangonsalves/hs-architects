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

        {/* Recent projects */}
        <section className="relative z-10 border-t border-white/10 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col gap-3">
              <p className="uppercase tracking-[0.3em] text-xs text-gray-400">
                Recent Projects
              </p>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Selected work, crafted for people.
                </h2>
                <p className="text-gray-400 max-w-2xl">
                  A snapshot of spaces we’ve recently delivered—minimal, thoughtful,
                  and built to last.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Harborview Residence",
                  location: "Seattle, WA",
                  type: "Residential",
                },
                {
                  title: "Crescent Innovation Hub",
                  location: "Austin, TX",
                  type: "Commercial",
                },
                {
                  title: "Northline Cultural Center",
                  location: "Chicago, IL",
                  type: "Cultural",
                },
              ].map((project) => (
                <div
                  key={project.title}
                  className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/30 transition"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                    <span>{project.type}</span>
                    <span className="h-px w-8 bg-white/20" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-gray-100">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Minimal, context-driven design with sustainable detailing.
                  </p>
                  <a
                    href="/projects"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition"
                  >
                    View project
                    <span aria-hidden="true" className="text-white/60 group-hover:text-white">
                      →
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
