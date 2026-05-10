import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ButtonGroup, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_API_URL + '/category'

const Category = () => {
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState({ id: 0, name: '' })
  const [modalAdd, setModalAdd] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { getAll() }, [])

  const getAll = async () => {
    await axios.get(baseURL).then(res => setCategories(res.data)).catch(err => console.log(err))
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
    if (confirm('Category ' + id + ' will be deleted!')) {
      axios.delete(baseURL + '/delete/' + id).then(() => getAll()).catch(err => console.log(err))
    }
  }

  return (
    <div>
      <Modal show={modalAdd} onHide={() => setModalAdd(false)}>
        <Modal.Header closeButton>ADD CATEGORY</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={handleSubmit(onAdd)}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Name (max 16 chars)"
                {...register('name', { required: true, maxLength: 16 })} />
              {errors.name && <p style={{ color: 'red' }}>Name is required (max 16 chars)</p>}
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Add</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      <Modal show={modalUpdate} onHide={() => setModalUpdate(false)}>
        <Modal.Header closeButton>UPDATE CATEGORY</Modal.Header>
        <Card><Card.Body>
          <Form onSubmit={e => { e.preventDefault(); onUpdate() }}>
            <Form.Group className="mb-3">
              <Form.Control type="text" value={selected.id} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Name" value={selected.name}
                onChange={e => setSelected({ ...selected, name: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ float: 'right' }}>Update</Button>
          </Form>
        </Card.Body></Card>
      </Modal>

      <Card>
        <Card.Header>Categories</Card.Header>
        <Card.Body>
          <Container fluid>
            <ButtonGroup className="float-end mb-2">
              <Button variant="primary" onClick={() => setModalAdd(true)}>Add</Button>
            </ButtonGroup>
            <Table striped bordered hover>
              <thead>
                <tr><th>ID</th><th>NAME</th><th>OPERATIONS</th></tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td style={{ textAlign: 'left' }}>{cat.name}</td>
                    <td>
                      <ButtonGroup className="me-2">
                        <Button variant="outline-warning" onClick={() => onOpenUpdate(cat.id)}>Update</Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button variant="outline-danger" onClick={() => onDelete(cat.id)}>Delete</Button>
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

export default Category
