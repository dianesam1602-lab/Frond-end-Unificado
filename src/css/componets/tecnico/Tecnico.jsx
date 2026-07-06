import React from "react";
import axios from "axios";
import { urlApi } from "../../../services/apirest";
import { confirm } from "../Confirmation";
import FormularioTecnico from "./FormularioTecnico";

class Tecnico extends React.Component {

    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        limit: 10,
        notificacion: null,
        mostraModal: false,
        tecnicoSelecionado: null
    }

    mostraModalNuevo = () => {
        this.setState({
            mostraModal: true,
            tecnicoSelecionado: null
        })
    }

    mostraModalEditar = (id) => {
        this.setState({
            mostraModal: true,
            tecnicoSelecionado: id
        })
    }

    cerrarModal = () => {
        this.setState({ mostraModal: false })
    }

    alGuardar = () => {
        this.cargarDatos();
        this.cerrarModal();
    }

    mostrarNotificacion = (texto, tipo) => {
        this.setState({ notificacion: { texto, tipo } });
        setTimeout(() => {
            this.setState({ notificacion: null });
        }, 3000);
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    paginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos() }
            );
        }
    }

    paginaAnterior = () => {
        if (this.state.pagina_actual > 1) {
            this.setState(
                { pagina_actual: this.state.pagina_actual - 1 },
                () => { this.cargarDatos() }
            );
        }
    }

    cargarDatos = () => {
        let url = urlApi + "tecnico?page=" + this.state.pagina_actual
            + "&string=" + this.state.cadena_busqueda
            + "&limit=" + this.state.limit;

        axios
            .get(url, { headers: { 'Authorization': 'Bearer ' + this.state.token } })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                });
            })
            .catch(() => {
                this.mostrarNotificacion("Error al cargar los datos", "error");
            });
    }

    eliminar = async (id, nombre) => {
        if (await confirm(`¿Está seguro de eliminar el registro: ${nombre}?`)) {
            let url = urlApi + "tecnico/" + id;
            axios
                .delete(url, {
                    headers: { 'Authorization': `Bearer ${this.state.token}` }
                })
                .then(() => {
                    this.mostrarNotificacion("Registro eliminado correctamente", "exito");
                    this.cargarDatos();
                })
                .catch(error => {
                    this.mostrarNotificacion(error.message || "Error al eliminar", "error");
                });
        }
    }

    busqueda = (e) => {
        if (e.key === 'Enter') {
            this.setState(
                {
                    cadena_busqueda: e.target.value,
                    pagina_actual: 1
                },
                () => { this.cargarDatos(); }
            );
        }
    }

    render() {
        const { notificacion } = this.state;
        return (
            <div>
                {notificacion && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        backgroundColor: notificacion.tipo === 'exito' ? '#d4edda' : '#f8d7da',
                        color: notificacion.tipo === 'exito' ? '#155724' : '#721c24',
                        fontWeight: '600',
                        zIndex: 9999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                        {notificacion.texto}
                    </div>
                )}

                <h1>Tecnico</h1>
                <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
                    <button className="btn btn-success" onClick={this.mostraModalNuevo}>Nuevo registro</button>
                    <input
                        type="text"
                        onKeyDown={this.busqueda}
                        className="form-control"
                        placeholder="Buscar por nombre, nombre_completo, teléfono"
                    />

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Usuario</th>
                                <th scope="col">Nombre Completo</th>
                                <th scope="col">Correo</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Especialidad</th>
                                <th scope="col">Fecha Registro</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => (
                                <tr key={index}>
                                    <th scope="row">{value.id}</th>
                                    <td>{value.usuario}</td>
                                    <td>{value.nombre_completo}</td>
                                    <td>{value.correo}</td>
                                    <td>{value.telefono}</td>
                                    <td>{value.especialidad}</td>
                                    <td>{value.fecha_registro}</td>
                                    <td>
                                        <svg onClick={() => this.mostraModalEditar(value)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="28" height="28" viewBox="0 0 24 24"
                                            fill="none" stroke="#007aff" strokeWidth="1"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            style={{ cursor: 'pointer' }}>
                                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                            <path d="M16 5l3 3" />
                                        </svg>
                                        <svg onClick={() => this.eliminar(value.id, value.nombre_completo)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="28" height="28" viewBox="0 0 24 24"
                                            fill="none" stroke="#ff2d55" strokeWidth="1"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            style={{ cursor: 'pointer' }}>
                                            <path d="M4 7l16 0" />
                                            <path d="M10 11l0 6" />
                                            <path d="M14 11l0 6" />
                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="button" className="btn btn-secondary"
                        onClick={this.paginaAnterior} style={{ marginRight: "10px" }}>
                        Anterior
                    </button>
                    <input type="text" readOnly
                        value={this.state.pagina_actual + " de " + this.state.total_paginas}
                        style={{ marginRight: "10px", textAlign: "center", width: "120px" }}
                    />
                    <button type="button" className="btn btn-secondary"
                        onClick={this.paginaSiguiente}>
                        Siguiente
                    </button>
                </div>

                {this.state.mostraModal && (
                    <div className="modal-overlay" style={modalStyles.overlay}>
                        <div style={modalStyles.content}>
                            <FormularioTecnico
                                tecnicoAEditar={this.state.tecnicoSelecionado}
                                onClose={this.cerrarModal}
                                onGuardar={this.alGuardar}
                                notificacion={this.props.notificacion}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

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

export default Tecnico;
