import { Link } from "react-router-dom"

const VisiumSTDocs = () => {
  return (
    <div className="docs-container">
      <header className="docs-header">
        <div className="container">
          <Link to="/" className="back-link">
            ← Back to Documentation
          </Link>
          <h1>Visium ST Data Preparation</h1>
        </div>
      </header>

      <main className="container">
        <div className="docs-content">
          <p className="lead">
            This page will contain detailed documentation about Visium spatial transcriptomics data preparation.
          </p>
          <p>Coming soon...</p>
        </div>
      </main>
    </div>
  )
}

export default VisiumSTDocs
