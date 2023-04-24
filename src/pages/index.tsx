import fileDownload from 'js-file-download';
import { Inter } from 'next/font/google';
import {use, useState} from 'react';
import axios from 'axios';
import { Producto } from '@/interfaces/interfaces';
//const inter = Inter({ subsets: ['latin'] })



const tickets: Producto = {
  nombre: "",
  apellido: "",
  precio: 0
};

export default function Home() {

  const [mensaje, setMensaje] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  const [ticket, setTicket] = useState<Producto>(tickets);
  const [id, setId] = useState<string>('');
  const [pdf, setPdf] = useState<string>('');


  async function handleDownload(){

    try {
      
      const response = await axios.get(`tickets/${id}/download-pdf/`, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data)
      setPdf(url);

      fileDownload(response.data, 'ticket.pdf')
    } catch (error){
      console.log(error)
    }
  }

 async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    try{
    const response = await axios.post("https://projecto-grado-python-production.up.railway.app/tickets/", ticket)

    console.log(response.data)

    setId(response.data?.uuid)

    setDownload(true)
    if(response.status === 201){
      //window.alert("muchas gracias por viajar con nosotros")
      setMensaje(true)
    }
    } catch (error){
      console.error(error)
    }
 }

 function handleChange (event: React.ChangeEvent<HTMLInputElement>){
    const {name, value } = event.target;
    setTicket({...ticket, [name]: value})
 }
  return (
    <main className="bg-gray-500  dark:bg-gray-500 text-black flex min-h-screen flex-col items-center justify-between p-24">
      <div className='max-w-md mx-auto rounded-lg shadow-md overflow-hidden'>
      <form onSubmit={handleSubmit} className='p-6 bg-orange-400 flex flex-col justify-center'>

          <div className='mb-6'>
        <label>
          Nombre:
          <input type="text" name='nombre' value={ticket.nombre} onChange={handleChange} className='ml-1'/>
        </label>
        </div>

        <div className='mb-6'>
        <label>
          Apellido:
          <input type="text" name='apellido' value={ticket.apellido} onChange={handleChange} className='ml-1'/>
        </label>
        </div>

        <div className='mb-6'>
        <label>
          precio: 
          <input type="number" name='precio'  onChange={handleChange} className='ml-5'/>
        </label>
        </div>

        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'>enviar</button>
      </form>
      </div>
        {download && <button onClick={handleDownload}>descargar ticket</button>}

      
      <p>nombre: {ticket.nombre}</p>
      <p>apellido: {ticket.apellido}</p>
      <p>total a pagar: {ticket.precio}</p>
      <p>codigo del ticket: {id}</p>
        {mensaje && <h2>muchas gracias por viajar con nosotros</h2>}

      <a href="http://127.0.0.1:8000/admin" style={{fontSize:"24px"}}>login</a>
      
    
      
    </main>
  )
}
