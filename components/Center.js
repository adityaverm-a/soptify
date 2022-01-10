import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs"

const colors = [
    "from-red-500",
    "from-amber-500",
    "from-yellow-500",
    "from-lime-500",
    "from-green-500",
    "from-emerald-500",
    "from-teal-500",
    "from-cyan-500",
    "from-sky-500",
    "from-fuchsia-500",
    "from-pink-500",
    "from-blue-500",
    "from-indigo-500",
    "from-violet-500",
    "from-purple-500",
    "from-rose-500",
]

function Center() {
    const spotifyApi = useSpotify()
    const [color, setColor] = useState(null)
    const { data: session } = useSession()
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId)
            .then((data) => {
                setPlaylist(data.body)
            })
            .catch((err) => console.log('something went wrong', err))
    }, [playlistId, spotifyApi])

    console.log(playlist);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            {session?.user && (<header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={session?.user.image} 
                        alt={session?.user.name} 
                    />
                    <h6>{session?.user.name}</h6>
                    <ChevronDownIcon className="w-5 h-5" />
                </div>
            </header>)}
            <section className={`flex items-end space-x-7 bg-gradient-to-b to to-black ${color} h-80 text-white p-8`}>
                <img 
                    className="w-60 h-60 shadow-2xl"
                    src={playlist?.images?.[0]?.url} 
                    alt={playlist?.name} 
                />
                <div>
                    <h4>PLAYLIST</h4>
                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">{playlist?.name} </h2>
                </div>
            </section>
            <div className="px-8 py-4">
                <Songs />
            </div>
        </div>
    )
}

export default Center
