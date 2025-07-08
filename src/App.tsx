 import './App.css'
import { Router, Route } from '@solidjs/router'
import Home from './pages/Home'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
const App = () => {
  return (
    <Router>
      <Route path="/" component={MainLayout}>
        <Route path="" component={Home} />
        <Route path="chat" component={Chat} />
        <Route path="post/:id" component={PostDetail} />
        <Route path="create-post" component={CreatePost} />
      </Route>

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="*" component={NotFound} />
    </Router>
  );
};

export default App
