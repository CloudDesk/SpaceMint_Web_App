import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "@/data/catalog";
import { fadeUp } from "@/lib/animation";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.a
      href={category.href}
      variants={fadeUp}
      className="group grid min-h-[28rem] content-end overflow-hidden rounded-md border bg-card"
    >
      <img
        src={category.image}
        alt={category.name}
        className="sm-image-treatment col-start-1 row-start-1 h-full min-h-[28rem] w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="col-start-1 row-start-1 flex min-h-[28rem] flex-col justify-end bg-gradient-to-t from-[#111111]/70 via-[#111111]/12 to-transparent p-card-pad text-white">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-eyebrow font-semibold uppercase">Space Mint</p>
            <h3 className="font-heading text-h3 font-light">{category.name}</h3>
            <p className="max-w-md text-sm leading-6 text-white/82">{category.description}</p>
          </div>
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/42 transition-colors group-hover:bg-white group-hover:text-foreground">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
