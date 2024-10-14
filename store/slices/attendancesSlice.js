import axios from "axios";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from "sonner";

export const getAttendances = createAsyncThunk("attendancesSlice/getAttendances", async () => {
    try {
        const response = await axios.get("api/attendances")
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const createAttendance = createAsyncThunk("attendancesSlice/createAttendance", async (attendanceData) => {
    try {
        const response = await axios.post("api/attendances", attendanceData)
        return response.data
    } catch (error) {        
        return error.response.data
    }
})


export const getAttendance = createAsyncThunk("attendancesSlice/getAttendance", async (attendanceId) => {
    try {
        const response = await axios.get(`api/attendances/${attendanceId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const updateAttendance = createAsyncThunk("attendancesSlice/updateAttendance", async (attendanceData) => {    
    try {
        const response = await axios.patch(`api/attendances/${attendanceData._id}`, attendanceData)
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const deleteAttendance = createAsyncThunk("attendancesSlice/deleteAttendance", async (attendanceId) => {
    try {
        const response = await axios.delete(`api/attendances/${attendanceId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})


const attendancesSlice = createSlice({
    name: "attendances",
    initialState: {
        attendances: [],
        attendance: null,
        loading: false
    },
    reducers: {
        liveUpdateAttendance: (state, action) => {
            const { updatedAttendance, user } = action.payload;
            state.attendance = updatedAttendance
            state.attendances = state.attendances.map(attendance => attendance._id === updatedAttendance._id ? updateAttendance : attendance);
            toast.success(`${user.first_name} has just attended!`);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getAttendances.pending, state => {
                state.loading = true
            })
            .addCase(getAttendances.fulfilled, (state, action) => {
                state.loading = false
                state.attendances = action.payload
            })
            .addCase(getAttendances.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(createAttendance.pending, state => {
                state.loading = true
            })
            .addCase(createAttendance.fulfilled, (state, action) => {
                state.loading = false
                state.attendances = [...state.attendances, action.payload]
                toast.success("Table created successfuly!")
            })
            .addCase(createAttendance.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(getAttendance.pending, state => {
                state.loading = true
            })
            .addCase(getAttendance.fulfilled, (state, action) => {
                state.loading = false
                state.attendance = action.payload
            })
            .addCase(getAttendance.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(updateAttendance.pending, state => {
                state.loading = true
            })
            .addCase(updateAttendance.fulfilled, (state, action) => {                
                state.loading = false
                
                state.attendances = state.attendances.map(attendance => attendance._id === action.payload._id ? action.payload : attendance)
                console.log(state.attendances);
                toast.success("Table updated successfuly!")
            })
            .addCase(updateAttendance.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(deleteAttendance.pending, state => {
                state.loading = true
            })
            .addCase(deleteAttendance.fulfilled, (state, action) => {
                state.loading = false
                state.attendances = state.attendances.filter(attendance => attendance._id !== action.payload._id)
                toast.success("Table has been deleted!")
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                state.loading = false
            })
    }
})

export const { liveUpdateAttendance } = attendancesSlice.actions

export default attendancesSlice.reducer