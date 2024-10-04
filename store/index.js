import { configureStore } from '@reduxjs/toolkit'
import eventsSlice from './slices/eventsSlice'
import theatreSlice from './slices/theatreSlice'
import subscriptionsSlice from './slices/subscriptionsSlice'

export const store = configureStore({
    reducer: {
        events: eventsSlice,
        theatres: theatreSlice,
        subscriptions: subscriptionsSlice,
    },
})