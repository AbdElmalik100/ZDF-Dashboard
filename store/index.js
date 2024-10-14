import { configureStore } from '@reduxjs/toolkit'
import eventsSlice from './slices/eventsSlice'
import theatreSlice from './slices/theatreSlice'
import workshopsSlice from './slices/workshopsSlice'
import bundlesSlice from '../store/slices/bundlesSlice'
import subscriptionsSlice from './slices/subscriptionsSlice'
import attendancesSlice from './slices/attendancesSlice'

export const store = configureStore({
    reducer: {
        events: eventsSlice,
        theatres: theatreSlice,
        workshops: workshopsSlice,
        bundles: bundlesSlice,
        subscriptions: subscriptionsSlice,
        attendances: attendancesSlice,
    },
})