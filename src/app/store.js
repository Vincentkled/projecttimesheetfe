import { configureStore } from "@reduxjs/toolkit";
import timesheetSlicer from "../features/timesheetSlice";

export const store = configureStore({
    reducer :{  
        timesheet: timesheetSlicer
    }
})