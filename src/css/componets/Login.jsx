import React from "react";
import { urlApi } from '../../services/apirest';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Login.css";
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBCheckbox
} from 'mdb-react-ui-kit';

class Login extends React.Component {

    state = {
        form: {
            username: "",
            password: ""
        }
    }

    manejadorOnChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            }
        }, () => console.log(this.state.form));
    }

    manejadorLogin = () => {
        console.log("Enviando:", this.state.form);
        let url = urlApi + "auth/login";

        const { notificacion } = this.props;

        axios
            .post(url, this.state.form)
            .then(response => {
                console.log("Respuesta del backend:", response.data);
                if (response.data.message === "Logueo exitoso") {
                    notificacion("Logueo exitoso", "success");
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("idusuario", response.data.id);
                    setTimeout(() => {
                        this.props.navigate('/tecnico');
                    }, 1000);
                } else {
                    notificacion(response.data.message, "error");
                }
            })
            .catch(error => {
                if (error.response) {
                    notificacion("Error: " + error.response.data.message, "error");
                } else if (error.request) {
                    notificacion("No se pudo conectar con el servidor", "error");
                }
            });
    }

    render() {
        return (
            <MDBContainer fluid className="p-3 my-5" style={{ maxWidth: '1300px' }}>
                <MDBRow>

                    <MDBCol col='10' md='6'>
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="img-fluid"
                            alt="Phone image"
                        />
                    </MDBCol>

                    <MDBCol col='4' md='6'>

                        <div className="mb-4">
                            <label className="form-label">Usuario</label>
                            <input
                                className="form-control form-control-lg"
                                type="text"
                                name="username"
                                placeholder="Ingresa tu usuario"
                                onChange={this.manejadorOnChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Contraseña</label>
                            <input
                                className="form-control form-control-lg"
                                type="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                onChange={this.manejadorOnChange}
                            />
                        </div>

                        <div className="d-flex justify-content-between mx-4 mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Recuérdame' />
                            <a href="#!">¿Olvidaste tu contraseña?</a>
                        </div>

                        <MDBBtn
                            className="mb-4 w-100"
                            size="lg"
                            onClick={this.manejadorLogin}
                        >
                            Iniciar sesión
                        </MDBBtn>

                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0">O</p>
                        </div>

                        <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>
                            <MDBIcon fab icon="facebook-f" className="mx-2" />
                            Continuar con Facebook
                        </MDBBtn>

                        <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#55acee' }}>
                            <MDBIcon fab icon="twitter" className="mx-2" />
                            Continuar con Twitter
                        </MDBBtn>

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}

export default ContenedorNavegacion;