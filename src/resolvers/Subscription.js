import { getUserId } from '../utils'

const Subscription = {
  count: {
    subscribe(parent, arg, { pubsub, request }, info) {
      const userId = getUserId(request)
      let count = 0

      setInterval(() => {
        count++
        pubsub.publish('count', { count })
      }, 1000)

      return pubsub.asyncIterator('count')
    },
  },
  author: {
    subscribe(parent, arg, { pubsub }, info) {
      const userId = getUserId(request)
      return pubsub.asyncIterator('author')
    },
  },
  book: {
    subscribe(parent, { authorId }, { db, pubsub }, info) {
      const userId = getUserId(request)
      return pubsub.asyncIterator(`book - ${authorId}`)
    },
  },
}

export default Subscription
