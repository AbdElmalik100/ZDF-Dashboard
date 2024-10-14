'use client'
import BundleCard from '@/components/BundleCard'
import NewBundle from '@/components/NewBundle'
import { getBundles } from '@/store/slices/bundlesSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Bundles() {
    const { bundles } = useSelector(state => state.bundles)
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getBundles())
    }, [dispatch])

    return (
        <div className='bundles flex flex-col gap-3 h-full'>
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase">Bundles</h2>
                <NewBundle btnText="New bundle"></NewBundle>
            </header>
            {
                bundles.length === 0
                    ?
                    <div className='h-full grid place-items-center flex-1'>
                        <div className='no-events wrapper'>
                            <img src="/images/open-box.png" className='w-32 mx-auto mb-3' alt="Bundle image" />
                            <p className='text-neutral-400 w-3/4 text-center mx-auto'>There is no bundles yet, Create one now and let all your students know.</p>
                            <div className='grid place-items-center mt-8'>
                                <NewBundle btnText="Create bundle"></NewBundle>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='grid grid-cols-4 mt-10 gap-5'>
                        {
                            bundles &&
                            bundles.map((bundle, index) => (
                                <BundleCard key={index} bundle={bundle}></BundleCard>
                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default Bundles