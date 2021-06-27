import {GraphQLServer} from 'graphql-yoga';

//Demo user data
const users = [{
    id: 1,
    name:'Andrew',
    email:'tihomir_alandre@gmail.com',
    age:27
},
{
    id: 2,
    name:'Sara',
    email:'sarah123oh@gmail.com',
    age:17
}]

const posts = [{
    id:1,
    title:"Mira",
    body:"Mi gnso ha crecido",
    published:true,
    author:1
}]

const comments = [
    {
        id:1,
        text:"Bueno",
        author:1,
        post:1
    },
    {
        id:2,
        text:"Bueno2",
        author:1,
        post:1
    },
    {
        id:3,
        text:"Bueno3",
        author:1,
        post:1
    },
    {
        id:4,
        text:"Bueno4",
        author:2,
        post:1
    }
]

const typeDefs = `
    type Query {
        greeting(name:String):String!
        grades:[Int!]!
        add(numbers:[Float!]!):Float!
       me:User!
       post:Post!
       posts(query:String):[Post!]!
       users:[User!]!
       comments:[Comment!]!
    }

    type User  {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author:User!
        post:Post!
    }
`

//Resolvers
const resolvers = {
    Query : {
        comments(parent,args,ctx,info){
            return comments;
        },
        posts(parent,args,ctx,info){
            return posts.filter((entry)=>{
                if(args.query){
                    return entry.title.toLowerCase().includes(args.query.toLowerCase())
                }
                return true;
            });
        },
        users(parent,args,ctx,info){
            return users;
        },
        add(parent,args,ctx,info){
            return args.numbers.reduce((prev,current)=>{
                prev = prev + current;
                return prev
            },0)
        },
        greeting(parent,args,ctx,info){
            return `Hola ${args.name}`
        },
        grades(parent,args,ctx,info){
            return [99,80,93]
        },
        me(){
            return {
                id:123,
                name:"Suave",
                email:"suave@gmail.com",
                age:123
            }
        },
        post(){
            return {
                id:456,
                title:"Dembow",
                body:"Suavisimo",
                published:true
            }
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find((user)=>user.id == parent.author)
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>comment.post == parent.id)
        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=> post.author == parent.id)
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=> comment.author == parent.id)
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>user.id == parent.author)
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>post.id == parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,resolvers
})

server.start(()=>{
    console.log("The server is up")
});