import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function MapGridToggleButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const viewMode = location.pathname.includes("map") ? "map" : "grid";

  const handleChangeView = (event, newView) => {
    if (!newView) return;

    if (newView === "grid" && !location.pathname.includes("grid")) {
      navigate("/user-dashboard-grid");
    } else if (newView === "map" && !location.pathname.includes("map")) {
      navigate("/listings-map");
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={viewMode}
      exclusive
      onChange={handleChangeView}
      aria-label="View Switcher"
      className="flex justify-end"
    >
      <ToggleButton value="map" sx={{ borderRadius: 3, px: 1 }}>
        Map View
      </ToggleButton>
      <ToggleButton value="grid" sx={{ borderRadius: 3, px: 1 }}>
        Grid View
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
