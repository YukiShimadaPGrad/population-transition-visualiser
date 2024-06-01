import styles from "./page.module.css";
import { Example } from "@/app/Example";

export default function Home() {
  return (
    <main className={styles.main}>
      <Example />
    </main>
  );
}
