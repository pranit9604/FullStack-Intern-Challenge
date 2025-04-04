import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

const StyledCombobox = ({ label, options, onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="styled-combobox-label">{label}</InputLabel>
        <Select
          labelId="styled-combobox-label"
          value={value}
          onChange={handleChange}
          label={label}
          sx={{
            "& .MuiSelect-select": {
              padding: "10px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1565c0",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0d47a1",
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StyledCombobox;
