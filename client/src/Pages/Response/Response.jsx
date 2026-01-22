import React from 'react'
import ResponseForm from '../../Components/Response-Form/ResponseForm'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Response = () => {
    const { id } = useParams();
    const [Form, setForm] = useState([])

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/forms/${id}`);
                console.log('Fetched form:', response.data);
                setForm(response.data.data);
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        };

        fetchForm();
    }, []);
    
  return (
    <div>
        <ResponseForm form={Form} />
    </div>
  )
}

export default Response