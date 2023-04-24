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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <form onSubmit={handleSubmit}>

        <label>
          Nombre:
          <input type="text" name='nombre' value={ticket.nombre} onChange={handleChange}/>
        </label>

        <label>
          Apellido:
          <input type="text" name='apellido' value={ticket.apellido} onChange={handleChange}/>
        </label>

        <label>
          precio:
          <input type="number" name='precio'  onChange={handleChange}/>
        </label>

        <button type='submit'>enviar</button>
      </form>
        {download && <button onClick={handleDownload}>descargar ticket</button>}

      
      <p>nombre: {ticket.nombre}</p>
      <p>apellido: {ticket.apellido}</p>
      <p>total a pagar: {ticket.precio}</p>
      <p>codigo del ticket: {id}</p>
        {/*mensaje && <h2>muchas gracias por viajar con nosotros</h2>*/}

      <a href="https://projecto-grado-python-production.up.railway.app/admin" style={{fontSize:"12px"}}>login</a>
      
    
      
    </main>
  )
}
