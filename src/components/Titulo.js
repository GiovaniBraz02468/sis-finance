import './Titulo.css';

function Titulo({ titulo }) {
    return (
        <div className='divCenter'>
            <h3 className='divTitulo'>{titulo}</h3>
        </div>
    )
}

export default Titulo