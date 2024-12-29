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
};

export default function Page({ children, breadcrumbs }: PageProps) {
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
    <div className="p-4">
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
