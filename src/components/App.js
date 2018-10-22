import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRecipe, removeFromCalendar } from '../actions';

class App extends Component {

  render() {
    console.log('Props: ', this.props);

    return (
      <div className="App">
        <h1>Hello, World!</h1>
      </div>
    );
  }
}

// Currying
function mapDispatchToProps(dispatch) {
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),
    removeRecipe: (data) => dispatch(removeFromCalendar(data))
  }
}

function mapStateToProps(calendar) {
  const dayOrde = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return {
    calendar: dayOrde.map(day => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal] ? calendar[day][meal] : null;

        return meals;
      }, {})
    }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
