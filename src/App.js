import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './css/componets/Login';
import Tecnico from './css/componets/tecnico/Tecnico';
import Equipos from './css/componets/tecnico/Equipos';
//importar las rutas del hedert

class App extends React.Component {
  notificacion = (mensaje, tipo = 'info', duracion = 3000) => {
    let container = document.querySelector('.notif-container');
    const notif = document.createElement('div');
    notif.className = `notif-toast ${tipo}`;
    notif.innerText = mensaje;
    container.appendChild(notif);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notif.classList.add('show');
      });
    });
    setTimeout(() => {
      notif.classList.remove('show');
      notif.classList.add('fade-out');
      notif.addEventListener('transitionend', () => {
        notif.remove();
      });
    }, duracion);
  }

  render() {
    return (
      <div className="App">
        <div className='notif-container'></div>
        <Router>
          <Routes>
            <Route path='/' element={<Login notificacion={this.notificacion} />} />
            <Route path='/tecnico' element={<Tecnico notificacion={this.notificacion} />} />
            <Route path='/equipo' element={<Equipos notificacion={this.notificacion} />} />

            
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;