import { createSlice } from "@reduxjs/toolkit";

const timesheetSlicer = createSlice({
    name: "timesheet",
    initialState: [],
    reducers: {
      addTimesheet: (state, action) => {
      },
      updateTimesheet: (state, action) => {
      },
      removeTimesheet: (state, action) => {
      },
    },
  });
  
  export const { addTimesheet, updateTimesheet, removeTimesheet } = timesheetSlicer.actions;
  
  export default timesheetSlicer.reducer;
  