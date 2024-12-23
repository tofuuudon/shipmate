import { Blueprint, Cube, HouseSimple } from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const items = [
  {
    title: "Home",
    url: "/app",
    icon: <HouseSimple weight="bold" />,
  },
  {
    title: "Catalog",
    url: "/app/catalog",
    icon: <Cube weight="bold" />,
  },
  {
    title: "Build",
    url: "/app/build",
    icon: <Blueprint weight="bold" />,
  },
];

type AppSidebarProps = {
  avatarUrl: string;
  name: string | null;
  username: string;
};

export function AppSidebar({ avatarUrl, name, username }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <SidebarMenuButton>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback className="rounded-lg">Me</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{name ?? username}</span>
              {Boolean(name) && (
                <span className="truncate text-xs">{username}</span>
              )}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
