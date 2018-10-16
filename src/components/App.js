import React, { Component } from 'react';
import { addRecipe } from '../actions';

class App extends Component {

  state = {
    calendar: null
  }

  componentDidMount() {
    const { store } = this.props;

    store.subscribe(() => {
      this.setState(() => ({
        calendar: store.getState()
      }));
    });

  }

  submitFood() {
    const { store } = this.props;

    store.dispatch(addRecipe('monday',{ label: this.input.value }, 'breakfast'));
  }

  render() {
    return (
      <div className="App">
        <input
          text="text"
          ref={(text) => this.input = text}
          placeholder="Monday's breakfast"
        />

        <button onClick={this.submitFood.bind(this)} >Submit</button>

        <pre>
          Monday's breakfast: {this.state.calendar && this.state.calendar.monday.breakfast}
        </pre>
      </div>
    );
  }
}

export default App;
