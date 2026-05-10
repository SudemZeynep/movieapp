import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react'
import MyNavbar from './components/MyNavbar.jsx'
import Movie from './components/movie/Movie.jsx'
import Category from './components/category/Category.jsx'
import Classification from './components/classification/Classification.jsx'

const App = () => {
  const [page, setPage] = useState('movies')

  return (
    <div>
      <MyNavbar onHandle={setPage} />
      <div className="main-content">
        {
          {
            'movies': <Movie />,
            'categories': <Category />,
            'classifications': <Classification />,
          }[page]
        }
      </div>
    </div>
  )
}

export default App
