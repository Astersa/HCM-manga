import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Reader from "@/components/Reader";
import { getChapters } from "@/lib/manga";

export default function Home() {
  const chapters = getChapters();

  return (
    <main id="top">
      <Hero chapters={chapters} />
      <Reader chapters={chapters} />
      <Footer />
    </main>
  );
}
