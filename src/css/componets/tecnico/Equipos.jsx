import React from "react";
import axios from "axios";
import { urlApi } from "../../../services/apirest";
import FormularioAlquiler from "./FormularioAlquiler";

class Equipos extends React.Component {
  state = {
    registros: [],
    pagina_actual: 1,
    cadena_busqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    limit: 10,
    notificacion: null,
    mostraModal: false,
    equipoSelecionado: null
  };

  // 1. Corregido: this.setState en lugar de this.state
  mostraModalNuevo = () => {
    this.setState({
      mostraModal: true,
      equipoSelecionado: null
    });
  };

  cerrarModal = () => {
    this.setState({ mostraModal: false });
  };

  // 2. Corregido: Separación con ; e indentación
  alGuardar = () => {
    this.cargarDatos(); // recargar datos 
    this.cerrarModal(); // cerrar ventana 
  };

  mostrarNotificacion = (texto, tipo) => {
    this.setState({ notificacion: { texto, tipo } });
    setTimeout(() => {
      this.setState({ notificacion: null });
    }, 3000);
  };

  componentDidMount = () => {
    this.cargarDatos();
  };

  paginaSiguiente = () => {
    if (this.state.pagina_actual < this.state.total_paginas) {
      this.setState({ pagina_actual: this.state.pagina_actual + 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  paginaAnterior = () => {
    if (this.state.pagina_actual > 1) {
      this.setState({ pagina_actual: this.state.pagina_actual - 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  handleBuscar = (e) => {
    this.setState(
      { cadena_busqueda: e.target.value, pagina_actual: 1 },
      () => {
        this.cargarDatos();
      }
    );
  };

  busqueda = (e) => {
    if (e.key === "Enter") {
      this.setState(
        { cadena_busqueda: e.target.value, pagina_actual: 1 },
        () => {
          this.cargarDatos();
        }
      );
    }
  };

  cargarDatos = () => {
    let url =
      urlApi +
      "equipos?page=" +
      this.state.pagina_actual +
      "&string=" +
      this.state.cadena_busqueda +
      "&limit=" +
      this.state.limit;
    axios
      .get(url, { headers: { Authorization: "Bearer " + this.state.token } })
      .then((response) => {
        this.setState({
          registros: response.data.data || [],
          total_paginas: response.data.totalPages || 0,
        });
      })
      .catch((error) => {
        this.mostrarNotificacion("Error al cargar los datos", "error");
      });
  };

  // 3. Corregido: Lógica para abrir modales conectada
  irNuevo = () => {
    this.mostraModalNuevo();
  };

  irEditar = (id) => {
    // Buscamos el equipo completo en la lista de registros para pasarlo al formulario
    const equipo = this.state.registros.find(r => r.id === id);
    this.setState({
      mostraModal: true,
      equipoSelecionado: equipo
    });
  };

  eliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el equipo: ${nombre}?`)) {
      let url = urlApi + "equipos/" + id;
      axios
        .delete(url, {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
        .then((response) => {
          this.mostrarNotificacion("Registro eliminado correctamente", "exito");
          this.cargarDatos();
        })
        .catch((error) => {
          this.mostrarNotificacion(error.message || "Error al eliminar", "error");
        });
    }
  };

  render() {
    const { notificacion } = this.state;
    return (
      <div className="container mt-4">
        {/* ... (Notificaciones y encabezados se mantienen igual) ... */}
        {notificacion && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: notificacion.tipo === "exito" ? "#d4edda" : "#f8d7da",
              color: notificacion.tipo === "exito" ? "#155724" : "#721c24",
              fontWeight: "600",
              zIndex: 9999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {notificacion.texto}
          </div>
        )}

        <h1 className="mb-4">Equipos</h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={this.irNuevo}>
            Nuevo registro
          </button>
          <div className="col-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, por equipo_id"
              onKeyDown={this.busqueda}
              onChange={this.handleBuscar} // <- Agregado para que actualice al borrar
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">marca</th>
                <th scope="col">modelo</th>
                <th scope="col">numero_serie</th>
                <th scope="col">tipo_equipo</th>
                <th scope="col">fecha_compra</th>
                <th scope="col">empleado_id</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron registros
                  </td>
                </tr>
              ) : (
                this.state.registros.map((value, index) => (
                  <tr key={value.id || index}>
                    <th scope="row">{value.id}</th>
                    <td>{value.marca}</td>
                    <td>{value.modelo}</td>
                    {/* Typo corregido aquí abajo (numero_serie) */}
                    <td>{value.numero_serie}</td>
                    <td>{value.tipo_equipo}</td>
                    <td>{value.fecha_compra}</td>
                    <td>{value.empleado_id}</td>
                    <td>
                      <svg
                        onClick={() => this.irEditar(value.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#007aff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ cursor: "pointer", marginRight: "8px" }}
                      >
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>

                      <svg
                        onClick={() => this.eliminar(value.id, value.marca + ' ' + value.modelo)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff2d55"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex align-items-center mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.paginaAnterior}
            style={{ marginRight: "10px" }}
            disabled={this.state.pagina_actual === 1}
          >
            Anterior
          </button>

          <input
            type="text"
            readOnly
            value={this.state.pagina_actual + " de " + (this.state.total_paginas || 1)}
            style={{ marginRight: "10px", textAlign: "center", width: "120px" }}
            className="form-control d-inline"
          />

          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.paginaSiguiente}
            disabled={this.state.pagina_actual >= this.state.total_paginas || this.state.total_paginas === 0}
          >
            Siguiente
          </button>
        </div>

        {/* 4. Corregido: Invocación correcta del componente Formulario y de los estilos */}
{this.state.mostraModal && (
          <div className="modal-overlay" style={modalStyles.overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <FormularioAlquiler
                equipoEditar={this.state.equipoSelecionado}
                cerrarModal={this.cerrarModal}
                alGuardar={this.alGuardar}
                mostrarNotificacion={this.mostrarNotificacion}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}


// Estilos para ventana modal
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
}

export default Equipos;