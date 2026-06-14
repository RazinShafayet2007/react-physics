import './App.css';
import { NewtonThirdLaw, NewtonSecondLaw, NewtonFirstLaw } from './Newton.tsx';
import TheoryOfRelativity from './Einstein.tsx';

function App() {
  return (
    <div className="App">
      <NewtonFirstLaw />
      <NewtonSecondLaw />
      <NewtonThirdLaw />
      <TheoryOfRelativity />
    </div>
  );
}

export default App;