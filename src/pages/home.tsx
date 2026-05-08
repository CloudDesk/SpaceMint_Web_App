import { HeroCarousel } from "@/components/sections/hero-carousel";
import { ProductDiscovery } from "@/components/sections/product-discovery";
import { RoomShowcase } from "@/components/sections/room-showcase";

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <RoomShowcase />
      <ProductDiscovery />
    </>
  );
}
