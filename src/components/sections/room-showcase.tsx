import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/primitives/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { webImages } from "@/data/web-images";
import { fadeUp, staggerContainer } from "@/lib/animation";
import { cn } from "@/lib/utils";

const roomFeatures = [
  {
    id: "kitchens",
    room: "Kitchen",
    title: "Kitchen systems",
    eyebrow: "Modular kitchens",
    description: "Cabinets, countertops, utility storage, shutters, and stainless modules.",
    price: "From Rs. 4.8L",
    image: webImages.kitchenModular,
    size: "featured",
  },
  {
    id: "living-room-furniture",
    room: "Living Room",
    title: "Living room furniture",
    eyebrow: "Living room",
    description: "TV units, sofa walls, consoles, display shelves, and concealed storage.",
    price: "From Rs. 2.2L",
    image: webImages.tvUnit,
    size: "compact",
  },
  {
    id: "bedroom-wardrobes",
    room: "Bedroom",
    title: "Bedroom wardrobes",
    eyebrow: "Bedroom",
    description: "Wardrobes, storage beds, dressers, side tables, and room-fitted furniture.",
    price: "From Rs. 1.6L",
    image: webImages.wardrobe,
    size: "compact",
  },
] as const;

export function RoomShowcase() {
  const featured = roomFeatures[0];
  const compactRooms = roomFeatures.slice(1);

  return (
    <section className="border-b bg-background py-6 sm:py-8" aria-label="Shop by room">
      <Container>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
              Shop by room
            </p>
            <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl">
              Planned rooms, not loose pieces.
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button aria-label="Previous room feature" size="icon" variant="secondary">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button aria-label="Next room feature" size="icon" variant="secondary">
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <motion.div
          className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          <RoomFeatureCard room={featured} variant="featured" />

          <div className="grid gap-4">
            {compactRooms.map((room) => (
              <RoomFeatureCard key={room.id} room={room} variant="compact" />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

type RoomFeatureCardProps = {
  room: (typeof roomFeatures)[number];
  variant: "featured" | "compact";
};

function RoomFeatureCard({ room, variant }: RoomFeatureCardProps) {
  return (
    <motion.a
      className={cn(
        "group grid overflow-hidden rounded-lg border bg-card",
        variant === "featured" && "lg:min-h-[35rem]",
      )}
      href={routes.collection(room.id)}
      id={room.id}
      variants={fadeUp}
    >
      <div className="relative overflow-hidden bg-muted">
        <img
          alt={`${room.room} by Space Mint`}
          className={cn(
            "sm-image-treatment w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.025]",
            variant === "featured" && "aspect-[16/9] lg:aspect-[16/9]",
            variant === "compact" && "aspect-[16/7] sm:aspect-[16/6]",
          )}
          loading="lazy"
          src={room.image}
        />
        <span className="absolute left-4 top-4 rounded-sm bg-background/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
          {room.eyebrow}
        </span>
      </div>

      <div
        className={cn(
          "grid gap-5 bg-card p-card-pad",
          variant === "featured" && "sm:grid-cols-[1fr_auto] sm:items-end sm:p-6",
          variant === "compact" && "sm:grid-cols-[1fr_auto] sm:items-end",
        )}
      >
        <div className="space-y-2">
          <h3
            className={cn(
              "font-heading font-light text-foreground",
              variant === "featured" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            )}
          >
            {room.title}
          </h3>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {room.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm">
            <span className="block text-muted-foreground">Starting from</span>
            <strong className="text-base font-medium">{room.price}</strong>
          </p>
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border bg-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
