"use client";

import { useEffect, useState } from "react";
import {
    Store,
    Camera,
    AlertTriangle,
    MapPin,
    Plus,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreItem {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    owner?: { name: string; email: string };
    _count?: { cameras: number; alerts: number };
}

export default function StoresPage() {
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newStore, setNewStore] = useState({ name: "", address: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = () => {
        fetch("/api/stores")
            .then((res) => res.json())
            .then((data) => {
                setStores(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleAddStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStore.name || !newStore.address) return;
        setSaving(true);

        try {
            // Use first available user as owner (MVP)
            await fetch("/api/stores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newStore.name,
                    address: newStore.address,
                    ownerId: "demo-owner", // Will be replaced with session user in production
                }),
            });
            setNewStore({ name: "", address: "" });
            setShowAdd(false);
            fetchStores();
        } catch (err) {
            console.error("Failed to add store:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Stores
                    </h1>
                    <p className="text-muted mt-1">
                        Manage your retail locations and camera setups
                    </p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                >
                    {showAdd ? <X size={14} /> : <Plus size={14} />}
                    {showAdd ? "Cancel" : "Add Store"}
                </button>
            </div>

            {/* Add Store Form */}
            {showAdd && (
                <form
                    onSubmit={handleAddStore}
                    className="rounded-2xl border border-primary/20 bg-surface p-6 space-y-4 animate-fade-in"
                >
                    <h3 className="text-sm font-semibold text-white">New Store</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                                Store Name
                            </label>
                            <input
                                type="text"
                                value={newStore.name}
                                onChange={(e) =>
                                    setNewStore((s) => ({ ...s, name: e.target.value }))
                                }
                                placeholder="e.g. Downtown Grocery"
                                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                                Address
                            </label>
                            <input
                                type="text"
                                value={newStore.address}
                                onChange={(e) =>
                                    setNewStore((s) => ({ ...s, address: e.target.value }))
                                }
                                placeholder="e.g. 123 Main Street"
                                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Store"}
                    </button>
                </form>
            )}

            {/* Stores Grid */}
            {loading ? (
                <div className="text-center py-12 text-muted text-sm">
                    Loading stores...
                </div>
            ) : stores.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                    <Store size={48} className="text-muted mx-auto mb-3" />
                    <p className="text-muted">No stores yet</p>
                    <p className="text-xs text-muted/60 mt-1">
                        Click &quot;Add Store&quot; to get started
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map((store, i) => (
                        <div
                            key={store.id}
                            className="rounded-2xl border border-border bg-surface p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all animate-fade-in group"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                                    <Store size={22} className="text-primary-light" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {store.name}
                            </h3>
                            <p className="flex items-center gap-1.5 text-sm text-muted mb-4">
                                <MapPin size={13} />
                                {store.address}
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-1.5">
                                    <Camera size={14} className="text-accent" />
                                    <span className="text-sm text-muted">
                                        {store._count?.cameras || 0} cameras
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertTriangle
                                        size={14}
                                        className={cn(
                                            (store._count?.alerts || 0) > 0
                                                ? "text-warning"
                                                : "text-success"
                                        )}
                                    />
                                    <span className="text-sm text-muted">
                                        {store._count?.alerts || 0} alerts
                                    </span>
                                </div>
                            </div>
                            {store.owner && (
                                <p className="text-xs text-muted/60 mt-3">
                                    Owner: {store.owner.name}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
