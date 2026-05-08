import { ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/catalog";
import { fadeUp } from "@/lib/animation";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article variants={fadeUp} className="group">
      <div className="relative overflow-hidden rounded-md border bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="sm-image-treatment aspect-[4/5] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.025]"
          loading="lazy"
        />
        <Button
          aria-label={`Save ${product.name}`}
          className="absolute right-3 top-3 bg-background/88 backdrop-blur"
          size="icon"
          variant="secondary"
        >
          <Heart className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="grid gap-4 border-x border-b p-card-pad">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-eyebrow font-semibold uppercase text-muted-foreground">
            <span>{product.category}</span>
            <span>{product.price}</span>
          </div>
          <h3 className="font-heading text-2xl font-light">{product.name}</h3>
          <p className="min-h-14 text-sm leading-6 text-muted-foreground">{product.description}</p>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button className="w-full justify-between" variant="secondary">
              View Details
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <p className="text-eyebrow font-semibold uppercase text-muted-foreground">
                {product.category}
              </p>
              <ModalTitle className="font-heading text-h3 font-light">
                {product.name}
              </ModalTitle>
              <ModalDescription className="text-base leading-7 text-muted-foreground">
                {product.description}
              </ModalDescription>
            </ModalHeader>
            <img
              src={product.image}
              alt={product.name}
              className="sm-image-treatment aspect-[16/10] w-full rounded-md object-cover"
            />
            <div className="grid gap-3 border-y py-5 text-sm sm:grid-cols-2">
              <p>
                <span className="block text-muted-foreground">Starting investment</span>
                <strong className="font-medium">{product.price}</strong>
              </p>
              <p>
                <span className="block text-muted-foreground">Finish direction</span>
                <strong className="font-medium">{product.finish}</strong>
              </p>
            </div>
            <Button>Book Design Consultation</Button>
          </ModalContent>
        </Modal>
      </div>
    </motion.article>
  );
}
