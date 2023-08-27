import React, { useState, FormEvent } from 'react';
import {
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const FORM_STATE_DATA_ENTRY = 0;
const FORM_STATE_WAITING = 1;
const FORM_STATE_SUCCESS = 2;
const FORM_STATE_ERROR = 3;

function MariaDBAccountForm(props: any) {
  const [email, setEmail] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLFormElement;
      if ( element.checkValidity() ) {
        props.setFormState( FORM_STATE_WAITING );
        let token = '';
        if ( executeRecaptcha ) {
          token = await executeRecaptcha!( 'request' );
        } else {
          console.log( 'executeRecaptcha not yet available' );
        }
        element.classList.remove('was-validated');
        fetch(
          process.env.REACT_APP_BACKEND_URL + '/requests',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( {email, token} )
          }
        )
        .then( (response: any) => response.json() )
        .then( (data: any) => {
          console.log( data );
          props.setFormState( FORM_STATE_SUCCESS );
        })
        .catch( (err: any) => {
          console.log( "There was a problem creating a new account request.");
          props.setFormState( FORM_STATE_ERROR );
        });
      } else {
        element.classList.add('was-validated');
      }
  }

  return(
    <div className='col-md-12 order-md-1'>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="col mb-3">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email"
              value={email} onChange={e => setEmail( e.target.value )}
              required
              pattern=".+@nic\.bc\.ca|.+@northislandcollege\.ca|.+@koehler.ca" />
            <div className="invalid-feedback">
              A valid email address is required.
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block"
                type="submit">Request MariaDB Account</button>
      </form>
    </div>
  );
}

function MariaDBAccountSuccess() {
  return(
    <div className='alert alert-success' role="alert">
      Check your email for a link and further instructions.
    </div>
  );
}

function MariaDBAccountError() {
  return(
    <div className='alert alert-danger' role="alert">
      There was a problem with your request. Come back and try again later.
    </div>
  );
}

function MariaDBAccountWaiting() {
  return(
    <div>
      <div className="spinner-border m-3" role="status">
        <span className="visually-hidden">processing...</span>
      </div>
      <span>processing...</span>
    </div>
  );
}

function MariaDBAccount() {
  const [formState, setFormState] = useState( FORM_STATE_DATA_ENTRY );

  return (
    <div>
      <div className="py-5">
        <h2>MariaDB Account</h2>
        <p>You must enter a valid "@nic.bc.ca" or "@northislandcollege.ca"
           email address. You will be emailed a link that will
           allow you to create a new MariaDB account, or reset the
           password if an account already exists for your
           email address.</p>
      </div>

      <div className="row">
        { formState === FORM_STATE_DATA_ENTRY && <MariaDBAccountForm setFormState={setFormState} />}
        { formState === FORM_STATE_WAITING && <MariaDBAccountWaiting />}
        { formState === FORM_STATE_SUCCESS && <MariaDBAccountSuccess />}
        { formState === FORM_STATE_ERROR && <MariaDBAccountError />}
      </div>

    </div>
  );
}

export default MariaDBAccount;
