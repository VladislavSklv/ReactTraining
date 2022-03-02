import React, {useState, useRef, useMemo, useEffect} from "react";
import PostList from "../components/PostList";
import MyButton from "../components/UI/button/MyButton";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter";
import MyModal from "../components/UI/MyModal/MyModal";
import { usePosts } from "../hooks/usePosts.js";
import { useFetching } from "../hooks/useFetching.js";
import '../styles/App.css';
import PostService from "../API/PostService.js";
import Loader from "../components/UI/Loader/Loader";
import { getPageCount } from "../utils/pages";
import Pagination from "../components/UI/pagination/Pagination";
import MySelect from "../components/UI/select/MySelect";
import { useObserver } from "../hooks/useObserver";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const lastElement = useRef();

    const [fetchPosts, isPostsLoading, postError] = useFetching( async () => {
        const response = await PostService.getAll(limit, page);
        setPosts([...posts, ...response.data]);
        const totalCount = (response.headers['x-total-count']);
        setTotalPages(getPageCount(totalCount, limit));
    });

    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1);
    });

    useEffect(() => {
        fetchPosts(limit, page);
    }, [page, limit]);

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
        <MySelect
            value={limit}
            onChange={value => setLimit(value)}
            defaultValue='Number of elements on page'
            options={[
                {value: 5, name: '5'},
                {value: 10, name: '10'},
                {value: 25, name: '25'},
                {value: -1, name: 'All'},
            ]}
        />
        {postError &&
            <h1 style={{textAlign: 'center', color: 'rgb(200, 0, 5)'}}>Error: {postError}</h1>
        }
            <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Posts'/>
            <div ref={lastElement} style={{height: 20}}></div>
        {isPostsLoading &&
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader /></div>
        }
            
        </div>
    );
}

export default Posts;