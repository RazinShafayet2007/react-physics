import './App.css';
import { NewtonThirdLaw, NewtonSecondLaw, NewtonFirstLaw } from './Newton.tsx';

function App() {
  return (
    <div className="App">
      <NewtonFirstLaw />
      <NewtonSecondLaw />
      <NewtonThirdLaw />
    </div>
  );
}

export default App;