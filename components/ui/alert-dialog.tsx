"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

type AlertDialogOverlayType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> &
    React.RefAttributes<HTMLDivElement>
> & { displayName?: string };

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
)) as AlertDialogOverlayType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogOverlay.displayName =
  AlertDialogPrimitive.Overlay.displayName || "AlertDialogOverlay";

type AlertDialogContentType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> &
    React.RefAttributes<HTMLDivElement>
> & { displayName?: string };

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
)) as AlertDialogContentType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogContent.displayName =
  AlertDialogPrimitive.Content.displayName || "AlertDialogContent";

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
// Asignar displayName para mejor depuración en React DevTools
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
// Asignar displayName para mejor depuración en React DevTools
AlertDialogFooter.displayName = "AlertDialogFooter";

type AlertDialogTitleType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> &
    React.RefAttributes<HTMLDivElement>
> & { displayName?: string };

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
)) as AlertDialogTitleType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogTitle.displayName =
  AlertDialogPrimitive.Title.displayName || "AlertDialogTitle";

type AlertDialogDescriptionType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> &
    React.RefAttributes<HTMLDivElement>
> & { displayName?: string };

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)) as AlertDialogDescriptionType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName || "AlertDialogDescription";

type AlertDialogActionType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
    React.RefAttributes<HTMLButtonElement>
> & { displayName?: string };

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
)) as AlertDialogActionType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogAction.displayName =
  AlertDialogPrimitive.Action.displayName || "AlertDialogAction";

type AlertDialogCancelType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> &
    React.RefAttributes<HTMLButtonElement>
> & { displayName?: string };

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
)) as AlertDialogCancelType;

// Asignar displayName para mejor depuración en React DevTools
AlertDialogCancel.displayName =
  AlertDialogPrimitive.Cancel.displayName || "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
