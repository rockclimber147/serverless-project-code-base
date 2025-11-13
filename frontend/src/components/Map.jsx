import React, { useEffect, useRef, useState } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl/dist/maplibre-gl.js';
import PropTypes from "prop-types";

const Map = ({
  locations = [],
  enablePopups = true,
  selectedListing = null,
  onMapClick = () => {},
  centerOnUser = true
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const DEFAULT_CENTER = [-123.1207, 49.2827]; // Downtown Vancouver fallback
  const [center, setCenter] = useState(DEFAULT_CENTER);

  const AWS_REGION = "us-west-2";
  const MAP_STYLE = "Standard";
  const API_KEY = import.meta.env.VITE_MAP_API;

  useEffect(() => {
    if (centerOnUser && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => {
          console.warn("Geolocation failed:", err);
        },
        { enableHighAccuracy: true }
      );
    } else if (!centerOnUser && locations.length > 0) {
      setCenter(locations[0].location);
    }
  }, [centerOnUser]);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${AWS_REGION}.amazonaws.com/v2/styles/${MAP_STYLE}/descriptor?key=${API_KEY}`,
      center,
      zoom: 13
    });

    // mapRef.current.addControl(new maplibregl.NavigationControl());

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
    if (mapRef.current) {
      mapRef.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (selectedListing && mapRef.current) {
      mapRef.current.flyTo({ center: selectedListing.location, zoom: 15 });
    }
  }, [selectedListing]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach(({ id, location, popup, onClick }) => {
      const marker = new maplibregl.Marker({
        color: id === selectedListing?.id ? "#DD3333" : "#3FB1CE"
      })
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
  }, [locations, enablePopups, selectedListing]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

Map.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  selectedListing: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.number,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func,
    }),
    PropTypes.oneOf([null]), // allow null
  ]),
  enablePopups: PropTypes.bool,
  onMapClick: PropTypes.func,
  centerOnUser: PropTypes.bool
};

export default Map;
