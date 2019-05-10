import React, { Component } from 'react';
import { render } from 'react-dom';
import Selector from './Selector'
import './style.css';
import {GENRES, SHRUTIS, RagaCalculator} from './RagaCalculator';
class App extends Component {
  constructor() {
    super();
    this.state = {
      raga: '',
      genre: 'Carnatic',
      shruti: undefined
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
        <p>
          {this.state.raga.name}

        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
