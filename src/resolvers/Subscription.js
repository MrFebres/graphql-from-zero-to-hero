const Subscription = {
  count: {
    subscribe(parent, arg, { pubsub }, info) {
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
      return pubsub.asyncIterator('author')
    },
  },
  book: {
    subscribe(parent, { authorId }, { db, pubsub }, info) {
      return pubsub.asyncIterator(`book - ${authorId}`)
    },
  },
}

export default Subscription
