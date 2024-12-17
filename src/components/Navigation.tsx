import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";
import { ReactNode } from "react";

type Page = {
  path: string,
  name: string,
  selected?: boolean,
}

export default function Navigation() {
  const location = useLocation();
  const selected = location.pathname;

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

  return <header className="App-header">
    <h1>TickTrack</h1>
    <Tabs>
      {pages.map(page => <Tab selected={page.selected} path={page.path} name={page.name} />)}
    </Tabs>
  </header>
}

function Tabs(props: { children?: ReactNode }) {
  return <nav className={styles.tabs}>
    {props.children}
  </nav>
}

function Tab(props: Page) {
  const classes = [styles.tab];
  if (props.selected) classes.push(styles['tab--selected']);

  return <Link className={classes.join(' ')} key={props.name} to={props.path}>{props.name}</Link>
}