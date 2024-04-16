import VideoHistory from "./VideoHistory";

export default interface User{
    id: string,
    name: string,
    email: string,
    family_name: string,
    given_name: string,
    videoHistory: VideoHistory[]
}