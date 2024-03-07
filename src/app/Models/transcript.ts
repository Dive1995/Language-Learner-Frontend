import Caption from "./Caption";

export default interface Transcript {
    firstTranscript:[Caption], 
    first_is_generated:string, 
    secondTranscript:[Caption], 
    second_is_generated:string
}