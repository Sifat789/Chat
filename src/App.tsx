
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import ChatInterFace from './Pages/ChatInterFace'
import { Provider } from 'react-redux/es/exports'
import store from './Redux/ReduxStore'

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signUp' element={<SignUp />}></Route>
            <Route path='/chatroom/:recieverId/:combineID' element={<ChatInterFace />}></Route>
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
