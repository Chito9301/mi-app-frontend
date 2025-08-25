import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as React from "react";

export interface CheckboxItemWithUsernameProps
  extends React.ComponentPropsWithoutRef<
    typeof ContextMenuPrimitive.CheckboxItem
  > {
  displayName?: string; // prop personalizada
}

const CheckboxItemWithUsername = React.forwardRef<
  HTMLDivElement,
  CheckboxItemWithUsernameProps
>((props, ref) => {
  const { displayName, ...restProps } = props;

  // Puedes usar `displayName` internamente para lógica, estilos o efectos si quieres
  // Ejemplo: console.log("Username en CheckboxItem:", displayName);

  return <ContextMenuPrimitive.CheckboxItem ref={ref} {...restProps} />;
});

// Asignar displayName para mejor depuración en React DevTools
CheckboxItemWithUsername.displayName = "CheckboxItemWithUsername";

export default CheckboxItemWithUsername;
