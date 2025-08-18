"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";
function Tabs({ className, ...props }) {
    return (_jsx(TabsPrimitive.Root, { "data-slot": "tabs", className: cn("flex flex-col gap-2", className), ...props }));
}
function TabsList({ className, ...props }) {
    return (_jsx(TabsPrimitive.List, { "data-slot": "tabs-list", className: cn("inline-flex w-full items-center justify-start bg-gray-50/50 p-1 rounded-xl border border-gray-200/50 gap-1", className), ...props }));
}
function TabsTrigger({ className, children, ...props }) {
    return (_jsxs(TabsPrimitive.Trigger, { "data-slot": "tabs-trigger", className: cn("relative inline-flex flex-col items-center justify-center gap-5 px-6 py-0 text-[18px] font-normal leading-[24px] text-tabs-inactive-text whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-tabs-active-text [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className), ...props, children: [_jsx("div", { className: "flex flex-row gap-2.5 items-center justify-center", children: children }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[1px] bg-tabs-active-border opacity-0 transition-opacity data-[state=active]:opacity-100" })] }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Content, { "data-slot": "tabs-content", className: cn("flex-1 outline-none", className), ...props }));
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
