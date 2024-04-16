export interface WordMeaning{
    input: string,
    translation: string,
    contextResults: Results[]
}

export interface Results{
    partOfSpeech: string,
    sourceExamples: string[],
    targetExamples: string[],
    translation: string
}