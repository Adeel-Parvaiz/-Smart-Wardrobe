"use client";

import { useState, useEffect } from "react";
import styles from "./outfits.module.css";

type Outfit = {
  id: string;
  name: string;
  occasion?: string;
  createdAt: string;
};

const OCCASIONS = ["Casual", "Formal", "Party", "Work", "Sports", "Travel", "Date Night"];

export default function OutfitsPage() {
  const [outfits, setOutfits]     = useState<Outfit[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState({ name: "", occasion: "Casual" });
  const [saving, setSaving]       = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/outfits");
      const data = await res.json();
      setOutfits(Array.isArray(data) ? data : []);
    } catch {
      setOutfits([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name) return;
    setSaving(true);
    await fetch("/api/outfits", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    setForm({ name: "", occasion: "Casual" });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this outfit?")) return;
    await fetch(`/api/outfits/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Outfits</h1>
          <p className={styles.pageSubtitle}>{outfits.length} outfits saved</p>
        </div>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          + Create Outfit
        </button>
      </div>

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
              <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
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