import { title } from "@/components/primitives";
import KusaGuide from "@/components/pochaHome/guide/kusaGuide";
import Guide from "@/components/pochaHome/guide/guide";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <h1 className={title({ color: "violet" })}>Pocha&nbsp;</h1>
      </div>

      <div className="px-8 w-screen sm:w-[32rem]">
        <Guide />
      </div>

      <div className="px-8 w-screen sm:w-[32rem]">
        <KusaGuide />
      </div>
    </section>
  );
}
