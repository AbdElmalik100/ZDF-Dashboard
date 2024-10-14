import axios from "axios";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from "sonner";

export const getBundles = createAsyncThunk("bundlesSlice/getBundles", async () => {
    try {
        const response = await axios.get('api/bundles')
        return response.data
    } catch (error) {
        return error.response.data
    }
})

export const createBundle = createAsyncThunk("bundlesSlice/createBundle", async ({ bundleData, setProgress }, {rejectWithValue}) => {
    try {
        const formData = new FormData()
        for (let key in bundleData) formData.append(key, bundleData[key])
        
        const response = await axios.post('api/bundles', formData, {
            onUploadProgress: progress => {
                if (typeof bundleData.image === 'object') {
                    const progressValue = Math.round((progress.loaded * 100) / progress.total)
                    setProgress(progressValue)
                }
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateBundle = createAsyncThunk("bundlesSlice/updateBundle", async ({ bundleData, setProgress }, {rejectWithValue}) => {
    try {
        const formData = new FormData()
        for (let key in bundleData) formData.append(key, bundleData[key])
        
        const response = await axios.patch(`api/bundles/${bundleData._id}`, formData, {
            onUploadProgress: progress => {
                if (typeof bundleData.image === 'object') {
                    const progressValue = Math.round((progress.loaded * 100) / progress.total)
                    setProgress(progressValue)
                }
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getBundle = createAsyncThunk("bundlesSlice/getBundle", async (bundleId) => {
    try {
        const response = await axios.get(`api/bundles/${bundleId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})

export const deleteBundle = createAsyncThunk("bundlesSlice/deleteBundle", async (bundleId) => {
    try {
        const response = await axios.delete(`api/bundles/${bundleId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})


const bundlesSlice = createSlice({
    name: "bundles",
    initialState: {
        bundles: [],
        bundle: null,
        bundleToggle: false,
        loading: false
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getBundles.pending, state => {
                state.loading = true
            })
            .addCase(getBundles.fulfilled, (state, action) => {
                state.loading = false
                state.bundles = action.payload
            })
            .addCase(getBundles.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(createBundle.pending, state => {
                state.loading = true
            })
            .addCase(createBundle.fulfilled, (state, action) => {
                state.loading = false
                state.bundles = [...state.bundles, action.payload]
                toast.success("Bundle created successfuly!")
            })
            .addCase(createBundle.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(getBundle.pending, state => {
                state.loading = true
            })
            .addCase(getBundle.fulfilled, (state, action) => {
                state.loading = false
                state.bundle = action.payload
                state.bundleToggle = action.payload.is_available
            })
            .addCase(getBundle.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(updateBundle.pending, state => {
                state.loading = true
            })
            .addCase(updateBundle.fulfilled, (state, action) => {
                state.loading = false
                state.bundles = state.bundles.map(bundle => bundle._id === action.payload._id ? action.payload : bundle)
                state.bundleToggle = action.payload.is_available
                toast.success("Bundle updated successfuly!")
            })
            .addCase(updateBundle.rejected, (state, action) => {
                state.loading = false
            })
        
        builder
            .addCase(deleteBundle.pending, state => {
                state.loading = true
            })
            .addCase(deleteBundle.fulfilled, (state, action) => {
                state.loading = false
                state.bundles = state.bundles.filter(bundle => bundle._id !== action.payload._id)
                toast.success("Bundle has been deleted!")
            })
            .addCase(deleteBundle.rejected, (state, action) => {
                state.loading = false
            })
    }
})

export default bundlesSlice.reducer