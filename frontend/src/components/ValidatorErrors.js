export default function ValidatorErrors({errors}) {
  return (<>
    { errors && errors.map(({param, msg}, idx) => 
      <p key={idx}> Issue with {param}: {msg} </p>
    )}
  </>);
}
