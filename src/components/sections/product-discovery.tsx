import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/primitives/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { fadeUp, staggerContainer } from "@/lib/animation";

const shopCategories = [
  {
    name: "Modular Kitchens",
    href: routes.collection("kitchens"),
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Living Room Furniture",
    href: routes.collection("living-room-furniture"),
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Bedroom Wardrobes",
    href: routes.collection("bedroom-wardrobes"),
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "TV Units",
    href: routes.collection("living-room-furniture"),
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Beds & Side Tables",
    href: routes.collection("bedroom-wardrobes"),
    image:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Other Furniture",
    href: routes.collection("other-furniture"),
    image:
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=900&q=82",
  },
] as const;

const topSystems = [
  {
    name: "Luxe Steel Kitchen",
    category: "Kitchen",
    price: "From Rs. 4.8L",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=84",
  },
  {
    name: "Full Wall Wardrobe",
    category: "Bedroom Wardrobes",
    price: "From Rs. 2.2L",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=84",
  },
  {
    name: "Floating TV System",
    category: "Living Room Furniture",
    price: "From Rs. 1.6L",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=84",
  },
  {
    name: "Storage Bed Suite",
    category: "Bedroom Furniture",
    price: "From Rs. 1.4L",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1100&q=84",
  },
] as const;

export function ProductDiscovery() {
  return (
    <>
      <section className="border-b bg-background py-10" id="other-furniture">
        <Container className="space-y-7">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Shop categories
              </p>
              <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl">
                What we make
              </h2>
            </div>
            <Button className="hidden sm:inline-flex" variant="secondary">
              View all
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            {shopCategories.map((category) => (
              <motion.a
                className="group overflow-hidden rounded-lg border bg-card"
                href={category.href}
                key={category.name}
                variants={fadeUp}
              >
                <img
                  alt={category.name}
                  className="sm-image-treatment aspect-square w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.04]"
                  loading="lazy"
                  src={category.image}
                />
                <div className="flex items-center justify-between gap-3 p-3">
                  <span className="text-sm font-medium">{category.name}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="border-b bg-accent py-10">
        <Container className="space-y-7">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                Popular systems
              </p>
              <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl">
                Ready to configure
              </h2>
            </div>
            <Button className="hidden sm:inline-flex" variant="secondary">
              Book visit
            </Button>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            {topSystems.map((system) => (
              <motion.a
                className="group overflow-hidden rounded-lg border bg-background"
                href={routes.collection("other-furniture")}
                key={system.name}
                variants={fadeUp}
              >
                <img
                  alt={system.name}
                  className="sm-image-treatment aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]"
                  loading="lazy"
                  src={system.image}
                />
                <div className="grid gap-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {system.category}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-heading text-2xl font-light">{system.name}</h3>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium">{system.price}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
