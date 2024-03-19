export interface WordMeaning{
    input: string,
    translation: string,
    contextResults: [results]
}

interface results{
    partOfSpeech: string,
    sourceExamples: [string],
    targetExamples: [string],
    translation: string
}