'use client'
import NewTheatre from '@/components/NewTheatre'
import TheatreCard from '@/components/TheatreCard'
import { getTheatres } from '@/store/slices/theatreSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Theatre() {
    const { theatres, loading } = useSelector(state => state.theatres)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTheatres())
    }, [dispatch])


    return (
        <div className='flex flex-col gap-3 h-full'>
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase">Theatre</h2>
                <NewTheatre btnText="New theatre"></NewTheatre>
            </header>
            {
                theatres.length === 0
                    ?
                    <div className='h-full grid place-items-center flex-1'>
                        <div className='no-events wrapper'>
                            <img src="/images/cinema-seats.png" className='w-32 mx-auto' alt="Event image" />
                            <p className='text-neutral-400 w-3/4 text-center mx-auto'>There is no theatres yet, Create one now and feel the power of the automation.</p>
                            <div className='grid place-items-center mt-8'>
                                <NewTheatre btnText="Create theatre"></NewTheatre>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='grid grid-cols-4 mt-10 gap-5'>
                        {
                            theatres.map((theatre, index) => (
                                <TheatreCard key={index} theatre={theatre}></TheatreCard>
                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default Theatre