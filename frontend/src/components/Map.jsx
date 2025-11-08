import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = ({ locations = [], enablePopups = true, onMapClick = () => { } }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [center, setCenter] = useState([-123.1207, 49.2827]); // Fall back to downtown van

    const AWS_REGION = "us-west-2";
    const MAP_STYLE = "Standard";
    const API_KEY = import.meta.env.VITE_MAP_API;

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter([pos.coords.longitude, pos.coords.latitude]);
            },
            (err) => console.warn("Geolocation failed:", err),
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://maps.geo.${AWS_REGION}.amazonaws.com/v2/styles/${MAP_STYLE}/descriptor?key=${API_KEY}`,
            center,
            zoom: 13
        });

        mapRef.current.addControl(new maplibregl.NavigationControl());

        mapRef.current.on("load", () => {
            mapRef.current.setCenter(center);
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const handleMapClick = () => {
            if (typeof onMapClick === "function") onMapClick();
        };

        mapRef.current.on("click", handleMapClick);
        return () => mapRef.current.off("click", handleMapClick);
    }, [onMapClick]);

    useEffect(() => {
        if (!mapRef.current) return;

        const handleMapClick = (e) => {
            if (typeof mapRef.current.clearSelection === "function") {
                mapRef.current.clearSelection();
            }
        };

        mapRef.current.on("click", handleMapClick);

        return () => {
            mapRef.current.off("click", handleMapClick);
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && mapRef.current.loaded()) {
            mapRef.current.setCenter(center);
        }
    }, [center]);

    useEffect(() => {
        if (!mapRef.current) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        locations.forEach(({ location, popup, onClick }) => {
            const marker = new maplibregl.Marker()
                .setLngLat(location)
                .addTo(mapRef.current);

            if (enablePopups && popup) {
                marker.setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popup));
            }

            if (onClick) {
                marker.getElement().addEventListener("click", (e) => {
                    e.stopPropagation();
                    onClick();
                });
            }

            markersRef.current.push(marker);
        });
    }, [locations, enablePopups]);

    return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
