import { Link } from "react-router";

export default function Navigation(props: { selected: string }) {
  const { selected } = props;

  type Page = {
    path: string,
    name: string,
    selected?: boolean,
  }

  const pages: Page[] = [
    {
      path: "/",
      name: "Time Tracker",
    },
    {
      path: "/todo",
      name: "Todos",
    }
  ];
  
  pages.forEach(page => page.selected = page.path === selected );

  return <nav>
    {pages.filter(page => !page.selected).map(page => <Link key={page.name} to={page.path}>{page.name}</Link>)}
  </nav>
}