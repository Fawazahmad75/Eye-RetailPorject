"use client";

import { useEffect, useState, useCallback } from "react";
import {
    AlertTriangle,
    Filter,
    RefreshCw,
} from "lucide-react";
import AlertTable from "@/components/AlertTable";
import { cn } from "@/lib/utils";

interface Alert {
    id: string;
    type: string;
    severity: string;
    status: string;
    createdAt: string;
    camera?: { name: string };
    store?: { name: string };
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: "", severity: "" });

    const fetchAlerts = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter.status) params.set("status", filter.status);
        if (filter.severity) params.set("severity", filter.severity);

        fetch(`/api/alerts?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setAlerts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [filter]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await fetch("/api/alerts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            fetchAlerts();
        } catch (err) {
            console.error("Failed to update alert:", err);
        }
    };

    const statusOptions = ["", "NEW", "ACKNOWLEDGED", "RESOLVED"];
    const severityOptions = ["", "LOW", "MEDIUM", "HIGH"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Alerts
                    </h1>
                    <p className="text-muted mt-1">
                        Manage shelf monitoring alerts across all stores
                    </p>
                </div>
                <button
                    onClick={fetchAlerts}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-muted" />
                    <span className="text-sm text-muted">Status:</span>
                    <div className="flex gap-1">
                        {statusOptions.map((s) => (
                            <button
                                key={s || "all"}
                                onClick={() => setFilter((f) => ({ ...f, status: s }))}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                    filter.status === s
                                        ? "bg-primary/20 text-primary-light border-primary/30"
                                        : "bg-surface text-muted border-border hover:border-primary/20"
                                )}
                            >
                                {s || "All"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Severity:</span>
                    <div className="flex gap-1">
                        {severityOptions.map((s) => (
                            <button
                                key={s || "all-sev"}
                                onClick={() => setFilter((f) => ({ ...f, severity: s }))}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                    filter.severity === s
                                        ? "bg-primary/20 text-primary-light border-primary/30"
                                        : "bg-surface text-muted border-border hover:border-primary/20"
                                )}
                            >
                                {s || "All"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alert count */}
            <div className="flex items-center gap-2 text-sm text-muted animate-fade-in" style={{ animationDelay: "200ms" }}>
                <AlertTriangle size={14} />
                {alerts.length} alert{alerts.length !== 1 ? "s" : ""} found
            </div>

            {/* Alerts Table */}
            <div
                className="rounded-2xl border border-border bg-surface overflow-hidden animate-fade-in"
                style={{ animationDelay: "300ms" }}
            >
                {loading ? (
                    <div className="p-12 text-center text-muted text-sm">
                        Loading alerts...
                    </div>
                ) : (
                    <AlertTable
                        alerts={alerts}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>
        </div>
    );
}
