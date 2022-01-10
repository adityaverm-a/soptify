import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { currentTrackIdState } from "../atoms/songAtom"
import useSpotify from "./useSpotify"

function useSongInfo() {
    const spotifyApi = useSpotify()
    const currentTrackId = useRecoilValue(currentTrackIdState)
    const [songInfo, setSongInfo] = useState(null)

    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentTrackId) {
                const { data } = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                    }
                })

                console.log("form useSonginfo",data);

                setSongInfo(data)
            }
        }

        fetchSongInfo()
    }, [spotifyApi, currentTrackId])

    return songInfo
}

export default useSongInfo
