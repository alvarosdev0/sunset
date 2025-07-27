"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function MenuNav() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Inicio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">Sunset</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Somos una página dedicada al rating de tus películas y
                      series favoritas con funciones que cualquier cinéfilo
                      necesita.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/blog/top100" title="Selección del editor">
                Una lista de 100 películas destacadas ordenadas por el editor.
              </ListItem>
              <ListItem
                href="/blog/seriesantesdemorir"
                title="Series para ver antes de morir"
              >
                Nos encargamos de recolectar las series más respetadas por el
                público.
              </ListItem>
              <ListItem
                href="/blog/FAQ#Quienessomos"
                title="¿Somos un sitio cualquiera?"
              >
                Respondiendo las preguntas más frecuentes sobre nuestro sitio.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Series</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Estrenos</div>

                    {/* <div className="text-muted-foreground">
                      Series populares
                    </div> */}
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Series populares</div>
                    {/* <div className="text-muted-foreground">Estrenos</div> */}
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Favoritas del público</div>
                    {/* <div className="text-muted-foreground">
                      Read our latest blog posts.
                    </div> */}
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Películas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Estrenos</div>
                    {/* <div className="text-muted-foreground">
                      Películas populares
                    </div> */}
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    {/* <div className="text-muted-foreground">Estrenos</div> */}
                    <div className="font-medium">Películas populares</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Favoritas del público</div>
                    {/* <div className="text-muted-foreground">
                      Favoritas del público
                    </div> */}
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
