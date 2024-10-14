'use client'
import { getWorkshops } from '@/store/slices/workshopsSlice'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import NewWorkshop from '@/components/NewWorkshop'
import WorkshopCard from '@/components/WorkshopCard'

function Workshops() {
    const dispatch = useDispatch()
    const { workshops } = useSelector(state => state.workshops)


    useEffect(() => {
        dispatch(getWorkshops())
    }, [dispatch])
    return (
        <div className='flex flex-col gap-3 h-full'>
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase">Workshops</h2>
                <NewWorkshop btnText="New workshop"></NewWorkshop>
            </header>
            {
                workshops.length === 0
                    ?
                    <div className='h-full grid place-items-center flex-1'>
                        <div className='no-events wrapper'>
                            <img src="/images/safety.png" className='w-32 mx-auto' alt="Event image" />
                            <p className='text-neutral-400 w-3/4 text-center mx-auto'>There is no workshops yet, Create one now and let all your students know.</p>
                            <div className='grid place-items-center mt-8'>
                                <NewWorkshop btnText="Create workshop"></NewWorkshop>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='grid grid-cols-4 mt-10 gap-5'>
                        {
                            workshops.map((workshop, index) => (
                                <WorkshopCard key={index} workshop={workshop}></WorkshopCard>
                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default Workshops