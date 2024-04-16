import { WordMeaning } from "./WordMeaning"

export default interface VideoHistory {
    video_id: string,
    learning_lang: string, // could be an object like {target: 'DE', source: 'EN'}
    vocabList: WordMeaning[]
}