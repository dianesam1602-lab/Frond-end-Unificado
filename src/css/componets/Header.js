import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <center>
                <Link to = '/'>
                    <Button style={{marginRight: "10px"}}>Resumen</Button>
                </Link>
                <Link to = '/selecciones'>
                    <Button style={{marginRight: "10px"}}>Selecciones</Button>
                </Link>
            </center>
        </div>
    );
}

export default Header;