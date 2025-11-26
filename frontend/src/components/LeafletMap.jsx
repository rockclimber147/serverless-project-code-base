import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
};

const MarkerClusterLayer = ({ locations, selectedListing, enablePopups }) => {
  const map = useMap();
  const [clusterGroup] = useState(() => L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      let size = "small";
      if (count >= 10 && count < 100) size = "medium";
      else if (count >= 100) size = "large";

      return L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: `marker-cluster marker-cluster-${size}`,
        iconSize: L.point(40, 40),
      });
    },
  }));

  useEffect(() => {
    clusterGroup.clearLayers();

    locations.forEach((loc) => {
      let isSelected = selectedListing?.id === loc.id;
      // const icon =
      //   selectedListing?.id === loc.id
      //     ? new L.Icon({
      //         iconUrl:
      //           "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      //         shadowUrl:
      //           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      //         iconSize: [25, 41],
      //         iconAnchor: [12, 41],
      //       })
      //     : new L.Icon.Default();

      // const marker = L.marker(loc.position, { icon });

      
      const marker = L.circleMarker(loc.position, {
        radius: isSelected ? 10 : 7,
        fillColor: isSelected ? "#FF4136" : "#3388ff",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      if (enablePopups && loc.popup) marker.bindPopup(loc.popup);

      marker.on("click", (e) => {
        e.originalEvent.stopPropagation();
        if (loc.onClick) loc.onClick();
        if (enablePopups && loc.popup) marker.openPopup();
      });

      clusterGroup.addLayer(marker);
    });

    if (!map.hasLayer(clusterGroup)) {
      map.addLayer(clusterGroup);
    }

    return () => {
      clusterGroup.clearLayers();
    };
  }, [locations, selectedListing, enablePopups, map, clusterGroup]);

  return null;
};

const Map = ({
  locations = [],
  selectedListing = null,
  onMapClick = () => {},
  centerOnUser = true,
  enablePopups = true,
}) => {
  const DEFAULT_CENTER = [49.2827, -123.1207];
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [leafletLocations, setLeafletLocations] = useState([]);

  useEffect(() => {
    const converted = locations.map((loc) => ({
      ...loc,
      position: [loc.location[1], loc.location[0]],
    }));
    setLeafletLocations(converted);

    if (!centerOnUser && converted.length > 0) {
      setCenter(converted[0].position);
    }
  }, [locations, centerOnUser]);

  useEffect(() => {
    if (centerOnUser && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Geolocation failed:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [centerOnUser]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      maxZoom={16}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      whenCreated={(map) => map.on("click", onMapClick)}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <MapUpdater center={center} />

      <MarkerClusterLayer
        locations={leafletLocations}
        selectedListing={selectedListing}
        enablePopups={enablePopups}
      />
    </MapContainer>
  );
};

MapUpdater.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
}

Map.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  selectedListing: PropTypes.shape({
    id: PropTypes.string,
  }),
  onMapClick: PropTypes.func,
  centerOnUser: PropTypes.bool,
  enablePopups: PropTypes.bool,
};

MarkerClusterLayer.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func,
    })
  ).isRequired,
  selectedListing: PropTypes.shape({
    id: PropTypes.string,
  }),
  enablePopups: PropTypes.bool,
};

export default Map;
