import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Modal = Dialog.Root;
const ModalTrigger = Dialog.Trigger;
const ModalClose = Dialog.Close;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Content
      ref={ref}
      data-lenis-prevent
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid max-h-[86vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-5 overflow-auto rounded-lg border bg-background p-6 shadow-elevated duration-smooth data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-8",
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
ModalContent.displayName = Dialog.Content.displayName;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2 pr-12", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

const ModalTitle = Dialog.Title;
const ModalDescription = Dialog.Description;

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
