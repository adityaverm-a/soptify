import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import useSpotify from "../hooks/useSpotify"

import { ReplyIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid'
import { debounce } from "lodash"

function Player() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)

    const songInfo = useSongInfo()

    console.log("from play coponent",songInfo);

    const handlePlayPause = () => {
        if(isPlaying){
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                if(data.body.is_playing) {
                    spotifyApi.pause()
                    setIsPlaying(false)
                } else {
                    spotifyApi.play()
                    setIsPlaying(true)
                }
            })
        }
    }

    const handleKeyPress = (e) => {
        console.log(e.keyCode);
        if(e.keyCode == 32){
            console.log("hey too");
            if(isPlaying){
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    if(data.body.is_playing) {
                        spotifyApi.pause()
                        setIsPlaying(false)
                    } else {
                        spotifyApi.play()
                        setIsPlaying(true)
                    }
                })
            }
        }
    }

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log('Now playing: ', data.body?.item);
                setCurrentTrackId(data.body?.item?.id)
            })

            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setIsPlaying(data.body?.is_playing)
            })
        }
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId, spotifyApi, session])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 500),
        []
    )

    useEffect(() => {
        if(volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    return (
        <div className="absolute bottom-0 text-white w-screen h-24 bg-gradient-to-b from-black to-gray-800 grid grid-cols-3 text-base md:text-lg px-2 md:px-8">
            <div>
                <img 
                    className="hidden md:inline h-20 w-20"
                    src={songInfo?.album?.images?.[0]?.url} 
                    alt="" 
                />
                <div>
                    <h4>{songInfo?.name}</h4>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {isPlaying ? (
                    <PauseIcon 
                        onClick={handlePlayPause} 
                        className="button w-10 h-10" 
                    />
                ) : (
                    <PlayIcon 
                        onClick={handlePlayPause} 
                        className="button w-10 h-10" 
                        onKeyDown={handleKeyPress}
                    />
                )}
                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-5 justify-end pr-5">
                <VolumeOffIcon 
                    className="button"
                    onClick={() => volume > 0 && setVolume(volume - 10)} 
                />
                <input 
                    className="w-14 md:w-28" 
                    type="range"   
                    value={volume} 
                    min={0} 
                    max={100} 
                    onClick={(e) => setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon 
                    className="button"
                    onClick={() => volume < 100 && setVolume(volume + 10)} 
                />
            </div>
        </div>
    )
}

export default Player
