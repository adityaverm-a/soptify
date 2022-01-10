import { HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon, UserRemoveIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom'

const menuItems = [
    {
        id: 1,
        buttonText: "Log Out",
        icon : <UserRemoveIcon className='w-5 h-5' />
    },
    {
        id: 2,
        buttonText: "Home",
        icon : <HomeIcon className='w-5 h-5' />
    },
    {
        id: 3,
        buttonText: "Search",
        icon : <SearchIcon className='w-5 h-5' />
    },
    {
        id: 4,
        buttonText: "Your Library",
        icon : <LibraryIcon className='w-5 h-5' />
    },
    {
        id: 5,
        buttonText: "Create Playlist",
        icon : <PlusCircleIcon className='w-5 h-5' />
    },
    {
        id: 6,
        buttonText: "Liked Songs",
        icon : <HeartIcon className='w-5 h-5' />
    },
    {
        id: 7,
        buttonText: "Your Episodes",
        icon : <RssIcon className='w-5 h-5' />
    },
    
]

function Sidebar() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi])

    console.log(playlists);

    return (
        <div className='text-gray-500 text-base border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen w-80 max-w-xs'>
            <div className=''>
                {menuItems.map(({ id, buttonText, icon }, i) => (
                    <>
                        <button
                            key={id}
                            onClick={() => signOut()}
                            className='flex items-center space-x-2 hover:text-white py-3 px-6'
                        >
                            {icon}
                            <p>{buttonText}</p>
                        </button>
                        {buttonText === "Your Library" && (
                            <hr className='border-t-[0.1px] border-gray-900 my-1' />
                        ) }
                    </>
                ))}
                <hr className='border-t-[0.1px] border-gray-900 my-1' />
                {playlists.map((playlist) => (
                    <p 
                        key={playlist.id} 
                        onClick={() => setPlaylistId(playlist.id)}
                        className={`${playlistId === playlist.id ? 'bg-gray-900 text-white' : ''} cursor-pointer hover:text-white py-4 px-6`}
                    >
                            {playlist.name}
                        </p>
                ))}
                
            </div>
        </div>
    )
}

export default Sidebar
