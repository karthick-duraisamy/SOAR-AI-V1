"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, } from "lucide-react";
import { cn } from "./utils";
function Select({ ...props }) {
    return _jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectGroup({ ...props }) {
    return _jsx(SelectPrimitive.Group, { "data-slot": "select-group", ...props });
}
function SelectValue({ ...props }) {
    return _jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({ className, size = "default", children, ...props }) {
    return (_jsxs(SelectPrimitive.Trigger, { "data-slot": "select-trigger", "data-size": size, className: cn("flex w-full items-center justify-between gap-2 rounded-lg bg-dropdown-background border border-dropdown-border px-4 py-3 text-sm text-dropdown-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground hover:bg-gray-100 transition-colors duration-200 data-[size=default]:min-h-[48px] data-[size=sm]:min-h-[40px] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0", className), ...props, children: [children, _jsx(SelectPrimitive.Icon, { asChild: true, children: _jsx(ChevronDownIcon, { className: "h-5 w-5 text-gray-400 flex-shrink-0" }) })] }));
}
function SelectContent({ className, children, position = "popper", ...props }) {
    return (_jsx(SelectPrimitive.Portal, { children: _jsxs(SelectPrimitive.Content, { "data-slot": "select-content", className: cn("relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-lg bg-white border border-gray-200 text-gray-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className), position: position, sideOffset: 4, ...props, children: [_jsx(SelectScrollUpButton, {}), _jsx(SelectPrimitive.Viewport, { "data-slot": "select-viewport", className: cn("p-1", position === "popper" &&
                        "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"), children: children }), _jsx(SelectScrollDownButton, {})] }) }));
}
function SelectLabel({ className, ...props }) {
    return (_jsx(SelectPrimitive.Label, { "data-slot": "select-label", className: cn("text-muted-foreground px-2 py-1.5 text-xs", className), ...props }));
}
function SelectItem({ className, children, ...props }) {
    return (_jsxs(SelectPrimitive.Item, { "data-slot": "select-item", className: cn("relative flex w-full cursor-default select-none items-center gap-2 rounded-md px-3 py-2.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900 hover:bg-gray-50 transition-colors [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className), ...props, children: [_jsx("span", { className: "absolute right-3 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(SelectPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { className: "h-4 w-4" }) }) }), _jsx(SelectPrimitive.ItemText, { "data-slot": "select-item-text", children: children })] }));
}
function SelectSeparator({ className, ...props }) {
    return (_jsx(SelectPrimitive.Separator, { "data-slot": "select-separator", className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className), ...props }));
}
function SelectScrollUpButton({ className, ...props }) {
    return (_jsx(SelectPrimitive.ScrollUpButton, { "data-slot": "select-scroll-up-button", className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(ChevronUpIcon, { className: "size-4" }) }));
}
function SelectScrollDownButton({ className, ...props }) {
    return (_jsx(SelectPrimitive.ScrollDownButton, { "data-slot": "select-scroll-down-button", className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(ChevronDownIcon, { className: "size-4" }) }));
}
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, };
