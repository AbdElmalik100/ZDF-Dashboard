import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'


export const getTheatres = createAsyncThunk('theatreSlice/getTheatres', async () => {
    try {
        const response = await axios.get("api/theatres")
        return response.data
    } catch (error) {
        return error
    }
})

export const createTheatre = createAsyncThunk('theatreSlice/createTheatre', async (theatreData) => {
    try {
        const response = await axios.post("api/theatres", theatreData)
        return response.data
    } catch (error) {
        return error
    }
})

export const getTheatre = createAsyncThunk('theatreSlice/getTheatre', async (theatreId) => {
    try {
        const response = await axios.get(`api/theatres/${theatreId}`)
        return response.data
    } catch (error) {
        return error
    }
})

export const updateTheatre = createAsyncThunk('theatreSlice/updateTheatre', async (theatreData) => {
    try {
        const response = await axios.patch(`api/theatres/${theatreData._id}`, theatreData)
        return response.data
    } catch (error) {
        return error
    }
})

export const deleteTheatre = createAsyncThunk('theatreSlice/deleteTheatre', async (theatreId) => {
    try {
        const response = await axios.delete(`api/theatres/${theatreId}`)
        return response.data
    } catch (error) {
        return error
    }
})


export const theatreSlice = createSlice({
    name: 'theatres',
    initialState: {
        theatres: [],
        theatre: null,
        errors: {},
        loading: false,
    },
    reducers: {
        liveUpdateSeats: (state, action) => {
            console.log(action);
            state.theatre.seats = action.payload.seats
            console.log(state.theatre);

            toast.success("A user took a seat!")
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getTheatres.pending, state => {
                state.loading = true
            })
            .addCase(getTheatres.fulfilled, (state, action) => {
                state.loading = false
                state.theatres = action.payload
            })
            .addCase(getTheatres.rejected, (state, action) => {
                state.loading = false
            })

        builder
            .addCase(createTheatre.pending, state => {
                state.loading = true
            })
            .addCase(createTheatre.fulfilled, (state, action) => {
                state.loading = false
                state.theatres = [...state.theatres, action.payload]
                toast.success("Theatre created successfuly!")
            })
            .addCase(createTheatre.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(getTheatre.pending, state => {
                state.loading = true
            })
            .addCase(getTheatre.fulfilled, (state, action) => {
                state.loading = false
                state.theatre = action.payload
            })
            .addCase(getTheatre.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(updateTheatre.pending, state => {
                state.loading = true
            })
            .addCase(updateTheatre.fulfilled, (state, action) => {
                state.loading = false
                state.theatres = state.theatres.map(theatre => theatre._id === action.payload._id ? action.payload : theatre)
                toast.success("Theatre updated successfuly!")
            })
            .addCase(updateTheatre.rejected, (state, action) => {
                state.loading = false
                state.errors = action.payload.response.data
            })

        builder
            .addCase(deleteTheatre.pending, state => {
                state.loading = true
            })
            .addCase(deleteTheatre.fulfilled, (state, action) => {
                state.loading = false
                state.theatres = state.theatres.filter(theatre => theatre._id !== action.payload._id)
                toast.success("Theatre has been deleted!")
            })
            .addCase(deleteTheatre.rejected, (state, action) => {
                state.loading = false
            })
    }
})

// Action creators are generated for each case reducer function
export const { liveUpdateSeats } = theatreSlice.actions

export default theatreSlice.reducer