"use client";

import { useState, useEffect } from "react";
import styles from "./outfits.module.css";

type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color?: string;
  brand?: string;
};

type Outfit = {
  id: string;
  name: string;
  occasion?: string;
  createdAt: string;
  wardrobeItems: WardrobeItem[];
};

const OCCASIONS = ["Casual", "Formal", "Party", "Work", "Sports", "Travel", "Date Night"];

export default function OutfitsPage() {
  const [outfits, setOutfits]     = useState<Outfit[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState({ name: "", occasion: "Casual", itemIds: [] as string[] });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  async function load() {
    setError("");
    try {
      const [outfitsRes, wardrobeRes] = await Promise.all([
        fetch("/api/outfits"),
        fetch("/api/wardrobe"),
      ]);

      const outfitsData = await outfitsRes.json();
      const wardrobeData = await wardrobeRes.json();

      setOutfits(Array.isArray(outfitsData) ? outfitsData : []);
      setWardrobeItems(Array.isArray(wardrobeData) ? wardrobeData : []);
    } catch {
      setOutfits([]);
      setWardrobeItems([]);
      setError("Failed to load outfits.");
    }
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function handleSave() {
    setError("");
    if (!form.name) {
      setError("Outfit name is required.");
      return;
    }

    if (form.itemIds.length === 0) {
      setError("Select at least one wardrobe item.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/outfits", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setSaving(false);
      setError(data?.error ?? "Failed to create outfit.");
      return;
    }

    setSaving(false);
    setModalOpen(false);
    setForm({ name: "", occasion: "Casual", itemIds: [] });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this outfit?")) return;
    await fetch(`/api/outfits/${id}`, { method: "DELETE" });
    load();
  }

  function toggleItem(itemId: string) {
    setForm((prev) => {
      const exists = prev.itemIds.includes(itemId);
      return {
        ...prev,
        itemIds: exists ? prev.itemIds.filter((id) => id !== itemId) : [...prev.itemIds, itemId],
      };
    });
  }

  function openCreateModal() {
    setError("");
    setForm({ name: "", occasion: "Casual", itemIds: [] });
    setModalOpen(true);
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Outfits</h1>
          <p className={styles.pageSubtitle}>{outfits.length} outfits saved</p>
        </div>
        <button className={styles.addBtn} onClick={openCreateModal}>
          + Create Outfit
        </button>
      </div>

      {error && <div className={styles.errorAlert}>⚠ {error}</div>}

      {/* Grid */}
      {loading ? (
        <p style={{ color: "#9e9690", fontSize: "0.875rem" }}>Loading outfits...</p>
      ) : (
        <div className={styles.grid}>
          {outfits.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✨</div>
              <h3 className={styles.emptyTitle}>No outfits yet</h3>
              <p className={styles.emptyDesc}>Create your first outfit combination!</p>
              <button className={styles.addBtn} onClick={openCreateModal}>
                + Create First Outfit
              </button>
            </div>
          ) : (
            outfits.map(outfit => (
              <div key={outfit.id} className={styles.outfitCard}>
                <div className={styles.outfitTop}>✨</div>
                <div className={styles.outfitBody}>
                  <div className={styles.outfitName}>{outfit.name}</div>
                  {outfit.occasion && (
                    <div className={styles.outfitOccasion}>📍 {outfit.occasion}</div>
                  )}

                  <div className={styles.linkedItems}>
                    <div className={styles.linkedCount}>
                      {outfit.wardrobeItems.length} item{outfit.wardrobeItems.length === 1 ? "" : "s"}
                    </div>
                    <div className={styles.itemChips}>
                      {outfit.wardrobeItems.slice(0, 3).map((item) => (
                        <span key={item.id} className={styles.itemChip}>
                          {item.name}
                        </span>
                      ))}
                      {outfit.wardrobeItems.length > 3 && (
                        <span className={styles.itemChip}>+{outfit.wardrobeItems.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.outfitMeta}>
                    <span className={styles.outfitDate}>
                      {new Date(outfit.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className={styles.deleteOutfitBtn}
                      onClick={() => handleDelete(outfit.id)}
                    >🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Create New Outfit</h2>

            {error && <div className={styles.errorAlert}>⚠ {error}</div>}

            <div className={styles.formField}>
              <label className={styles.formLabel}>Outfit Name *</label>
              <input
                className={styles.formInput}
                placeholder="e.g. Monday Office Look"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Occasion</label>
              <select
                className={styles.formSelect}
                value={form.occasion}
                onChange={e => setForm({...form, occasion: e.target.value})}
              >
                {OCCASIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Select Wardrobe Items *</label>
              {wardrobeItems.length === 0 ? (
                <p className={styles.helperText}>Add wardrobe items first to create outfits.</p>
              ) : (
                <div className={styles.itemPicker}>
                  {wardrobeItems.map((item) => {
                    const selected = form.itemIds.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`${styles.pickItemBtn} ${selected ? styles.pickItemBtnActive : ""}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <span className={styles.pickItemName}>{item.name}</span>
                        <span className={styles.pickItemMeta}>{item.category}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Create Outfit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}