import Navbar from "../components/Navbar";

export const metadata = {
  title: "Studio | HS Architects",
};

export default function StudioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#101014] text-white pt-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
            Studio
          </p>
          <h1 className="text-4xl font-serif">Studio</h1>
          <p className="text-lg text-gray-700">
            This page is a temporary placeholder for the Studio section.
          </p>
        </div>
      </main>
    </>
  );
}

