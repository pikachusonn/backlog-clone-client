"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { HiEllipsisVertical } from "react-icons/hi2";
import styles from "./style.module.css";
import { SiCdprojekt, SiRiotgames } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const CorporationMenu = () => {
  const [value, setValue] = useState<string | undefined>("Premier"); // open by default

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={styles.customTrigger}>
            <HiEllipsisVertical size={20}/>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex flex-col w-[300px] gap-1">
              <li onClick={() => setValue("Premier")}>
                <NavigationMenuLink
                  asChild
                  className={`${
                    value === "Premier" ? "!bg-black !text-white" : ""
                  }`}
                >
                  <Link href="/docs">
                    <div className="flex items-center gap-3">
                      <SiRiotgames size={30} className="text-red-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Premier</div>
                        <p
                          className={`${
                            value === "Premier"
                              ? "text-white"
                              : "text-muted-foreground"
                          } text-sm`}
                        >
                          Last visit: {format(new Date(), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          value === "Premier" ? "text-white" : "text-black"
                        }`}
                      >
                        20+
                      </Badge>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li onClick={() => setValue("CD Projekt Red")}>
                <NavigationMenuLink
                  asChild
                  className={`${
                    value === "CD Projekt Red" ? "bg-black text-white" : ""
                  }`}
                >
                  <Link href="/docs">
                    <div className="flex items-center gap-3">
                      <SiCdprojekt size={30} className="text-red-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          CD Projekt Red
                        </div>
                        <p
                          className={`${
                            value === "CD Projekt Red"
                              ? "text-white"
                              : "text-muted-foreground"
                          } text-sm`}
                        >
                          Last visit: {format(new Date(), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          value === "CD Projekt Red"
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        11
                      </Badge>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default CorporationMenu;
