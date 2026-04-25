"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const defaultLogos: Logo[] = [
  { id: "logo-1", description: "Astro", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-2", description: "Figma", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-3", description: "Next.js", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-4", description: "React", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-5", description: "shadcn/ui", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-6", description: "Supabase", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/supabase-wordmark.svg", className: "h-7 w-auto" },
  { id: "logo-7", description: "Tailwind CSS", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-wordmark.svg", className: "h-4 w-auto" },
  { id: "logo-8", description: "Vercel", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg", className: "h-7 w-auto" },
];

export const Logos3 = ({
  heading = "Trusted by modern teams",
  logos = defaultLogos,
}: Logos3Props) => {
  return (
    <section className="bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {heading}
        </h2>

        <div className="mt-8">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[AutoScroll({ playOnInit: true, speed: 0.7, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-0"
                >
                  <div className="mx-6 flex h-16 items-center justify-center">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={`${logo.className ?? "h-7 w-auto"} opacity-70 transition-opacity hover:opacity-100`}
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
