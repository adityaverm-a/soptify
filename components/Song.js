import { useRecoilState } from "recoil"
import useSpotify from "../hooks/useSpotify"
import { millisToMinuatesAndSeconds } from "../lib/time"
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'

function Song({ order, track }) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(track.track.id)
        setIsPlaying(true)
        spotifyApi.play({
            uri: [track.track.uri]
        })
    }

    return (
        <div className={`grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 cursor-pointer rounded-xl ${currentTrackId === track.track.id ? 'bg-gray-800 hover:bg-gray-800' : ''}`} onClick={playSong}>
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img 
                    className="w-12 h-12"
                    src={track.track.album.images[0].url} 
                    alt={track.track.album.name} 
                />
                <div>
                    <p className="w-36 lg:w-44 xl:w-96 truncate text-white font-medium">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-44 hidden md:inline lg:w-64 xl:w-96">{track.track.album.name}</p>
                <p>{millisToMinuatesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
