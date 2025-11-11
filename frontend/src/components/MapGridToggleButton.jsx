import React from "react";
import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function MapGridToggleButton() {
  const [viewMode, setViewMode] = useState("grid");
  const handleChangeView = (event, newView) => {
    setViewMode(newView);
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
