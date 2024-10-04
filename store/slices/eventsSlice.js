import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

export const getEvents = createAsyncThunk("eventsSlice/getEvents", async () => {
    try {
        const response = await axios.get("api/events")
        return response.data
    } catch (error) {
        console.log(error);
    }
})
export const createEvent = createAsyncThunk("eventsSlice/createEvent", async ({ eventData, setProgress }, { rejectWithValue }) => {
    try {
        const formData = new FormData()
        for (let key in eventData) formData.append(key, eventData[key])

        const response = await axios.post("api/events", formData, {
            onUploadProgress: progress => {
                if (eventData.image !== '') {
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

export const getEvent = createAsyncThunk("eventsSlice/getEvent", async (eventId) => {
    try {
        const response = await axios.get(`api/events/${eventId}`)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateEvent = createAsyncThunk("eventsSlice/updateEvent", async ({ eventData, setProgress }, { rejectWithValue }) => {
    try {        
        const formData = new FormData()
        for (let key in eventData) formData.append(key, eventData[key])

        const response = await axios.patch(`api/events/${eventData._id}`, formData, {
            onUploadProgress: progress => {
                if (typeof eventData.image === 'object') {
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
export const deleteEvent = createAsyncThunk("eventsSlice/deleteEvent", async (eventId) => {
    try {
        const response = await axios.delete(`api/events/${eventId}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        event: null,
        eventToggle: false,
        errors: {},
        loading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getEvents.pending, state => {
                state.loading = true
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.loading = false
                state.events = action.payload
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.loading = false
            })

        builder
            .addCase(createEvent.pending, state => {
                state.loading = true
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false
                state.events = [...state.events, action.payload]
                toast.success("Event created successfuly!")
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(getEvent.pending, state => {
                state.loading = true
            })
            .addCase(getEvent.fulfilled, (state, action) => {
                state.loading = false
                state.event = action.payload
                state.eventToggle = action.payload.is_available
            })
            .addCase(getEvent.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(updateEvent.pending, state => {
                state.loading = true
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false
                state.events = state.events.map(event => event._id === action.payload._id ? action.payload : event)
                state.eventToggle = action.payload.is_available
                toast.success("Event updated successfuly!")
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(deleteEvent.pending, state => {
                state.loading = true
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false
                state.events = state.events.filter(event => event._id !== action.payload._id)
                toast.success("Event has been deleted!")
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false
            })
    }
})

// Action creators are generated for each case reducer function


export default eventsSlice.reducer