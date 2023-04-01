import { useState } from 'react';
import './App.css';
import NavBar from './components/NavBar.js'
import Main from './components/Main.js'

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="App">
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <div className="container-fluid mt-5 d-flex justify-content-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <Main accounts={accounts} />

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
