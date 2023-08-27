import React, { useEffect, useState, FormEvent } from 'react';

interface VerifyProps {
  match: {
    params: {
      token: string
    }
  }
}

const FORM_STATE_DATA_ENTRY = 0;
const FORM_STATE_WAITING = 1;
const FORM_STATE_SUCCESS = 2;
const FORM_STATE_ERROR = 3;
const FORM_STATE_LOADING = 4;

function MariaDBAccountVerifyWaiting(props: any) {
  return(
    <div>
      <div className="spinner-border m-3" role="status">
        <span className="visually-hidden">{props.message}</span>
      </div>
      <span>{props.message}</span>
    </div>
  );
}

function MariaDBAccountVerifyError(props: any) {
  return(
    <div className='alert alert-danger' role="alert">
      {props.message}
    </div>
  );
}

function MariaDBAccountVerifySuccess(props: any) {
  return(
    <div className='alert alert-success' role="alert">
      {props.message}
    </div>
  );
}


function MariaDBAccountVerifyForm(props: any) {
  const [password, setPassword] = useState( '' );

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLFormElement;
      if ( element.checkValidity() ) {
        props.setFormState( FORM_STATE_WAITING );
        element.classList.remove('was-validated');
        fetch(
          process.env.REACT_APP_BACKEND_URL + '/accounts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
              password,
              token: props.token
            } )
          }
        )
        .then( (response: any) => response.json() )
        .then( (data: any) => {
          props.setMessage( data.message );
          props.setFormState( FORM_STATE_SUCCESS );

        })
        .catch( (err: any) => {
          console.log( "There was a problem creating a new account.");
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
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password"
              value={password} onChange={e => setPassword( e.target.value )}
              required />
            <div className="invalid-feedback">
              A password is required.
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block"
                type="submit">{props.operation} MariaDB Account</button>
      </form>
    </div>

  );
}

function MariaDBAccountVerify(props: VerifyProps) {
  const [formState, setFormState] = useState( FORM_STATE_LOADING );
  const [operation, setOperation] = useState( 'Create' );
  const [email, setEmail] = useState( '' );
  const [message, setMessage] = useState( 'OK' );

  useEffect(()=>{
    fetch( process.env.REACT_APP_BACKEND_URL +
      '/requests/' +
      props.match.params.token )
    .then( (response: any) => response.json() )
    .then( (data: any) => {
      console.log( data );
      if ( data.message.startsWith( 'Invalid') ) {
        setMessage( data.message );
        setFormState( FORM_STATE_ERROR );
      } else {
        setEmail( data.email );
        if ( data.message === 'update' ) {
          setOperation( 'Update' );
        }
        setFormState( FORM_STATE_DATA_ENTRY );
      }
    })
    .catch( (err: any) => {
      console.log( "There was a problem fetching the account request.");
      setMessage( 'There was a problem. Come back later and try again.');
      setFormState( FORM_STATE_ERROR );
    });
  }, []);


  return (
    <div>
      <div className="py-5">
        <h2>{operation} MariaDB Account</h2>
        <p>For email address: {email}.</p>
      </div>

      <div className="row">
        { formState === FORM_STATE_DATA_ENTRY && <MariaDBAccountVerifyForm
                                                    setFormState={setFormState}
                                                    token={props.match.params.token}
                                                    setMessage={setMessage}
                                                    operation={operation} />}
        { formState === FORM_STATE_WAITING && <MariaDBAccountVerifyWaiting
                                                    message={'processing...'}/>}
        { formState === FORM_STATE_SUCCESS && <MariaDBAccountVerifySuccess
                                                    message={message}/>}
        { formState === FORM_STATE_ERROR && <MariaDBAccountVerifyError
                                                    message={message}/>}
        { formState === FORM_STATE_LOADING && <MariaDBAccountVerifyWaiting
                                                    message={'loading...'}/>}
      </div>

    </div>
  );
}

export default MariaDBAccountVerify;
