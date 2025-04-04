import React from "react";
import StyledCombobox from "../components/StyledCombobox";

const ExamplePage = () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleSelectionChange = (value) => {
    console.log("Selected value:", value);
  };

  return (
    <div>
      <h1>Example Page</h1>
      <StyledCombobox
        label="Select an Option"
        options={options}
        onChange={handleSelectionChange}
      />
    </div>
  );
};

export default ExamplePage;
