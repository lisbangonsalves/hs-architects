import Navbar from "../components/Navbar";

export const metadata = {
  title: "Projects | HS Architects",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-300">
          Placeholder
        </p>
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-lg text-gray-200/90">
          This page is a temporary placeholder for the Projects section.
          Replace with real project listings and filters when ready.
        </p>
      </div>
    </main>
    </>
  );
}


