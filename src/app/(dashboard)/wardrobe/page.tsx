"use client";

import { useState, useEffect } from "react";
import styles from "./wardrobe.module.css";

const CATEGORIES = ["All", "Tops", "Bottoms", "Shoes", "Accessories", "Outerwear", "Formal"];

type Item = {
  id: string;
  name: string;
  category: string;
  color?: string;
  brand?: string;
};

export default function WardrobePage() {
  const [items, setItems]         = useState<Item[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Item | null>(null);
  const [form, setForm]           = useState({ name: "", category: "Tops", color: "", brand: "" });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/wardrobe");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || i.category === filter;
    return matchSearch && matchFilter;
  });

  function openAdd() {
    setEditing(null);
    setForm({ name: "", category: "Tops", color: "", brand: "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, color: item.color ?? "", brand: item.brand ?? "" });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name) { setError("Item name is required"); return; }
    setSaving(true);
    const url    = editing ? `/api/wardrobe/${editing.id}` : "/api/wardrobe";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Wardrobe</h1>
          <p className={styles.pageSubtitle}>{items.length} items total</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          + Add Item
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterPill} ${filter === cat ? styles.filterPillActive : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonText} />
              <div className={`${styles.skeletonText} ${styles.skeletonTextShort}`} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.grid}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👗</div>
            <h3 className={styles.emptyTitle}>
              {search || filter !== "All" ? "No items match" : "Your wardrobe is empty"}
            </h3>
            <p className={styles.emptyDesc}>
              {search || filter !== "All" ? "Try different search or filter" : "Start adding your clothes!"}
            </p>
            {!search && filter === "All" && (
              <button className={styles.addBtn} onClick={openAdd}>+ Add First Item</button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder}>
                  {item.category === "Tops"       ? "👕" :
                   item.category === "Bottoms"    ? "👖" :
                   item.category === "Shoes"      ? "👟" :
                   item.category === "Outerwear"  ? "🧥" :
                   item.category === "Formal"     ? "👔" :
                   item.category === "Accessories"? "👜" : "👗"}
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                    onClick={() => openEdit(item)}
                  >✏</button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                    onClick={() => handleDelete(item.id)}
                  >🗑</button>
                </div>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemCategory}>{item.category}</div>
                {item.brand && <div className={styles.itemBrand}>{item.brand}</div>}
                {item.color && <span className={styles.colorBadge}>{item.color}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editing ? "Edit Item" : "Add New Item"}
            </h2>

            {error && <div className={styles.formError}>{error}</div>}

            <div className={styles.formField}>
              <label className={styles.formLabel}>Item Name *</label>
              <input
                className={styles.formInput}
                placeholder="e.g. Blue Denim Jacket"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Category *</label>
              <select
                className={styles.formSelect}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Color</label>
                <input
                  className={styles.formInput}
                  placeholder="e.g. Navy Blue"
                  value={form.color}
                  onChange={e => setForm({...form, color: e.target.value})}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Brand</label>
                <input
                  className={styles.formInput}
                  placeholder="e.g. Zara"
                  value={form.brand}
                  onChange={e => setForm({...form, brand: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}