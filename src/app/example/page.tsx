"use client";

import { queryTexts } from "@/api/weaviate";
import styles from "./page.module.css";
import { useEffect } from "react";
import { WeaviateField } from "weaviate-client";
import { useState } from "react";

export default function Example() {
  const [data, setData] = useState<WeaviateField[]>([]);
  useEffect(() => {
    queryTexts("data").then((data) => setData(data));
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {data.map((value, i) => (
          <p key={i}>{String(value)}</p>
        ))}
      </main>
    </div>
  );
}
