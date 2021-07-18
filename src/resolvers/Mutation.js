import { v4 as uuidv4 } from "uuid";
const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) throw new Error("Email taken.");
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id == args.id);
    if (userIndex == -1) throw new Error("User does not exist");
    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });
    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const user = db.users.find((userF) => userF.id == args.id);
    if (!user) throw new Error("User not found");

    if (typeof args.data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === args.data.email);
      if (emailTaken) throw new Error("Email taken");
      user.email = args.data.email;
    }
    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== "undefined") {
      user.age = args.data.age;
    }
    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id == args.data.author);
    if (!userExists) throw new Error("User does not exist");
    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish(`post`, { post: { mutation: "CREATED", data: post } });
    }
    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postExist = db.posts.some((post) => post.id === args.id);
    if (postExist == -1) throw new Error("Post does not exist");
    const deletedPosts = db.posts.splice(postExist, 1);
    db.comments = db.comments.filter((comment) => {
      return comment.post !== deletedPosts[0].id;
    });
    if (deletedPosts[0].published) {
      pubsub.publish(`post`, { post: { mutation: "DELETED", data: deletedPosts[0] } });
    }
    return deletedPosts[0];
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const postExist = db.posts.find((postF) => postF.id == args.id);
    const originalPost = { ...post };
    if (!postExist) throw new Error("Post does not exist");

    if (typeof args.data.title === "string") postExist.title = args.data.title;
    if (typeof args.data.body === "string") postExist.body = args.data.body;
    if (typeof args.data.published === "boolean") {
      postExist.published = args.data.published;
      if (originalPost.published && !post.published) {
        pubsub.publish(`post`, { post: { mutation: "DELETED", data: postExist } });
      } else if (!originalPost.published && post.published) {
        pubsub.publish(`post`, { post: { mutation: "CREATED", data: postExist } });
      }
    } else if (post.published) {
      pubsub.publish(`post`, { post: { mutation: "UPDATED", data: postExist } });
    }

    return postExist;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id == args.data.author);
    const postExists = db.posts.some((post) => post.id == args.data.post);
    if (!userExists) throw new Error("User does not exist");
    if (!postExists) throw new Error("Post does not exist");
    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`comment_channel_${args.data.post}`, { comment: { mutation: "CREATED", data: comment } });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    if (args.data.author) {
      const userExists = db.users.some((user) => user.id == args.data.author);
      if (!userExists) throw new Error("User does not exist");
    }

    if (args.data.post) {
      const postExists = db.posts.some((post) => post.id == args.data.post);
      if (!postExists) throw new Error("Post does not exist");
    }

    let commentExists = db.comments.find((comment) => comment.id == args.id);
    const originalComment = { ...commentExists };

    if (!commentExists) throw new Error("Comment does not exist");
    if (typeof args.data.text === "string") commentExists.text = args.data.text;
    if (typeof args.data.author === "string") commentExists.author = args.data.author;
    if (typeof args.data.post === "boolean") commentExists.post = args.data.post;
    pubsub.publish(`comment_channel_${originalComment.post}`, { comment: { mutation: "UPDATED", data: commentExists } });
    return commentExists;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id == args.id);
    if (commentIndex === -1) throw new Error("Comment not found");
    let commentObj = { ...db.comments[commentIndex] };
    const deletedComments = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment_channel_${commentObj.post}`, { comment: { mutation: "DELETED", data: commentObj } });
    return deletedComments[0];
  },
};

export default Mutation;
