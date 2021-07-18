const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count_channel", {
          count,
        });
      }, 1000);

      return pubsub.asyncIterator("count_channel");
    },
  },
  comment: {
    subscribe(parent, args, { pubsub, db }, info) {
      const post = db.posts.find((post) => post.id == args.postId && post.published);
      if (!post) throw new Error("Post not found");
      return pubsub.asyncIterator(`comment_channel_${args.postId}`);
    },
  },
  post: {
    subscribe(parent, args, { pubsub, db }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

export default Subscription;
