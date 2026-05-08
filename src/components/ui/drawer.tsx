import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Drawer = Dialog.Root;
const DrawerTrigger = Dialog.Trigger;
const DrawerClose = Dialog.Close;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-background p-6 shadow-elevated duration-smooth data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:p-8",
        className,
      )}
      {...props}
    >
      {children}
      <Dialog.Close className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-sm border border-border bg-background transition-colors hover:bg-accent">
        <X className="size-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
DrawerContent.displayName = Dialog.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2 pr-12", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = Dialog.Title;
const DrawerDescription = Dialog.Description;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
