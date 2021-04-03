import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';

import { getTodos } from '../store/queries/todos';
import { deleteTodo, createTodo, updateTodo } from '../store/mutations/todos';
import ItemForm from '../components/ItemForm';
import ConfirmDialog from '../dialogs/ConfirmDialog';

const ItemsList = () => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [formItem, setFormItem] = useState(null);
    const [confirmDeleteOpts, setConfirmDeleteOpts] = useState({
        title: 'Confirm Delete',
        description: '',
        showDialog: false,
        onClose: null
    })

    const { token } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.todos);

    const handleAdd = () => {
        setFormItem({
            id: 0,
            title: '',
            description: '',
            isComplete: false
        })
        setShowForm(true);
    }
    const handleDelete = (item) => {
        setConfirmDeleteOpts({
            ...confirmDeleteOpts,
            description: `Are you sure you want to delete "${item.title}"?`,
            showDialog: true,
            onClose: (value) => onConfirmDeleteClose(value, item)
        });
    };
    const onConfirmDeleteClose = (result, item) => {
        if (result){
            deleteTodo(dispatch, item.id, token);
        }

        setConfirmDeleteOpts({
            ...confirmDeleteOpts,
            showDialog: false,
            onClose: null
        });
    }
    
    const handleEdit = (item) => {
        setFormItem(item);
        setShowForm(true);
    };

    const cancelTodo = () => {
        setShowForm(false);
        setFormItem(null);
    }
    const saveTodo = (saveItem) => {
        if (saveItem.id === 0){
            createTodo(dispatch, saveItem, token);
        } else {
            updateTodo(dispatch, saveItem, token)
        }
        setShowForm(false);
    }
    const displayComplete = (item) => {
        if (item && item.isComplete) {
            return Moment(item.lastUpdate).format('yyyy-MM-DD hh:mm:ss');
        }

        return '';
    }

    useEffect(() => {
        getTodos(dispatch, token);
    }, [])

    return (
        <div className="col">
            <div className="row justify-content-start">
                <div className="col-2">
                    <h1>Todo Items</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Created</th>
                                <th>Completed</th>
                                <th>Complete?</th>
                                <th>&nbsp;</th>
                                <th><a href="#" className="mr-2" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /></a></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(todo => (
                                <tr key={todo.id}>
                                    <td>{todo.title}</td>
                                    <td>{ Moment(todo.created).format('yyyy-MM-DD hh:mm:ss') }</td>
                                    <td>{ displayComplete(todo) }</td>
                                    <td>{todo.isComplete ? 'Yes' : 'No'}</td>
                                    <td><a href="#" className="mr-2" onClick={() => handleEdit(todo)}><FontAwesomeIcon icon={faEdit} /></a></td>
                                    <td><a href="#" className="mr-1" onClick={() => handleDelete(todo)}><FontAwesomeIcon icon={faTrash} /></a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                <div className="col-4">
                    {showForm &&
                        <ItemForm
                            item={formItem}
                            onCancel={cancelTodo}
                            onSave={saveTodo}
                        />}
                </div>
            </div>
            <ConfirmDialog {...confirmDeleteOpts} />
        </div>
    );
}

export default ItemsList;