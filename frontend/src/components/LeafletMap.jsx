import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

  // useEffect(() => {
  //   if (selectedListing) {
  //     selectedListing.position = [selectedListing.location[1], selectedListing.location[0]], // [lat, lng]
  //     map.flyTo(selectedListing.position, 15);
  //   }
  // }, [selectedListing, map]);

  return null;
};

const Map = ({
  locations = [],
  enablePopups = true,
  selectedListing = null,
  onMapClick = () => {},
  centerOnUser = true,
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
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Geolocation failed:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [centerOnUser]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      enablePopups={false}
      whenCreated={(map) => {
        map.on("click", onMapClick);
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <MapUpdater center={center} selectedListing={selectedListing && { ...selectedListing, position: [selectedListing.location[1], selectedListing.location[0]] }} />

      {leafletLocations.map(({ id, position, popup, onClick }) => (
        <Marker
          key={id}
          position={position}
          icon={
            selectedListing?.id === id
              ? new L.Icon({
                  iconUrl:
                    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                  shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              : new L.Icon.Default()
          }
          eventHandlers={{
            click: (e) => {
              e.originalEvent.stopPropagation();
              if (onClick) onClick();
            },
          }}
        >
          {enablePopups && popup && <Popup>{popup}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

MapUpdater.propTypes = {
  selectedListing: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func,
    }),
    PropTypes.oneOf([null]),
  ]),
  center: PropTypes.bool,
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
  selectedListing: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string,
      location: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
      onClick: PropTypes.func,
    }),
    PropTypes.oneOf([null]),
  ]),
  enablePopups: PropTypes.bool,
  onMapClick: PropTypes.func,
  centerOnUser: PropTypes.bool,
};

export default Map;
