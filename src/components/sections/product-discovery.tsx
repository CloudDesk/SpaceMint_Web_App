import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/primitives/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { webImages } from "@/data/web-images";
import { fadeUp, staggerContainer } from "@/lib/animation";

const shopCategories = [
  {
    name: "Modular Kitchens",
    href: routes.collection("kitchens"),
    image: webImages.kitchenModular,
  },
  {
    name: "Living Room Furniture",
    href: routes.collection("living-room-furniture"),
    image: webImages.livingRoom,
  },
  {
    name: "Bedroom Wardrobes",
    href: routes.collection("bedroom-wardrobes"),
    image: webImages.wardrobe,
  },
  {
    name: "TV Units",
    href: routes.collection("living-room-furniture"),
    image: webImages.tvUnit,
  },
  {
    name: "Beds & Side Tables",
    href: routes.collection("bedroom-wardrobes"),
    image: webImages.bedStorage,
  },
  {
    name: "Other Furniture",
    href: routes.collection("other-furniture"),
    image: webImages.otherFurniture,
  },
] as const;

const topSystems = [
  {
    name: "Luxe Steel Kitchen",
    category: "Kitchen",
    price: "From Rs. 4.8L",
    image: webImages.kitchenModular,
  },
  {
    name: "Full Wall Wardrobe",
    category: "Bedroom Wardrobes",
    price: "From Rs. 2.2L",
    image: webImages.wardrobeWide,
  },
  {
    name: "Floating TV System",
    category: "Living Room Furniture",
    price: "From Rs. 1.6L",
    image: webImages.tvUnit,
  },
  {
    name: "Storage Bed Suite",
    category: "Bedroom Furniture",
    price: "From Rs. 1.4L",
    image: webImages.bedStorage,
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
            <Button asChild variant="secondary">
              <a href={routes.products}>
                View all
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
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
            {/*
            <Button className="hidden sm:inline-flex" variant="secondary">
              Book visit
            </Button>
            */}
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
