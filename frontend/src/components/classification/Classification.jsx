import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ButtonGroup, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_API_URL + '/classification'
const movieURL = import.meta.env.VITE_APP_API_URL + '/movie'
const categoryURL = import.meta.env.VITE_APP_API_URL + '/category'

const Classification = () => {
  const [classifications, setClassifications] = useState([])
  const [movies, setMovies] = useState([])
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState({ id: 0, movieId: '', categoryId: '', date: '' })
  const [modalAdd, setModalAdd] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    getAll()
    axios.get(movieURL).then(res => setMovies(res.data)).catch(err => console.log(err))
    axios.get(categoryURL).then(res => setCategories(res.data)).catch(err => console.log(err))
  }, [])

  const getAll = async () => {
    await axios.get(baseURL + '/join').then(res => setClassifications(res.data)).catch(err => console.log(err))
  }

  const onAdd = async (data) => {
    await axios.post(baseURL + '/add', data).then(() => { reset(); setModalAdd(false); getAll() }).catch(err => console.log(err))
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
    if (confirm('Classification ' + id + ' will be deleted!')) {
      axios.delete(baseURL + '/delete/' + id).then(() => getAll()).catch(err => console.log(err))
    }
  }

  return (
    <div>
      <Modal show={modalAdd} onHide={() => setModalAdd(false)}>
        <Modal.Header closeButton>ADD CLASSIFICATION</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={handleSubmit(onAdd)}>
            <Form.Group className="mb-3">
              <Form.Label>Movie</Form.Label>
              <Form.Select {...register('movieId', { required: true })}>
                <option value="">Select movie...</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </Form.Select>
              {errors.movieId && <p style={{ color: 'red' }}>Movie is required</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select {...register('categoryId', { required: true })}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
              {errors.categoryId && <p style={{ color: 'red' }}>Category is required</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" {...register('date', { required: true })} />
              {errors.date && <p style={{ color: 'red' }}>Date is required</p>}
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Add</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      <Modal show={modalUpdate} onHide={() => setModalUpdate(false)}>
        <Modal.Header closeButton>UPDATE CLASSIFICATION</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={e => { e.preventDefault(); onUpdate() }}>
            <Form.Group className="mb-3">
              <Form.Label>Movie</Form.Label>
              <Form.Select value={selected.movieId}
                onChange={e => setSelected({ ...selected, movieId: e.target.value })}>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={selected.categoryId}
                onChange={e => setSelected({ ...selected, categoryId: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={selected.date || ''}
                onChange={e => setSelected({ ...selected, date: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Update</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      <Card>
        <Card.Header>Classifications (Movie - Category Join)</Card.Header>
        <Card.Body>
          <Container fluid>
            <ButtonGroup className="float-end mb-2">
              <Button variant="primary" onClick={() => setModalAdd(true)}>Add</Button>
            </ButtonGroup>
            <Table striped bordered hover>
              <thead>
                <tr><th>ID</th><th>MOVIE</th><th>CATEGORY</th><th>DATE</th><th>OPERATIONS</th></tr>
              </thead>
              <tbody>
                {classifications.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td style={{ textAlign: 'left' }}>{c.movie?.title}</td>
                    <td style={{ textAlign: 'left' }}>{c.category?.name}</td>
                    <td>{c.date}</td>
                    <td>
                      <ButtonGroup className="me-2">
                        <Button variant="outline-warning" onClick={() => onOpenUpdate(c.id)}>Update</Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button variant="outline-danger" onClick={() => onDelete(c.id)}>Delete</Button>
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

export default Classification
