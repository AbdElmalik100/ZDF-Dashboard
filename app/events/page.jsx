'use client'
import NewEvent from '@/components/NewEvent'
import { getEvents } from '@/store/slices/eventsSlice'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import EventCard from '@/components/EventCard'


function Events() {
    const { events, loading } = useSelector(state => state.events)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])
    return (
        <div className='events flex flex-col gap-3 h-full'>
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase">Events</h2>
                <NewEvent btnText="New event"></NewEvent>
            </header>
            {
                events.length === 0
                    ?
                    <div className='h-full grid place-items-center flex-1'>
                        <div className='no-events wrapper'>
                            <div className='rounded-full border bg-black/50 p-8 shadow-md w-fit mx-auto mb-4'>
                                <img src="/images/event.png" className='w-16' alt="Event image" />
                            </div>
                            <p className='text-neutral-400 w-3/4 text-center mx-auto'>There is no events yet, what are you waiting for, Create one now and let your audience be on fire.</p>
                            <div className='grid place-items-center mt-8'>
                                <NewEvent btnText="Create event"></NewEvent>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='grid grid-cols-4 mt-10 gap-5'>
                        {
                            events &&
                            events.map((event, index) => (
                                <EventCard key={index} event={event}></EventCard>
                            ))
                        }
                    </div>
            }
        </div >
    )
}

export default Events