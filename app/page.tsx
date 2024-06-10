import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";

import { title } from "@/components/primitives";
import KusaGuide from "@/components/pochaHome/kusaGuide";

export default async function Home() {
  // const supabase = createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // console.log(user);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <h1 className={title({ color: "violet" })}>Pocha&nbsp;</h1>
        {/* <br />
        <h1 className={title()}>
          websites regardless of your design experience.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </h2> */}
      </div>

      {/* <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div> */}

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">. . .</Code>
          </span>
        </Snippet>
      </div>
      <div className="px-8 w-screen sm:w-[32rem]">
        <KusaGuide />
      </div>
    </section>
  );
}
