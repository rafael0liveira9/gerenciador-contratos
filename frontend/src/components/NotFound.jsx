import { useParams, useNavigate } from 'react-router-dom';

function NotFound() {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-illustration">
          <div className="ghost">
            <div className="ghost-body">
              <div className="ghost-eyes">
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              <div className="ghost-mouth"></div>
            </div>
            <div className="ghost-tail">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          </div>
          <div className="shadow"></div>
        </div>

        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Oops! Empresa nao encontrada</h2>

        <p className="not-found-message">
          A empresa <strong>"{slug}"</strong> nao existe ou foi removida.
          <br />
          Parece que esse fantasma engoliu a pagina que voce procura!
        </p>

        <div className="not-found-actions">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Voltar
          </button>
          <button onClick={() => navigate('/select')} className="btn-home">
            Ir para Select
          </button>
        </div>

        <div className="not-found-suggestions">
          <p>Verifique se:</p>
          <ul>
            <li>O slug da empresa esta correto</li>
            <li>A empresa ainda esta ativa no sistema</li>
            <li>Voce tem permissao para acessar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
