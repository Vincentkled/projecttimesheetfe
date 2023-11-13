import { createSlice } from "@reduxjs/toolkit";

const timesheetSlicer = createSlice({
    name: "timesheet",
    initialState: [],
    reducers: {
      approveTimesheet: (state, action) => {
      },
      rejectTimesheet: (state, action) => {
      },
    },
  });
  
  export const { addTimesheet, updateTimesheet, removeTimesheet } = timesheetSlicer.actions;
  
  export default timesheetSlicer.reducer;
  