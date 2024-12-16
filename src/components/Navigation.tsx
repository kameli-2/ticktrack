import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const location = useLocation();
  const selected = location.pathname;

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

  pages.forEach(page => page.selected = page.path === selected);
  const currentPage = pages.find(page => page.selected);

  return <header className="App-header">
    <h1>{currentPage?.name || 'Time Tracker'}</h1>
    <nav className={styles.navigation}>
      {pages.filter(page => !page.selected).map(page => <Link key={page.name} to={page.path}>{page.name}</Link>)}
    </nav>
  </header>
}