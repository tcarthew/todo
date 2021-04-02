import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Item = ({ todo }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleDelete = () => {
        console.log('handle delete');
    };
    const handleEdit = () => {
        console.log('handle edit');
    };

    return (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0 h5 text-muted" onClick={() => setIsCollapsed(!isCollapsed)}>
              { todo.title }
            </h5>
          </div>
          <div className={`card-body ${isCollapsed ? 'collapse' : ''}`}>
            <p>{todo.description}</p>
            <div className="d-flex flex-row-reverse">
              <a href="#" className="mr-1" onClick={handleDelete}><FontAwesomeIcon icon={ faTrash } size="2x" /></a>
              <a href="#" className="mr-2" onClick={handleEdit}><FontAwesomeIcon icon={ faEdit } size="2x" /></a>
            </div>
          </div>
        </div>
      );
}

export default Item;