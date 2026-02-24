"use client";

import { useEffect, useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import VideoUpload from "@/components/VideoUpload";
import { Camera, Monitor, Wifi, Upload, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraItem {
    id: string;
    name: string;
    location: string;
    storeId: string;
    isActive: boolean;
    store?: { name: string };
}

type TabMode = "upload" | "live";

export default function CamerasPage() {
    const [cameras, setCameras] = useState<CameraItem[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<CameraItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabMode>("upload");

    useEffect(() => {
        fetch("/api/cameras")
            .then((res) => res.json())
            .then((data) => {
                setCameras(data);
                if (data.length > 0) setSelectedCamera(data[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Camera Feed
                </h1>
                <p className="text-muted mt-1">
                    Analyze shelf footage — upload a video or monitor live camera feeds
                </p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border w-fit animate-fade-in" style={{ animationDelay: "50ms" }}>
                <button
                    onClick={() => setTab("upload")}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                        tab === "upload"
                            ? "bg-primary/20 text-primary-light shadow-sm shadow-primary/10 border border-primary/30"
                            : "text-muted hover:text-foreground"
                    )}
                >
                    <Upload size={16} />
                    Upload Video
                </button>
                <button
                    onClick={() => setTab("live")}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                        tab === "live"
                            ? "bg-primary/20 text-primary-light shadow-sm shadow-primary/10 border border-primary/30"
                            : "text-muted hover:text-foreground"
                    )}
                >
                    <Video size={16} />
                    Live Camera
                </button>
            </div>

            {/* ===== UPLOAD TAB ===== */}
            {tab === "upload" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    {/* Camera selector */}
                    <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider px-1">
                            Select Camera Context
                        </h3>
                        <p className="text-xs text-muted/60 px-1">
                            Choose which camera this video is from — alerts will be linked to this camera.
                        </p>
                        {loading ? (
                            <div className="text-muted text-sm p-4">Loading cameras...</div>
                        ) : cameras.length === 0 ? (
                            <div className="rounded-xl border border-border bg-surface p-6 text-center">
                                <Camera size={32} className="text-muted mx-auto mb-2" />
                                <p className="text-sm text-muted">No cameras registered</p>
                                <p className="text-xs text-muted/60 mt-1">
                                    Add cameras from the Stores page
                                </p>
                            </div>
                        ) : (
                            cameras.map((cam) => (
                                <button
                                    key={cam.id}
                                    onClick={() => setSelectedCamera(cam)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCamera?.id === cam.id
                                        ? "bg-primary/15 border-primary/30 shadow-md shadow-primary/10"
                                        : "bg-surface border-border hover:border-primary/20 hover:bg-surface-hover"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${cam.isActive
                                                ? "bg-success/20 text-success"
                                                : "bg-muted/20 text-muted"
                                                }`}
                                        >
                                            <Monitor size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {cam.name}
                                            </p>
                                            <p className="text-xs text-muted truncate">{cam.location}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Video upload area */}
                    <div className="lg:col-span-2">
                        {selectedCamera ? (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Upload size={16} className="text-primary-light" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Video Analysis — {selectedCamera.name}
                                        </h3>
                                        <p className="text-xs text-muted">
                                            {selectedCamera.store?.name} • {selectedCamera.location}
                                        </p>
                                    </div>
                                </div>
                                <VideoUpload
                                    cameraId={selectedCamera.id}
                                    storeId={selectedCamera.storeId}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-96 rounded-2xl border border-border bg-surface">
                                <div className="text-center">
                                    <Upload size={48} className="text-muted mx-auto mb-3" />
                                    <p className="text-muted text-sm">
                                        Select a camera context before uploading a video
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== LIVE TAB ===== */}
            {tab === "live" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    {/* Camera List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider px-1">
                            Registered Cameras
                        </h3>
                        {loading ? (
                            <div className="text-muted text-sm p-4">Loading cameras...</div>
                        ) : cameras.length === 0 ? (
                            <div className="rounded-xl border border-border bg-surface p-6 text-center">
                                <Camera size={32} className="text-muted mx-auto mb-2" />
                                <p className="text-sm text-muted">No cameras registered</p>
                                <p className="text-xs text-muted/60 mt-1">
                                    Add cameras from the Stores page
                                </p>
                            </div>
                        ) : (
                            cameras.map((cam) => (
                                <button
                                    key={cam.id}
                                    onClick={() => setSelectedCamera(cam)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCamera?.id === cam.id
                                        ? "bg-primary/15 border-primary/30 shadow-md shadow-primary/10"
                                        : "bg-surface border-border hover:border-primary/20 hover:bg-surface-hover"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${cam.isActive
                                                ? "bg-success/20 text-success"
                                                : "bg-muted/20 text-muted"
                                                }`}
                                        >
                                            <Monitor size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {cam.name}
                                            </p>
                                            <p className="text-xs text-muted truncate">{cam.location}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Wifi
                                                size={12}
                                                className={cam.isActive ? "text-success" : "text-muted"}
                                            />
                                            <span
                                                className={`text-xs ${cam.isActive ? "text-success" : "text-muted"
                                                    }`}
                                            >
                                                {cam.isActive ? "Active" : "Offline"}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Camera Feed */}
                    <div className="lg:col-span-2">
                        {selectedCamera ? (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Camera size={16} className="text-primary-light" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            {selectedCamera.name}
                                        </h3>
                                        <p className="text-xs text-muted">
                                            {selectedCamera.store?.name} • {selectedCamera.location}
                                        </p>
                                    </div>
                                </div>
                                <CameraFeed
                                    cameraId={selectedCamera.id}
                                    storeId={selectedCamera.storeId}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-96 rounded-2xl border border-border bg-surface">
                                <div className="text-center">
                                    <Camera size={48} className="text-muted mx-auto mb-3" />
                                    <p className="text-muted text-sm">
                                        Select a camera to start monitoring
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
