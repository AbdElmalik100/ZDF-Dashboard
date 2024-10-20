import axios from "axios";
import { toast } from "sonner";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getWorkshops = createAsyncThunk("workshopsSlice/getWorkshops", async () => {
    try {
        const response = await axios.get("api/workshops")
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const createWorkshop = createAsyncThunk("workshopsSlice/createWorkshop", async ({ workshopData, setProgress }) => {
    try {
        const formData = new FormData()
        for (let key in workshopData) formData.append(key, workshopData[key])

        const response = await axios.post("api/workshops", formData, {
            onUploadProgress: progress => {
                if (typeof workshopData.image === 'object') {
                    const progressValue = Math.round((progress.loaded * 100) / progress.total)
                    setProgress(progressValue)
                }
            }
        })
        return response.data
    } catch (error) {
        return error.response.data
    }
})

export const getWorkshop = createAsyncThunk("workshopsSlice/getWorkshop", async (workshopId) => {
    try {
        const response = await axios.get(`api/workshops/${workshopId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const updateWorkshop = createAsyncThunk("workshopsSlice/updateWorkshop", async ({ workshopData, setProgress }) => {
    try {
        const formData = new FormData()
        for (let key in workshopData) formData.append(key, workshopData[key])

        const response = await axios.patch(`api/workshops/${workshopData._id}`, formData, {
            onUploadProgress: progress => {
                if (typeof workshopData.image === 'object') {
                    const progressValue = Math.round((progress.loaded * 100) / progress.total)
                    setProgress(progressValue)
                }
            }
        })
        return response.data
    } catch (error) {
        return error.response.data
    }
})
export const deleteWorkshop = createAsyncThunk("workshopsSlice/deleteWorkshop", async (workshopId) => {
    try {
        const response = await axios.delete(`api/workshops/${workshopId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})


const workshopsSlice = createSlice({
    name: "workshops",
    initialState: {
        workshops: [],
        workshop: null,
        workshopToggle: false,
        loading: false
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getWorkshops.pending, state => {
                state.loading = true
            })
            .addCase(getWorkshops.fulfilled, (state, action) => {
                state.loading = false
                state.workshops = action.payload
            })
            .addCase(getWorkshops.rejected, (state, action) => {
                state.loading = false
            })

        builder
            .addCase(createWorkshop.pending, state => {
                state.loading = true
            })
            .addCase(createWorkshop.fulfilled, (state, action) => {
                state.loading = false
                state.workshops = [...state.workshops, action.payload]
                toast.success("Workshop created successfuly!")
            })
            .addCase(createWorkshop.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(getWorkshop.pending, state => {
                state.loading = true
            })
            .addCase(getWorkshop.fulfilled, (state, action) => {
                state.loading = false
                state.workshop = action.payload
                state.workshopToggle = action.payload.is_available
            })
            .addCase(getWorkshop.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(updateWorkshop.pending, state => {
                state.loading = true
            })
            .addCase(updateWorkshop.fulfilled, (state, action) => {
                state.loading = false
                state.workshops = state.workshops.map(workshop => workshop._id === action.payload._id ? action.payload : workshop)
                state.workshopToggle = action.payload.is_available
                toast.success("Workshop updated successfuly!")
            })
            .addCase(updateWorkshop.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(deleteWorkshop.pending, state => {
                state.loading = true
            })
            .addCase(deleteWorkshop.fulfilled, (state, action) => {
                state.loading = false
                state.workshops = state.workshops.filter(workshop => workshop._id !== action.payload._id)
                toast.success("Workshop has been deleted!")
            })
            .addCase(deleteWorkshop.rejected, (state, action) => {
                state.loading = false
            })
    }
})

export default workshopsSlice.reducer