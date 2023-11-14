import { createSlice } from "@reduxjs/toolkit";

const timesheetSlicer = createSlice({
    name: "timesheet",
    initialState: [],
    reducers: {
      token: () => {
        localStorage.getItem("Role");
        localStorage.get("Id");
      },
    },
  });
  
  export const { token } = timesheetSlicer.actions;
  
  export default timesheetSlicer.reducer;
  