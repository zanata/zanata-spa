
export const MOVE_NEXT = Symbol('MOVE_NEXT')
export function moveNext (docId, phraseId) {
  return {
    type: MOVE_NEXT,
    data: {
      docId,
      phraseId
    }
  }
}

export const MOVE_PREVIOUS = Symbol('MOVE_PREVIOUS')
export function movePrevious (docId, phraseId) {
  return {
    type: MOVE_PREVIOUS,
    data: {
      docId,
      phraseId
    }
  }
}
