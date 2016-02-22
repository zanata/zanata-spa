
export const MOVE_NEXT = Symbol('MOVE TO NEXT PHRASE')
export function moveNext (docId, phraseId) {
  return {
    type: MOVE_NEXT,
    data: {
      docId,
      phraseId
    }
  }
}

export const MOVE_PREVIOUS = Symbol('MOVE TO PREVIOUS PHRASE')
export function movePrevious (docId, phraseId) {
  return {
    type: MOVE_PREVIOUS,
    data: {
      docId,
      phraseId
    }
  }
}
