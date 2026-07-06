import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../../services/apirest";

const FormularioAlquiler = ({ equipoEditar, cerrarModal, alGuardar, mostrarNotificacion }) => {

  // 1. Estado inicial del formulario (Cambiado a numero_serie)
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    numero_serie: '', 
    tipo_equipo: '',
    fecha_compra: '',
    empleado_id: localStorage.getItem('id') || ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (equipoEditar) {
      setForm({
        ...equipoEditar,
        // Soportamos ambos nombres por si el backend te devuelve numero_serie o modelo_serie
        numero_serie: equipoEditar.numero_serie || equipoEditar.modelo_serie || '',
        fecha_compra: equipoEditar.fecha_compra
          ? equipoEditar.fecha_compra.slice(0, 10)
          : ''
      });
    } else {
      setForm({
        marca: '', 
        modelo: '', 
        numero_serie: '', 
        tipo_equipo: '', 
        fecha_compra: '',
        empleado_id: localStorage.getItem('id') || ''
      });
    }
  }, [equipoEditar]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const method = equipoEditar ? 'put' : 'post';
    const url = equipoEditar
      ? urlApi + `equipos/${equipoEditar.id}` 
      : urlApi + 'equipos';                   

    try {
      await axios({
        method: method,
        url: url,
        data: form, // Aquí se enviará como "numero_serie"
        headers: { Authorization: `Bearer ${token}` }
      });

      if (mostrarNotificacion) {
        mostrarNotificacion(
          equipoEditar ? 'Equipo actualizado correctamente' : 'Equipo registrado con éxito', 
          'exito'
        );
      }
      
      if (alGuardar) {
        alGuardar(); 
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar el equipo');
      } else {
        setError('Ocurrió un error inesperado de red o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{equipoEditar ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Marca:</label>
          <input
            type="text" name="marca" value={form.marca} onChange={handleChange}
            required maxLength="50"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text" name="modelo" value={form.modelo} onChange={handleChange}
            required maxLength="50"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Número de serie:</label>
          {/* CORREGIDO: Tanto el name como el value ahora son numero_serie */}
          <input
            type="text" 
            name="numero_serie" 
            value={form.numero_serie} 
            onChange={handleChange}
            required maxLength="90"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Tipo de equipo:</label>
          <select
            name="tipo_equipo"
            value={form.tipo_equipo}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Seleccione un tipo...</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Servidor">Servidor</option>
            <option value="Tablet">Tablet</option>
            <option value="Impresora">Impresora</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fecha compra:</label>
          <input
            type="date" name="fecha_compra" value={form.fecha_compra} onChange={handleChange}
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Empleado ID:</label>
          <input
            type="number" name="empleado_id" value={form.empleado_id} onChange={handleChange}
            required maxLength="11"
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          
          <button type="button" onClick={cerrarModal} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAlquiler;