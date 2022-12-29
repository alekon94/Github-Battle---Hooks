import React from 'react'
import queryString from 'query-string'
import { fetchItem, fetchPosts, fetchComments } from '../utils/api'
import Loading from './Loading'
import PostMetaInfo from './PostMetaInfo'
import Title from './Title'
import Comment from './Comment'
function postReducer(state, action) {
  if (action.type === 'start') {
    return {
      ...state,
      loadingPost: false
    }
  } else if (action.type === 'comments') {
    return {
      ...state,
      comments: action.comments
    }

  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.message,
      loadingPost: false,
      loadingComments: false
    }
  }
}
export default function Post({ location }) {
  const { id } = queryString.parse(location.search)
  const [state, dispatch] = React.useReducer(
    postReducer,
    {
      post: null,
      loadingPost: true,
      comments: null,
      loadingComments: true,
      error: null,
    }
  )
  React.useEffect(() => {
    fetchItem(id)
      .then((post) => {
        dispatch({ type: 'start', post })
        return fetchComments(post.kids || [])
      })
      .then((comments) => dispatch({ type: 'start', comments })
      )
      .catch(({ message }) => dispatch({ type: 'start', message })
      )
  }, [id])
  if (state.error) {
    return <p className='center-text error'>{error}</p>
  }

  return (
    <React.Fragment>
      {state.loadingPost === true
        ? <Loading text='Fetching post' />
        : <React.Fragment>
          <h1 className='header'>
            <Title url={state.post.url} title={state.post.title} id={state.post.id} />
          </h1>
          <PostMetaInfo
            by={state.post.by}
            time={state.post.time}
            id={state.post.id}
            descendants={state.post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: state.post.text }} />
        </React.Fragment>}
      {state.loadingComments === true
        ? state.loadingPost === false && <Loading text='Fetching comments' />
        : <React.Fragment>
          {state.comments.map((comment) =>
            <Comment
              key={comment.id}
              comment={comment}
            />
          )}
        </React.Fragment>}
    </React.Fragment>
  )
}
// export default class Post extends React.Component {
//   state = {
//     post: null,
//     loadingPost: true,
//     comments: null,
//     loadingComments: true,
//     error: null,
//   }
//   componentDidMount() {
//     const { id } = queryString.parse(this.props.location.search)

//     fetchItem(id)
//       .then((post) => {
//         this.setState({ post, loadingPost: false })

//         return fetchComments(post.kids || [])
//       })
//       .then((comments) => this.setState({
//         comments,
//         loadingComments: false
//       }))
//       .catch(({ message }) => this.setState({
//         error: message,
//         loadingPost: false,
//         loadingComments: false
//       }))
//   }
//   render() {
//     const { post, loadingPost, comments, loadingComments, error } = this.state

//     if (error) {
//       return <p className='center-text error'>{error}</p>
//     }

//     return (
//       <React.Fragment>
//         {loadingPost === true
//           ? <Loading text='Fetching post' />
//           : <React.Fragment>
//             <h1 className='header'>
//               <Title url={post.url} title={post.title} id={post.id} />
//             </h1>
//             <PostMetaInfo
//               by={post.by}
//               time={post.time}
//               id={post.id}
//               descendants={post.descendants}
//             />
//             <p dangerouslySetInnerHTML={{ __html: post.text }} />
//           </React.Fragment>}
//         {loadingComments === true
//           ? loadingPost === false && <Loading text='Fetching comments' />
//           : <React.Fragment>
//             {comments.map((comment) =>
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//               />
//             )}
//           </React.Fragment>}
//       </React.Fragment>
//     )
//   }
// }
