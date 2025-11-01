// This is a sample trigram and bigram model.
// A real-world application would have a much larger model generated from a large text corpus.
// Structure: { "word1 word2": { "nextWord": frequency, ... } }
export const trigramModel: Record<string, Record<string, number>> = {
    "a lot": { "of": 100, "more": 50, "better": 20 },
    "let me": { "know": 100, "see": 30, "check": 25 },
    "at the": { "same": 100, "end": 80, "moment": 60 },
    "end of": { "the": 100, "day": 50, "this": 30 },
    "for a": { "while": 50, "moment": 40, "long": 30 },
    "i want": { "to": 200, "a": 30, "this": 25 },
    "i would": { "like": 100, "be": 50, "say": 30 },
    "in the": { "world": 80, "future": 70, "end": 60, "meantime": 40 },
    "is a": { "good": 100, "great": 80, "lot": 50, "very": 40 },
    "it was": { "a": 150, "the": 80, "not": 60, "great": 40 },
    "it will": { "be": 100, "take": 40, "not": 30 },
    "of the": { "world": 100, "most": 80, "first": 60, "best": 50 },
    "on the": { "other": 100, "first": 50, "table": 30 },
    "thank you": { "for": 150, "very": 80, "so": 60 },
    "to be": { "a": 100, "able": 80, "honest": 50 },
    "to the": { "next": 100, "point": 50, "end": 40 },
    "you for": { "your": 100, "the": 30 },
};

// Structure: { "word1": { "nextWord": frequency, ... } }
export const bigramModel: Record<string, Record<string, number>> = {
    "a": { "lot": 100, "good": 80, "great": 70, "new": 60 },
    "and": { "i": 120, "the": 100, "then": 50, "so": 40 },
    "for": { "the": 100, "a": 80, "example": 60 },
    "have": { "a": 100, "to": 80, "been": 70 },
    "i": { "am": 150, "have": 120, "was": 100, "think": 90, "want": 80 },
    "in": { "the": 200, "a": 100, "this": 50 },
    "is": { "a": 150, "the": 100, "not": 80, "very": 60 },
    "it": { "is": 200, "was": 150, "s": 120, "would": 80 },
    "of": { "the": 250, "a": 100, "course": 80 },
    "on": { "the": 150, "a": 60 },
    "that": { "is": 120, "was": 80, "s": 70 },
    "the": { "first": 100, "most": 90, "next": 80, "world": 70, "end": 60 },
    "to": { "be": 150, "the": 120, "a": 100, "get": 80 },
    "was": { "a": 100, "the": 80, "not": 60 },
    "we": { "are": 100, "can": 80, "have": 60 },
    "with": { "the": 120, "a": 80 },
    "you": { "are": 150, "can": 100, "have": 90, "know": 80 },
};
