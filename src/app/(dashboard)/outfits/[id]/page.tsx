"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import styles from "./outfit-detail.module.css";
import Link from "next/link";

type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color?: string;
  brand?: string;
  imageUrl?: string;
};

type Outfit = {
  id: string;
  name: string;
  occasion?: string;
  createdAt: string;
  wardrobeItems: WardrobeItem[];
};

export default function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOutfit() {
      try {
        const res = await fetch(`/api/outfits/${id}`);
        if (!res.ok) throw new Error("Failed to load outfit");
        const data = await res.json();
        setOutfit(data);
      } catch (err) {
        setError("Outfit not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadOutfit();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading outfit details...</div>;
  if (error || !outfit) return <div className={styles.error}>{error || "Outfit not found"}</div>;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        ← Back to Outfits
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>{outfit.name}</h1>
        {outfit.occasion && <span className={styles.occasion}>📍 {outfit.occasion}</span>}
      </header>

      <div className={styles.grid}>
        {outfit.wardrobeItems.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.imageContainer}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
              ) : (
                <div className={styles.imagePlaceholder}>👕</div>
              )}
            </div>
            <div className={styles.itemInfo}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemCategory}>{item.category}</p>
              <div className={styles.itemMeta}>
                {item.color && <span className={styles.badge}>{item.color}</span>}
                {item.brand && <span className={styles.badge}>{item.brand}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
