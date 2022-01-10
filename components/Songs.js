import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song"

function Songs() {
    const playlist = useRecoilValue(playlistState)
    console.log(playlist);

    return (
        <div className="text-white">
            {playlist?.tracks.items.map((track, i) => (
                <Song 
                    order={i}
                    track={track}
                    key={track.track.id}
                />
            ))}
        </div>
    )
}

export default Songs
