import { CircleNotch } from "@phosphor-icons/react";
import { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Separator } from "./separator";
import { SidebarTrigger } from "./sidebar";

type Breadcrumb = {
  name: string | null | undefined;
  path?: string;
};

type PageProps = {
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
  loading?: boolean;
};

export default function Page({ children, breadcrumbs, loading }: PageProps) {
  const markup: ReactNode[] = [];

  breadcrumbs.forEach(({ name, path }, index) => {
    if (index > 0) {
      markup.push(<BreadcrumbSeparator key={`breadcrumb-separator-${path}`} />);
    }

    markup.push(
      <BreadcrumbItem key={`breadcrumb-${!path ? "page" : "link"}-${name}`}>
        {!path ? (
          <BreadcrumbPage>{name}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={path ?? "#"}>{name}</BreadcrumbLink>
        )}
      </BreadcrumbItem>,
    );
  });

  return (
    <div className="relative p-4">
      {loading && (
        <CircleNotch weight="bold" size={20} className="fixed top-4 right-4">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
          ></animate>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="0.6s"
            from="0 0 0"
            to="360 0 0"
            repeatCount="indefinite"
          ></animateTransform>
        </CircleNotch>
      )}
      <div className="flex items-center mb-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="ml-2 mr-4 h-4" />
        <Breadcrumb>
          <BreadcrumbList>{markup}</BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </div>
  );
}
