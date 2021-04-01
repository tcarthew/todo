import { useState } from 'react';

const useFormFieldValues = (initialState) => {
    const [fields, setFieldValues] = useState(initialState);

    return [
        fields,
        (event) => {
            setFieldValues({
                ...fields,
                [event.target.name ?? event.target.id]: event.target.value
            });
        }
    ]
}

export { useFormFieldValues };