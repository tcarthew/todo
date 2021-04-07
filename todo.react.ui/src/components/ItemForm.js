import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useFormFieldValues } from '../hooks/useFormFields';

const ItemForm = ({ item, onCancel, onSave }) => {
    const { error } = useSelector(state => state.todos);
    const [fields, setFieldValue, resetFieldValues] = useFormFieldValues(item);
    const handleSubmit = () => {
        if (onSave) {
            onSave(fields);
        }
    }
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    }


    useEffect(() => {
        resetFieldValues(item);
    }, [item]);

    return (
        <div className="container-fluid">
            <div className="row">
                <form className="col-md" onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">{ item.id !== 0 ? 'Edit Item' : 'Add Item' }</h1>
                    {error}
                    <div className="form-group text-left">
                        <label>Title</label>
                        <input
                            name="title"
                            type="text"
                            component="input"
                            autoComplete="none"
                            className="form-control form-control-sm"
                            placeholder="Title"
                            value={fields.title}
                            onChange={setFieldValue}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label>Description</label>
                        <input
                            name="description"
                            component="textarea"
                            className="form-control form-control-sm"
                            placeholder="Description"
                            value={fields.description}
                            onChange={setFieldValue}
                        />
                    </div>
                    <div className="form-group text-left">
                        <input
                            name="isComplete"
                            type="checkbox"
                            checked={fields.isComplete}
                            onChange={setFieldValue}
                        />&nbsp;
                        <label className="form-check-label">Is Complete</label>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-default w-25" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary w-25 mr-2">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemForm;