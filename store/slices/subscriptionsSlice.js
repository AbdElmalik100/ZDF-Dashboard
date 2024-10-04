import axios from "axios";
import { toast } from "sonner";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");


export const getSubscriptions = createAsyncThunk("subscriptionsSlice/getSubscriptions", async (eventId) => {
    try {
        const response = await axios.get(`api/subscriptions?event=${eventId}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
})

export const updateSubscription = createAsyncThunk("subscriptionsSlice/updateSubscription", async (subscription) => {
    try {
        const response = await axios.patch(`api/subscriptions/${subscription._id}`, { attendance: !subscription.attendance })
        return response.data
    } catch (error) {
        return error.response.data
    }
})

const subscriptionsSlice = createSlice({
    name: "subscriptions",
    initialState: {
        subscriptions: [],
        loading: false
    },
    reducers: {
        liveUpdateSubscriptions: (state, action) => {
            state.subscriptions = state.subscriptions.map(subscription => subscription._id === action.payload._id ? action.payload : subscription).sort((a, b) => b.attendance - a.attendance)
            toast.success(`${action.payload.user.first_name} has just attendant!`)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getSubscriptions.pending, state => {
                state.loading = true
            })
            .addCase(getSubscriptions.fulfilled, (state, action) => {
                state.loading = false
                state.subscriptions = action.payload
            })
            .addCase(getSubscriptions.rejected, state => {
                state.loading = false
            })

        builder
            .addCase(updateSubscription.pending, state => {
                state.loading = true
            })
            .addCase(updateSubscription.fulfilled, (state, action) => {
                state.loading = false
                state.subscriptions = state.subscriptions.map(subscription => subscription._id === action.payload._id ? action.payload : subscription).sort((a, b) => b.attendance - a.attendance)
            })
            .addCase(updateSubscription.rejected, (state, action) => {
                state.loading = false
            })
    }
})


export const { liveUpdateSubscriptions } = subscriptionsSlice.actions

export default subscriptionsSlice.reducer