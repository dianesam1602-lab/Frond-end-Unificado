import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../../services/apirest";

const FormularioTecnico = ({ tecnicoAEditar, onClose, onGuardar, notificacion }) => {

  // 1. Estado inicial del formulario — campos de la tabla `tecnico`
  const [form, setForm] = useState({
    usuario: '',
    contrasena: '',
    nombre_completo: '',
    correo: '',
    telefono: '',
    especialidad: '',
    fecha_registro: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (tecnicoAEditar) {
      setForm({
        usuario: tecnicoAEditar.usuario || '',
        contrasena: '',               // Por seguridad, no se precarga la contraseña
        nombre_completo: tecnicoAEditar.nombre_completo || '',
        correo: tecnicoAEditar.correo || '',
        telefono: tecnicoAEditar.telefono || '',
        especialidad: tecnicoAEditar.especialidad || '',
        fecha_registro: tecnicoAEditar.fecha_registro
          ? tecnicoAEditar.fecha_registro.slice(0, 16)
          : ''
      });
    } else {
      setForm({
        usuario: '',
        contrasena: '',
        nombre_completo: '',
        correo: '',
        telefono: '',
        especialidad: '',
        fecha_registro: ''
      });
    }
  }, [tecnicoAEditar]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Envío del formulario (POST = crear / PUT = editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    const method = tecnicoAEditar ? 'put' : 'post';
    const url = tecnicoAEditar
      ? urlApi + `tecnico/${tecnicoAEditar.id}`   // PUT — editar por ID
      : urlApi + 'tecnico';                        // POST — crear nuevo

    // En edición, si la contraseña está vacía, no la enviamos
    const data = { ...form };
    if (tecnicoAEditar && !data.contrasena) {
      delete data.contrasena;
    }

    try {
      await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });

      notificacion(tecnicoAEditar ? 'Técnico actualizado' : 'Técnico registrado');
      onGuardar();
      onClose();

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{tecnicoAEditar ? 'Editar Técnico' : 'Nuevo Técnico'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            required
            maxLength="40"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>
            {tecnicoAEditar ? 'Nueva Contraseña (dejar vacío para no cambiar):' : 'Contraseña:'}
          </label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            required={!tecnicoAEditar}   // Solo obligatoria al crear
            maxLength="255"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleChange}
            required
            maxLength="100"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
            maxLength="100"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            maxLength="20"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Especialidad:</label>
          <input
            type="text"
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            required
            maxLength="50"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha de Registro:</label>
          <input
            type="datetime-local"
            name="fecha_registro"
            value={form.fecha_registro}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormularioTecnico;
