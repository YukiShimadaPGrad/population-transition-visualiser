import styles from "./page.module.scss";
import { Example } from "@/app/Example";

export default function Home() {
  return (
    <main className={styles.main}>
      <Example />
    </main>
  );
}
