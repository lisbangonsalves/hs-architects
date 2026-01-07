import Navbar from "../components/Navbar";

export const metadata = {
  title: "Projects | HS Architects",
};

export default function ProjectsPage() {
  const projects = [
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
  ];

  return (
    <>
      <Navbar />
      <main className="pt-24 bg-[#101014] text-white">
        {/* SECTION 1 – Projects Intro (Black) */}
        <section className="bg-[#101014] text-white py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <p className="uppercase tracking-[0.35em] text-xs text-gray-400">
              Projects
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              Selected works shaped by context, restraint, and light.
            </h1>
            <p className="text-base sm:text-lg max-w-3xl text-gray-200 leading-relaxed">
              We approach each commission with a calm, context-driven process:
              listening to site and climate, simplifying form, and letting
              materials and light guide how spaces are lived in.
            </p>
          </div>
        </section>

        {/* SECTION 2 – Projects Listing (Warm Off-white) */}
        <section className="bg-[#f4f0e9] text-gray-900 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Optional filter */}
            <div className="flex flex-wrap items-center gap-4 text-sm tracking-wide text-gray-700">
              <button className="text-gray-900 font-medium">All</button>
              <button className="text-gray-600 hover:text-gray-900 transition-opacity">
                Architecture
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-opacity">
                Interior Design
              </button>
            </div>

            <div className="space-y-16 sm:space-y-20">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  className="block space-y-4 transition-opacity hover:opacity-90"
                >
                  <div className="w-full aspect-[16/9] bg-gray-200">
                    {/* Replace with actual image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      {project.name}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <h2
                      className="text-xl sm:text-2xl text-gray-900"
                      style={{ fontFamily: "var(--font-serif), serif" }}
                    >
                      {project.name}
                    </h2>
                    <p className="text-sm text-gray-700 tracking-wide">
                      {project.location} · {project.typology} · {project.year}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


