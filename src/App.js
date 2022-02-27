import React, {useState, useRef, useMemo, useEffect} from "react";
import Counter from "./components/Counter";
import ClassCounter from "./components/ClassCounter";
import PostItem from "./components/PostItem";
import PostList from "./components/PostList";
import MyButton from "./components/UI/button/MyButton";
import MyInput from "./components/UI/input/MyInput";
import PostForm from "./components/PostForm";
import MySelect from "./components/UI/select/MySelect";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/MyModal/MyModal";
import { usePosts } from "./hooks/usePosts.js";
import { useFetching } from "./hooks/useFetching.js";
import './styles/App.css';
import axios from "axios";
import PostService from "./API/PostService.js";
import Loader from "./components/UI/Loader/Loader";
import { getPageCount, getPagesArray } from "./utils/pages";
import Pagination from "./components/UI/pagination/Pagination";

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({sort: '', query: ''});
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  const [fetchPosts, isPostsLoading, postError] = useFetching( async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = (response.headers['x-total-count']);
    setTotalPages(getPageCount(totalCount, limit));
  });

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  }

  return (
    <div className="App">
      <MyButton style={{marginTop: 20}} onClick={() => setModal(true)}>
        Add post
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px'}}/>
      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />
      {postError &&
        <h1 style={{textAlign: 'center', color: 'rgb(200, 0, 5)'}}>Error: {postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader /></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='JS Posts'/>
      }
      <Pagination page={page} changePage={changePage} totalPages={totalPages}/>
    </div>
  );
}

export default App;
