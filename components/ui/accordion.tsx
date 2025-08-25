"use client"; // Indica que este archivo se ejecuta en cliente (Next.js 13+ app directory)

import * as AccordionPrimitive from "@radix-ui/react-accordion"; // Importa el paquete base de Radix Accordion
import { ChevronDown } from "lucide-react"; // Icono de flecha para el trigger
import * as React from "react";

import { cn } from "@/lib/utils"; // Función utilitaria para concatenar clases CSS condicionalmente

// Exportamos el componente raíz Accordion que es simplemente AccordionPrimitive.Root
const Accordion = AccordionPrimitive.Root;

// Extiende el tipo de AccordionItem para incluir la propiedad estática `displayName`
type AccordionItemType = React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
    React.RefAttributes<React.ElementRef<typeof AccordionPrimitive.Item>>
> & {
  displayName?: string;
};

// Wrapper para AccordionItem con ForwardRef para pasar referencias correctamente
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Clase CSS para borde inferior + clases pasadas como prop
    {...props}
  />
)) as AccordionItemType;

// Asignamos la propiedad estática `displayName` para que TypeScript no marque error al usar esta propiedad fuera del componente
// Asignar displayName para mejor depuración en React DevTools
AccordionItem.displayName = "AccordionItem";

// Wrapper para el trigger del accordion (el encabezado clickeable)
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

// Asignar displayName para mejor depuración en React DevTools
AccordionTrigger.displayName = "AccordionTrigger";

// Wrapper para el contenido colapsable de Accordion
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
