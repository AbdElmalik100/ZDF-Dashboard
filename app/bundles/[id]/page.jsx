'use client'
import BundlesWorkshopTable from '@/components/BundlesWorkshopTable'
import SubscriptionTable from '@/components/SubscriptionTable'
import { Switch } from '@/components/ui/switch'
import { getBundle, updateBundle } from '@/store/slices/bundlesSlice'
import { getSubscriptions } from '@/store/slices/subscriptionsSlice'
import { formatCurrency } from '@/utils/formatter'
import { UsersRound } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function BundleDetails() {
    const params = useParams()
    const dispatch = useDispatch()
    const { bundle, bundleToggle } = useSelector(state => state.bundles)

    const toggleBundle = () => {
        const mappedData = { ...bundle, workshops: bundle.workshops.map(el => el._id), is_available: !bundleToggle }
        dispatch(updateBundle({ bundleData: mappedData }))
    }


    useEffect(() => {
        dispatch(getBundle(params.id))
    }, [params, dispatch])


    useEffect(() => {
        if (bundle && bundle._id) dispatch(getSubscriptions({ bundleId: bundle._id }))
    }, [bundle, dispatch])

    return (
        bundle &&
        <div className='bundle-details'>
            <header className="flex items-start justify-between">
                <h2 className="text-3xl font-bold capitalize">{bundle.title}</h2>
                <span className="text-neutral-300 text-xs">
                    Created {new Date(bundle.created_at).toLocaleString()}
                </span>
            </header>
            <div className={`event-toggle flex items-center gap-2 justify-between p-4 px-3 rounded-xl mt-4 border ${bundleToggle ? "text-green-500 border-green-500" : "text-rose-500 border-rose-500"}`}>
                <div>
                    <h2 className="font-bold">
                        {bundleToggle ? "Bundle is now available" : "Bundle is currently unavailable"}
                    </h2>
                    <p className=" text-sm">
                        {bundleToggle ? "This bundle is available and users can book a seat from ZDF website." : "This bundle is no longer accept books from users."}
                    </p>
                </div>
                <Switch
                    checked={bundleToggle}
                    onCheckedChange={toggleBundle}
                />
            </div>
            <div className='flex items-start mt-10 gap-10'>
                <div className='flex gap-5'>
                    <div className="image">
                        <img width={375} className='rounded-2xl' src={bundle.image} alt="Bundle image" />
                    </div>
                    <div>
                        <h2 className='font-bold text-2xl mb-1'>{bundle.title}</h2>
                        <p className='text-sm text-neutral-400'>{bundle.description}</p>
                        <div className="flex items-center gap-2 mt-4">
                            <UsersRound size={20}></UsersRound>
                            <span>{bundle.limit} Limited seats</span>
                        </div>
                        <span className='block font-bold text-3xl mt-5'>{formatCurrency.format(bundle.price)}</span>
                    </div>
                </div>
            </div>
            <div className='bundles-table mt-10'>
                <BundlesWorkshopTable bundle={bundle}></BundlesWorkshopTable>
            </div>
            <div className="subscription-table mt-20">
                <div className="table-header flex flex-col gap-1">
                    <h2 className="font-bold text-2xl">Bundle subscriptions</h2>
                    <p className="text-neutral-400">
                        These are all the users that subscribed to your bundle, You can check their information.
                    </p>
                </div>
                <div className="table mt-4 w-full">
                    <SubscriptionTable></SubscriptionTable>
                </div>
            </div>
        </div>
    )
}

export default BundleDetails