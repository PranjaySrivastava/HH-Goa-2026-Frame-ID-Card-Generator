import HeroCopy from "./HeroCopy.jsx";
import AppCard from "./AppCard.jsx";

export default function Hero() {
  return (
    <section id="app" className="max-w-[1180px] mx-auto px-5 pt-14 pb-10 lg:pt-[76px] grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 items-start">
      <HeroCopy />
      <AppCard />
    </section>
  );
}
