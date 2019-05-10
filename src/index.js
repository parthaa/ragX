import React, { Component } from 'react';
import { render } from 'react-dom';
import Selector from './components/Selector'
import Dashboard from './components/Dashboard';

import {GENRES, SHRUTIS, RagaCalculator} from './utils/RagaCalculator';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      raga: '',
      genre: 'Carnatic',
      shruti: 'C'
    };
  }

  nameize = (items) => {
    return items.map(item => {
      return {name: item}
    });
  }

  render() {
    const ragaCalculator = new RagaCalculator(this.state)
    const ragas = ragaCalculator.fetchRagas();
    const shrutis = this.nameize(SHRUTIS)
    const genres = this.nameize(GENRES)

    return (
      <div>
        <Selector title="Select the Base Shruti"
                  items={shrutis}
                  onSelection={(name) => this.setState({shruti: name.name})} />

        <Selector title="Select the Genre"
                  items={genres}
                  onSelection={(name) => this.setState({genre: name.name})} />

        <Selector title="Select the Raga"
                  items={ragas}
                  onSelection={(name) => this.setState({raga:name})} />

        <Dashboard transposes={ragaCalculator.calculate()}
                    shruti={this.state.shruti}
                    raga = {this.state.raga.name}
                    swaras = {this.state.raga.swaras}/>

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
