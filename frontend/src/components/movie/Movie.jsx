import { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ButtonGroup, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_API_URL + '/movie'
const pdfURL = import.meta.env.VITE_APP_API_URL + '/pdf/movies'

const Movie = () => {
  const [movies, setMovies] = useState([])
  const [selected, setSelected] = useState({ id: 0, title: '', director: '', year: '' })
  const [modalAdd, setModalAdd] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [modalImage, setModalImage] = useState(false)
  const [imageMovieId, setImageMovieId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { getAll() }, [])

  const getAll = async () => {
    await axios.get(baseURL).then(res => setMovies(res.data)).catch(err => console.log(err))
  }

  const onAdd = async (data) => {
    await axios.post(baseURL + '/add', { ...data, year: parseInt(data.year) })
      .then(() => { reset(); setModalAdd(false); getAll() })
      .catch(err => console.log(err))
  }

  const onOpenUpdate = async (id) => {
    await axios.get(baseURL + '/get/' + id).then(res => setSelected(res.data)).catch(err => console.log(err))
    setModalUpdate(true)
  }

  const onUpdate = async () => {
    await axios.put(baseURL + '/update/' + selected.id, selected).then(() => getAll()).catch(err => console.log(err))
    setModalUpdate(false)
  }

  const onDelete = (id) => {
    if (confirm('Movie ' + id + ' will be deleted!')) {
      axios.delete(baseURL + '/delete/' + id).then(() => getAll()).catch(err => console.log(err))
    }
  }

  const onOpenImage = (id) => {
    setImageMovieId(id)
    setImagePreview(null)
    setModalImage(true)
  }

  const onUploadImage = async () => {
    const file = fileInputRef.current.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    await axios.post(baseURL + '/upload/' + imageMovieId, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => { setModalImage(false); getAll() }).catch(err => console.log(err))
  }

  const getImageUrl = (movie) => {
    if (!movie.imageName) return null
    return baseURL + '/image/' + movie.id
  }

  const openPdf = () => {
    window.open(pdfURL, '_blank')
  }

  return (
    <div>
      {/* ADD MODAL */}
      <Modal show={modalAdd} onHide={() => setModalAdd(false)}>
        <Modal.Header closeButton>ADD MOVIE</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={handleSubmit(onAdd)}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Title (max 32 chars)"
                {...register('title', { required: true, maxLength: 32 })} />
              {errors.title && <p style={{ color: 'red' }}>Title is required (max 32 chars)</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Director (max 16 chars)"
                {...register('director', { required: true, maxLength: 16 })} />
              {errors.director && <p style={{ color: 'red' }}>Director is required (max 16 chars)</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="number" placeholder="Year"
                {...register('year', { required: true, min: 1888, max: 2100 })} />
              {errors.year && <p style={{ color: 'red' }}>Valid year is required</p>}
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Add</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal show={modalUpdate} onHide={() => setModalUpdate(false)}>
        <Modal.Header closeButton>UPDATE MOVIE</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={e => { e.preventDefault(); onUpdate() }}>
            <Form.Group className="mb-3">
              <Form.Control type="text" value={selected.id} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Title" value={selected.title || ''}
                onChange={e => setSelected({ ...selected, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Director" value={selected.director || ''}
                onChange={e => setSelected({ ...selected, director: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="number" placeholder="Year" value={selected.year || ''}
                onChange={e => setSelected({ ...selected, year: parseInt(e.target.value) })} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Update</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      {/* IMAGE UPLOAD MODAL */}
      <Modal show={modalImage} onHide={() => setModalImage(false)}>
        <Modal.Header closeButton>UPLOAD POSTER</Modal.Header>
        <Card><Card.Body>
          <Form.Group className="mb-3">
            <Form.Control type="file" accept="image/*" ref={fileInputRef}
              onChange={e => {
                const f = e.target.files[0]
                if (f) setImagePreview(URL.createObjectURL(f))
              }} />
          </Form.Group>
          {imagePreview && (
            <img src={imagePreview} alt="preview" style={{ width: '100%', marginBottom: '10px', borderRadius: '4px' }} />
          )}
          <Button variant="success" onClick={onUploadImage} style={{ float: 'right' }}>Upload</Button>
        </Card.Body></Card>
      </Modal>

      {/* MAIN TABLE */}
      <Card>
        <Card.Header>Movies</Card.Header>
        <Card.Body>
          <Container fluid>
            <div className="float-end mb-2">
              <ButtonGroup className="me-2">
                <Button variant="primary" onClick={() => setModalAdd(true)}>Add Movie</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="danger" onClick={openPdf}>📄 PDF Report</Button>
              </ButtonGroup>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr><th>ID</th><th>TITLE</th><th>DIRECTOR</th><th>YEAR</th><th>POSTER</th><th>OPERATIONS</th></tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td style={{ textAlign: 'left' }}>{movie.title}</td>
                    <td style={{ textAlign: 'left' }}>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>
                      {getImageUrl(movie)
                        ? <img src={getImageUrl(movie)} alt="poster" style={{ height: '50px', borderRadius: '4px' }} />
                        : <span style={{ color: '#aaa' }}>No image</span>
                      }
                    </td>
                    <td>
                      <ButtonGroup className="me-2">
                        <Button variant="outline-warning" onClick={() => onOpenUpdate(movie.id)}>Update</Button>
                      </ButtonGroup>
                      <ButtonGroup className="me-2">
                        <Button variant="outline-success" onClick={() => onOpenImage(movie.id)}>Image</Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button variant="outline-danger" onClick={() => onDelete(movie.id)}>Delete</Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Movie
