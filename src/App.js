import React, {useState, useRef, useMemo} from "react";
import Counter from "./components/Counter";
import ClassCounter from "./components/ClassCounter";
import PostItem from "./components/PostItem";
import PostList from "./components/PostList";
import MyButton from "./components/UI/button/MyButton";
import MyInput from "./components/UI/input/MyInput";
import PostForm from "./components/PostForm";
import MySelect from "./components/UI/select/MySelect";
import PostFilter from "./components/PostFilter";
import './styles/App.css';

function App() {
  const [posts, setPosts] = useState([
    {id: 1, title: 'JavaScript 1 ', body: 'Decription'},
    {id: 2, title: 'JavaScript 2 ', body: 'Decription'},
    {id: 3, title: 'JavaScript 3 ', body: 'Decription'},
  ]);

  const [filter, setFilter] = useState({sort: '', query: ''});

  const sortedPosts = useMemo(() => {
    if(filter.sort){
      return [...posts].sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]));
    }
    return posts;
  }, [filter.sort, posts]);

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.title.toLowerCase().includes(filter.query.toLowerCase()));
  }, [filter.query, sortedPosts]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id));
  };

  return (
    <div className="App">
      <PostForm create={createPost}/>
      <hr style={{margin: '15px'}}/>
      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />
        <PostList remove={removePost} posts={sortedAndSearchedPosts} title='JS Posts'/>
    </div>
  );
}

export default App;
